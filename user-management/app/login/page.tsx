'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only the password is sent — it goes to a server-side route.
        // The actual ADMIN_PASSWORD env var is never sent to the browser.
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Incorrect password.')
        setLoading(false)
        return
      }

      // Redirect to the originally requested page or home
      const from = searchParams.get('from') || '/'
      router.replace(from)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-void)] px-4">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(116,251,68,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div
          className="rounded-2xl border border-[var(--border-panel)] bg-[var(--bg-panel)] p-8 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(116,251,68,0.05)' }}
        >
          {/* Logo mark */}
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 rounded-full border border-[var(--border-glow)] flex items-center justify-center"
              style={{ background: 'rgba(116,251,68,0.08)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="text-[var(--accent-mint)]">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          <h1 className="text-center text-[var(--text-primary)] font-display text-lg mb-1 tracking-wide">
            Response Manager
          </h1>
          <p className="text-center text-[var(--text-muted)] text-xs font-marcellus mb-7">
            PEC E-Summit '26 — Internal Tool
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-marcellus text-[var(--text-secondary)] uppercase tracking-widest mb-2"
              >
                Access Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all
                  focus:border-[var(--accent-mint)] focus:ring-1 focus:ring-[var(--accent-mint)]"
              />
            </div>

            {error && (
              <p className="text-xs text-[#FF4D3D] font-marcellus flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-lg py-2.5 text-sm font-bold tracking-wider uppercase transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                bg-[var(--accent-mint)] text-[#060D0B]
                hover:brightness-110 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Unlock'
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-4 text-xs text-[var(--text-muted)]">
          E-Cell PEC, Chandigarh
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
