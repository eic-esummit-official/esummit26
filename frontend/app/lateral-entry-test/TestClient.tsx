'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { SafeQuestion } from './actions'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string
  email: string
  isLeader: boolean
}

type Phase = 'proctoring' | 'details' | 'test' | 'submitting' | 'done' | 'error'

interface TestClientProps {
  initialQuestions: SafeQuestion[]
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'
const MAX_VIOLATIONS = 3

// ─── Helpers ─────────────────────────────────────────────────────────────────

const categoryColor: Record<string, string> = {
  Entrepreneurship: '#f97316',
  DBMS: '#3b82f6',
  Aptitude: '#a855f7',
  OOPS: '#10b981',
  DSA: '#f43f5e',
}

const difficultyBadge: Record<string, string> = {
  Easy: '#22c55e',
  Medium: '#f59e0b',
  Hard: '#ef4444',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimerRing({
  total,
  remaining,
  color,
}: {
  total: number
  remaining: number
  color: string
}) {
  const r = 26
  const circ = 2 * Math.PI * r
  const pct = remaining / total
  const dash = circ * pct
  const urgent = remaining <= 10

  return (
    <svg width={64} height={64} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={32} cy={32} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
      <circle
        cx={32}
        cy={32}
        r={r}
        fill="none"
        stroke={urgent ? '#ef4444' : color}
        strokeWidth={5}
        strokeDasharray={circ}
        strokeDashoffset={circ - dash}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
      />
      <text
        x={32}
        y={32}
        textAnchor="middle"
        dominantBaseline="central"
        fill={urgent ? '#ef4444' : '#fff'}
        fontSize={13}
        fontWeight={700}
        style={{ transform: 'rotate(90deg)', transformOrigin: '32px 32px', fontVariantNumeric: 'tabular-nums' }}
      >
        {remaining}
      </text>
    </svg>
  )
}

function ProctoringGate({ onGranted }: { onGranted: () => void }) {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')
  const [fsError, setFsError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const requestPermissions = useCallback(async () => {
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        videoRef.current.play().catch(() => {})
      }
      setStatus('granted')
    } catch {
      setStatus('denied')
    }
  }, [])

  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen()
      setFsError(false)
    } catch {
      setFsError(true)
    }
  }, [])

  const proceed = useCallback(async () => {
    await requestFullscreen()
    onGranted()
  }, [requestFullscreen, onGranted])

  return (
    <div style={styles.overlay}>
      <div style={styles.gateCard}>
        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={styles.eventBadge}>EIC VENTUREX · LATERAL ENTRY TEST</div>
          <h1 style={styles.gateTitle}>Proctoring Setup</h1>
          <p style={styles.gateSubtitle}>
            This test requires camera &amp; microphone access and full-screen mode.
            <br />
            Your camera feed is <strong>never recorded or uploaded</strong>.
          </p>
        </div>

        {/* Camera preview */}
        <div style={styles.cameraPipLarge}>
          {status === 'granted' ? (
            <video ref={videoRef} autoPlay playsInline muted style={styles.cameraVideo} />
          ) : (
            <div style={styles.cameraPlaceholder}>
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}>
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 8 }}>
                Camera preview will appear here
              </span>
            </div>
          )}
          {status === 'granted' && (
            <div style={styles.liveIndicator}>
              <span style={styles.liveDot} />
              LIVE
            </div>
          )}
        </div>

        {/* Permission status rows */}
        <div style={styles.permRow}>
          {[
            { label: 'Camera', icon: '📷', ok: status === 'granted' },
            { label: 'Microphone', icon: '🎙️', ok: status === 'granted' },
            { label: 'Full Screen', icon: '⛶', ok: !fsError && status === 'granted' },
          ].map((p) => (
            <div key={p.label} style={styles.permItem}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <span style={{ ...styles.permLabel, color: p.ok ? '#22c55e' : 'rgba(255,255,255,0.5)' }}>
                {p.label}
              </span>
              <span style={{ fontSize: 16 }}>{p.ok ? '✅' : '⏳'}</span>
            </div>
          ))}
        </div>

        {status === 'denied' && (
          <div style={styles.errorBanner}>
            ⚠️ Camera/Microphone access was denied. Please allow permissions in your browser settings and reload the page.
          </div>
        )}

        {/* Actions */}
        {status === 'idle' || status === 'denied' ? (
          <button style={styles.primaryBtn} onClick={requestPermissions}>
            {status === 'denied' ? '🔄 Retry Permissions' : '🎥 Enable Camera & Microphone'}
          </button>
        ) : status === 'requesting' ? (
          <button style={{ ...styles.primaryBtn, opacity: 0.6 }} disabled>
            Requesting permissions…
          </button>
        ) : (
          <button style={styles.primaryBtn} onClick={proceed}>
            Enter Full Screen &amp; Begin →
          </button>
        )}

        <p style={styles.disclaimer}>
          By proceeding you confirm this is your team's first and only attempt.
        </p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TestClient({ initialQuestions }: TestClientProps) {
  const [phase, setPhase] = useState<Phase>('proctoring')
  const [questions] = useState<SafeQuestion[]>(initialQuestions)

  // Team details
  const [teamName, setTeamName] = useState('')
  const [college, setCollege] = useState('')
  const [leaderPhone, setLeaderPhone] = useState('')
  const [members, setMembers] = useState<TeamMember[]>([{ name: '', email: '', isLeader: true }])
  const [detailsError, setDetailsError] = useState('')
  const [phoneChecking, setPhoneChecking] = useState(false)

  // Test state
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({}) // questionId → selectedOption
  const [timeLeft, setTimeLeft] = useState(45)
  const [violations, setViolations] = useState(0)
  const [violationMsg, setViolationMsg] = useState('')

  // Camera PiP during test
  const pipVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [submitError, setSubmitError] = useState('')

  // ── Refs to break stale closures ──
  // These are kept in sync with state so that handleSubmit (called from
  // timer / advanceQuestion closures) always reads current values.
  const teamDetailsRef = useRef({ teamName: '', college: '', leaderPhone: '', members: members })
  const answersRef = useRef<Record<string, string>>({})
  const violationsRef = useRef(0)

  // Keep refs in sync with state
  useEffect(() => { teamDetailsRef.current = { teamName, college, leaderPhone, members } }, [teamName, college, leaderPhone, members])
  useEffect(() => { answersRef.current = answers }, [answers])
  useEffect(() => { violationsRef.current = violations }, [violations])

  const currentQuestion = questions[currentIdx]
  const totalQ = questions.length

  // ── Violation handler ──
  const addViolation = useCallback((reason: string) => {
    setViolations((v) => {
      const next = v + 1
      setViolationMsg(`⚠️ ${reason} (${next}/${MAX_VIOLATIONS})`)
      setTimeout(() => setViolationMsg(''), 4000)
      return next
    })
  }, [])

  // ── Fullscreen enforcement ──
  useEffect(() => {
    if (phase !== 'test') return
    const handler = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
        addViolation('Fullscreen exited')
      }
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [phase, addViolation])

  // ── Tab-visibility enforcement ──
  useEffect(() => {
    if (phase !== 'test') return
    const handler = () => {
      if (document.hidden) addViolation('Tab switched or window minimised')
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [phase, addViolation])

  // ── Auto-submit on max violations ──
  useEffect(() => {
    if (violations >= MAX_VIOLATIONS && phase === 'test') {
      handleSubmit(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [violations, phase])

  // ── Per-question countdown ──
  useEffect(() => {
    if (phase !== 'test') return
    setTimeLeft(currentQuestion?.durationSeconds ?? 45)

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          advanceQuestion()
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, phase])

  // ── Attach camera stream to PiP video when test starts ──
  useEffect(() => {
    if (phase !== 'test') return
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = stream
          pipVideoRef.current.muted = true
          pipVideoRef.current.play().catch(() => {})
        }
      })
      .catch(() => {})
  }, [phase])

  // ── Cleanup stream on unmount ──
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const advanceQuestion = useCallback(() => {
    setCurrentIdx((i) => {
      if (i + 1 >= totalQ) {
        handleSubmit(false)
        return i
      }
      return i + 1
    })
  }, [totalQ]) // eslint-disable-line

  const selectAnswer = useCallback(
    (option: string) => {
      if (!currentQuestion) return
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))
      if (timerRef.current) clearInterval(timerRef.current)
      setTimeout(advanceQuestion, 400) // short pause to show selection
    },
    [currentQuestion, advanceQuestion],
  )

  const validateAndStartTest = useCallback(async () => {
    setDetailsError('')

    // Client-side quick checks (prevents unnecessary network round-trips)
    if (!teamName.trim()) return setDetailsError('Team name is required.')
    if (!college.trim()) return setDetailsError('College name is required.')
    if (!/^\d{10}$/.test(leaderPhone.replace(/\s+/g, '')))
      return setDetailsError('Enter a valid 10-digit phone number.')
    if (members.length < 1 || members.length > 4)
      return setDetailsError('Team must have 1–4 members.')
    if (!members.some((m) => m.isLeader))
      return setDetailsError('Please mark one member as Team Leader.')
    for (const m of members) {
      if (!m.name.trim()) return setDetailsError('All member names are required.')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email))
        return setDetailsError(`Invalid email for member: ${m.name || 'unnamed'}`)
    }

    // Full backend validation — validates DTO fields + checks phone uniqueness
    setPhoneChecking(true)
    try {
      const res = await fetch(`${BACKEND_URL}/venturex-test/validate-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: teamName.trim(),
          college: college.trim(),
          leaderPhone: leaderPhone.trim().replace(/\s+/g, ''),
          members,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = Array.isArray(err?.message)
          ? err.message.join(', ')
          : err?.message ?? 'Validation failed. Please check your details.'
        setDetailsError(msg)
        setPhoneChecking(false)
        return
      }
    } catch {
      setDetailsError('Unable to reach the server. Please check your internet connection.')
      setPhoneChecking(false)
      return
    }

    setPhoneChecking(false)
    setPhase('test')
  }, [teamName, college, leaderPhone, members])

  // Reads from refs so it always has current data even when called from stale closures
  const handleSubmit = useCallback(
    async (forcedByViolation = false) => {
      if (timerRef.current) clearInterval(timerRef.current)
      setPhase('submitting')

      const td = teamDetailsRef.current
      const currentAnswers = answersRef.current
      const currentViolations = violationsRef.current

      const payload = {
        teamName: td.teamName.trim(),
        college: td.college.trim(),
        leaderPhone: td.leaderPhone.trim().replace(/\s+/g, ''),
        members: td.members,
        answers: Object.entries(currentAnswers).map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })),
        violations: forcedByViolation ? MAX_VIOLATIONS : currentViolations,
      }

      try {
        const res = await fetch(`${BACKEND_URL}/venturex-test/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.message ?? `Server error ${res.status}`)
        }
        streamRef.current?.getTracks().forEach((t) => t.stop())
        document.exitFullscreen?.().catch(() => {})
        setPhase('done')
      } catch (e: any) {
        setSubmitError(e?.message ?? 'Submission failed. Please contact the organisers.')
        setPhase('error')
      }
    },
    [], // No deps needed — reads everything from refs
  )

  // ─── Member helpers ───────────────────────────────────────────────────────────

  const addMember = () => {
    if (members.length >= 4) return
    setMembers((prev) => [...prev, { name: '', email: '', isLeader: false }])
  }

  const removeMember = (i: number) => {
    if (members.length <= 1) return
    setMembers((prev) => prev.filter((_, idx) => idx !== i))
  }

  const updateMember = (i: number, field: keyof TeamMember, value: string | boolean) => {
    setMembers((prev) =>
      prev.map((m, idx) => {
        if (idx !== i) return field === 'isLeader' && value === true ? { ...m, isLeader: false } : m
        return { ...m, [field]: value }
      }),
    )
  }

  // ─── Phase renders ────────────────────────────────────────────────────────────

  if (phase === 'proctoring') {
    return <ProctoringGate onGranted={() => setPhase('details')} />
  }

  if (phase === 'details') {
    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.card, maxWidth: 640, overflowY: 'auto', maxHeight: '90vh' }}>
          <div style={styles.eventBadge}>EIC VENTUREX · LATERAL ENTRY TEST</div>
          <h2 style={styles.cardTitle}>Team Registration</h2>
          <p style={styles.cardSubtitle}>Fill in your team details before the test begins.</p>

          {/* Section A — Organisation */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Step 1 — Organisation</div>
            <label style={styles.label}>Team Name *</label>
            <input
              style={styles.input}
              placeholder="e.g. Phoenix Squad"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <label style={styles.label}>College / Institution *</label>
            <input
              style={styles.input}
              placeholder="e.g. Punjab Engineering College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
            <label style={styles.label}>Team Leader Phone Number *</label>
            <input
              style={styles.input}
              placeholder="10-digit mobile number"
              value={leaderPhone}
              onChange={(e) => setLeaderPhone(e.target.value)}
              maxLength={10}
              inputMode="numeric"
            />
          </div>

          {/* Section B — Members */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Step 2 — Team Members (1–4)</div>
            {members.map((m, i) => (
              <div key={i} style={styles.memberCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ color: '#a0aec0', fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
                    MEMBER {i + 1}
                  </span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: m.isLeader ? '#f97316' : 'rgba(255,255,255,0.5)' }}>
                      <input
                        type="radio"
                        name="teamLeader"
                        checked={m.isLeader}
                        onChange={() => updateMember(i, 'isLeader', true)}
                        style={{ accentColor: '#f97316' }}
                      />
                      Team Leader
                    </label>
                    {members.length > 1 && (
                      <button onClick={() => removeMember(i)} style={styles.removeBtn} title="Remove member">✕</button>
                    )}
                  </div>
                </div>
                <input
                  style={styles.input}
                  placeholder="Full name *"
                  value={m.name}
                  onChange={(e) => updateMember(i, 'name', e.target.value)}
                />
                <input
                  style={{ ...styles.input, marginTop: 8 }}
                  placeholder="Email address *"
                  type="email"
                  value={m.email}
                  onChange={(e) => updateMember(i, 'email', e.target.value)}
                />
              </div>
            ))}
            {members.length < 4 && (
              <button onClick={addMember} style={styles.addBtn}>+ Add Member</button>
            )}
          </div>

          {detailsError && <div style={styles.errorBanner}>{detailsError}</div>}

          <button
            style={{ ...styles.primaryBtn, marginTop: 24, opacity: phoneChecking ? 0.7 : 1 }}
            onClick={validateAndStartTest}
            disabled={phoneChecking}
          >
            {phoneChecking ? 'Verifying…' : 'Proceed to Test →'}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'test' && currentQuestion) {
    const progress = ((currentIdx) / totalQ) * 100
    const catColor = categoryColor[currentQuestion.category] ?? '#6366f1'
    const answered = answers[currentQuestion.id]

    return (
      <div style={styles.testShell}>
        {/* Camera PiP */}
        <div style={styles.cameraPip}>
          <video ref={pipVideoRef} autoPlay playsInline muted style={styles.cameraVideo} />
          <div style={styles.liveIndicator}>
            <span style={styles.liveDot} />
            LIVE
          </div>
        </div>

        {/* Violation warning */}
        {violationMsg && <div style={styles.violationToast}>{violationMsg}</div>}

        {/* Top bar */}
        <div style={styles.topBar}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>
            EIC VENTUREX
          </span>
          <div style={styles.progressWrap}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            {currentIdx + 1} / {totalQ}
          </span>
        </div>

        {/* Question area */}
        <div style={styles.questionArea}>
          {/* Category + difficulty */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
            <span style={{ ...styles.pill, background: catColor + '22', color: catColor, border: `1px solid ${catColor}44` }}>
              {currentQuestion.category}
            </span>
            <span style={{ ...styles.pill, background: (difficultyBadge[currentQuestion.difficulty] ?? '#6366f1') + '22', color: difficultyBadge[currentQuestion.difficulty] ?? '#6366f1', border: `1px solid ${(difficultyBadge[currentQuestion.difficulty] ?? '#6366f1')}44` }}>
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question text */}
          <p style={styles.questionText}>
            <span style={{ color: 'rgba(255,255,255,0.35)', marginRight: 10, fontSize: 18 }}>
              Q{currentQuestion.index}.
            </span>
            {currentQuestion.questionText}
          </p>

          {/* Options */}
          <div style={styles.optionsGrid}>
            {currentQuestion.options.map((opt, oi) => {
              const isSelected = answered === opt
              return (
                <button
                  key={oi}
                  style={{
                    ...styles.optionBtn,
                    ...(isSelected ? styles.optionSelected : {}),
                  }}
                  onClick={() => selectAnswer(opt)}
                  disabled={!!answered}
                >
                  <span style={styles.optionLetter}>{String.fromCharCode(65 + oi)}</span>
                  <span style={styles.optionText}>{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Timer */}
          <div style={styles.timerWrap}>
            <TimerRing total={currentQuestion.durationSeconds} remaining={timeLeft} color={catColor} />
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'submitting') {
    return (
      <div style={styles.overlay}>
        <div style={styles.centeredMessage}>
          <div style={styles.spinner} />
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 20 }}>Submitting your test…</p>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.card, textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <div style={styles.eventBadge}>EIC VENTUREX · LATERAL ENTRY TEST</div>
          <h2 style={{ ...styles.cardTitle, marginTop: 16 }}>Test Submitted!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginTop: 12 }}>
            Your responses have been recorded successfully.
            <br />
            Results will be announced after evaluation.
            <br />
            <strong style={{ color: '#f97316' }}>Good luck, {teamName}!</strong>
          </p>
          <div style={{ marginTop: 32, padding: '16px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>
              Questions attempted: {Object.keys(answers).length} / {totalQ}
            </p>
          </div>
          <a
            href="/"
            style={{ ...styles.primaryBtn, display: 'inline-block', marginTop: 28, textDecoration: 'none' }}
          >
            ← Back to E-Summit
          </a>
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.card, textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={styles.cardTitle}>Submission Error</h2>
          <p style={{ color: '#ef4444', marginTop: 12, lineHeight: 1.6 }}>{submitError}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 8 }}>
            Please contact the organisers immediately at the event helpdesk.
          </p>
          <button
            style={{ ...styles.primaryBtn, marginTop: 24 }}
            onClick={() => handleSubmit(false)}
          >
            🔄 Retry Submission
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ─── Inline styles (avoids any Tailwind dependency in this isolated page) ─────

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg, #050b06 0%, #0d1117 50%, #070d14 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 9999,
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '36px 40px',
    width: '100%',
  },
  gateCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: '40px 48px',
    width: '100%',
    maxWidth: 520,
  },
  eventBadge: {
    display: 'inline-block',
    background: 'rgba(249,115,22,0.12)',
    border: '1px solid rgba(249,115,22,0.3)',
    color: '#f97316',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    padding: '5px 14px',
    borderRadius: 100,
    marginBottom: 14,
  },
  gateTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 10px',
    letterSpacing: -0.5,
  },
  gateSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    lineHeight: 1.6,
    margin: 0,
  },
  cameraPipLarge: {
    width: '100%',
    height: 180,
    background: 'rgba(0,0,0,0.4)',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 24,
  },
  cameraPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  cameraVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  liveIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    borderRadius: 100,
    padding: '3px 10px',
    fontSize: 10,
    fontWeight: 700,
    color: '#ef4444',
    letterSpacing: 1,
  },
  liveDot: {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#ef4444',
    boxShadow: '0 0 6px #ef4444',
    animation: 'pulse 1s infinite',
  },
  permRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
  },
  permItem: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  permLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  errorBanner: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#fca5a5',
    fontSize: 13,
    lineHeight: 1.5,
    marginBottom: 16,
  },
  primaryBtn: {
    width: '100%',
    padding: '14px 20px',
    background: 'linear-gradient(135deg, #f97316, #ea580c)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 0.3,
    boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  disclaimer: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#fff',
    margin: '8px 0 4px',
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    marginBottom: 28,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: '#f97316',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  label: {
    display: 'block',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  memberCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: '16px 18px',
    marginBottom: 12,
  },
  removeBtn: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 6,
    color: '#fca5a5',
    fontSize: 12,
    padding: '3px 8px',
    cursor: 'pointer',
  },
  addBtn: {
    width: '100%',
    padding: '11px',
    background: 'transparent',
    border: '1px dashed rgba(255,255,255,0.15)',
    borderRadius: 12,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },
  // ── Test shell ──
  testShell: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(160deg, #050b06 0%, #0a0f1a 100%)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cameraPip: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 140,
    height: 105,
    borderRadius: 12,
    overflow: 'hidden',
    border: '1.5px solid rgba(239,68,68,0.4)',
    zIndex: 100,
    background: '#000',
    boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
  },
  violationToast: {
    position: 'fixed',
    top: 60,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(239,68,68,0.92)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    zIndex: 200,
    boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
    whiteSpace: 'nowrap',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '14px 24px',
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  progressWrap: {
    flex: 1,
    height: 4,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #f97316, #ea580c)',
    borderRadius: 100,
    transition: 'width 0.4s ease',
  },
  questionArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '32px min(8vw, 120px)',
    overflowY: 'auto',
    maxWidth: 860,
    margin: '0 auto',
    width: '100%',
  },
  pill: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    padding: '4px 12px',
    borderRadius: 100,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 'clamp(17px, 2.2vw, 23px)',
    fontWeight: 600,
    color: '#f0f4f8',
    lineHeight: 1.55,
    margin: '0 0 32px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 12,
  },
  optionBtn: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '16px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 14,
    color: '#e2e8f0',
    fontSize: 15,
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
  },
  optionSelected: {
    background: 'rgba(249,115,22,0.15)',
    border: '1px solid rgba(249,115,22,0.5)',
    color: '#fff',
  },
  optionLetter: {
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
  },
  optionText: {
    lineHeight: 1.4,
    flex: 1,
  },
  timerWrap: {
    position: 'fixed',
    top: 56,
    right: 24,
    zIndex: 50,
  },
  centeredMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#f97316',
    animation: 'spin 0.8s linear infinite',
  },
}
