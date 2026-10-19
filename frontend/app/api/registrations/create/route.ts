import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const upstream = await fetch(`${BACKEND_URL}/registrations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Backend unavailable'
    return NextResponse.json({ success: false, message }, { status: 502 })
  }
}
