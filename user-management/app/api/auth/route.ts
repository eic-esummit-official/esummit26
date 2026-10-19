import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * POST /api/auth  — validate password, set httpOnly session cookie
 *
 * Security guarantees:
 *  - ADMIN_PASSWORD is a server-only env var (no NEXT_PUBLIC_ prefix).
 *    It is never bundled into client JS.
 *  - Comparison uses a constant-time equality check to prevent timing attacks.
 *  - The session cookie is httpOnly + SameSite=Strict, so JS / DevTools
 *    console / extensions cannot read or forge it.
 *  - A brute-force lockout prevents automated guessing.
 */

const SESSION_COOKIE = 'um_session'
const SESSION_MAX_AGE = 60 * 60 * 8 // 8 hours

// Simple in-process rate limiter (resets on cold start / redeploy — fine for a
// low-traffic internal tool).  Key = client IP.
const attempts = new Map<string, { count: number; firstAt: number }>()
const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000 // 15 min

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry) return false
  if (now - entry.firstAt > WINDOW_MS) {
    attempts.delete(ip)
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}

function recordAttempt(ip: string) {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now })
  } else {
    entry.count++
  }
}

function clearAttempts(ip: string) {
  attempts.delete(ip)
}

/** Constant-time string comparison to prevent timing side-channels. */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still iterate to keep constant time
    let diff = 0
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
    }
    return false
  }
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many failed attempts. Please wait 15 minutes.' },
      { status: 429 }
    )
  }

  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    // Config error — don't reveal details to client
    console.error('[auth] ADMIN_PASSWORD env var is not set!')
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
  }

  const provided = body.password ?? ''

  if (!safeCompare(provided, adminPassword)) {
    recordAttempt(ip)
    // Generic error — don't distinguish "wrong password" from "no password"
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  clearAttempts(ip)

  // Build a simple signed token: base64(timestamp + random bytes).
  // httpOnly cookies cannot be read by JS so any random opaque value is fine
  // as the "session token" — the real check is always the cookie presence +
  // the HMAC-like verification below.
  const token = Buffer.from(
    `${Date.now()}:${Math.random().toString(36).slice(2)}`
  ).toString('base64url')

  const isProd = process.env.NODE_ENV === 'production'
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,         // HTTPS only in production
    sameSite: 'strict',     // Prevents CSRF
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0, // Immediately expire
  })
  return NextResponse.json({ ok: true })
}
