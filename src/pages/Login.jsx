import { useState } from 'react'
import { Eye, EyeOff, Zap, Loader2, AlertCircle, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const TICKER_ITEMS = [
  { label: 'BALANCE',  val: '₹1,24,500', up: true  },
  { label: 'FOOD',     val: '↑ 28%',     up: false },
  { label: 'SAVINGS',  val: '₹32,000',   up: true  },
  { label: 'INCOME',   val: '₹1,32,000', up: true  },
  { label: 'EXPENSES', val: '↑ 12%',     up: false },
  { label: 'UPI SYNC', val: '✓ LIVE',    up: true  },
  { label: 'APR 2025', val: 'ACTIVE',    up: true  },
  { label: 'SHOPPING', val: '↑ 5%',      up: false },
]

export default function Login() {
  const { login, loginWithGoogle, loading, authError } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [tab,      setTab]      = useState('login')
  const [filled,   setFilled]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    await login(email, password)
  }

  function fillDemo() {
    setEmail('aditi@finflow.app')
    setPassword('demo123')
    setShowPw(true)
    setFilled(true)
    setTimeout(() => setFilled(false), 2500)
  }

  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: '#050A06', fontFamily: 'Syne, sans-serif' }}>

      {/* ── Ticker tape ── */}
      <div
        className="flex-shrink-0 flex items-center overflow-hidden"
        style={{ height: 30, background: '#0a1a0c', borderBottom: '1px solid #1a3d1c' }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'tickerScroll 24s linear infinite' }}
        >
          {doubled.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 px-4 text-[10px] font-bold"
              style={{
                borderRight: '1px solid #1a3d1c',
                color: item.up ? '#4ade80' : '#f87171',
                fontFamily: 'DM Mono, monospace',
                letterSpacing: '0.05em',
              }}
            >
              <span style={{ color: '#2d4d30' }}>{item.label}</span>
              {item.val}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .login-input {
          width: 100%;
          background: #0a1a0c;
          border: 1px solid #1a3d1c;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #e2e8f0;
          outline: none;
          font-family: 'DM Mono', monospace;
          transition: border-color 0.15s;
        }
        .login-input:focus { border-color: #22c55e; }
        .login-input::placeholder { color: #2d4d30; }
        .login-input[type="password"] { letter-spacing: 0.15em; }
      `}</style>

      {/* ── Main body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ══ LEFT PANEL ══ */}
        <div
          className="hidden lg:flex lg:w-[52%] flex-col justify-between px-10 py-10 relative overflow-hidden"
          style={{ borderRight: '1px solid #1a3d1c' }}
        >
          {/* Large ghost ₹ */}
          <div
            className="absolute right-[-10px] top-1/2 -translate-y-1/2 pointer-events-none select-none"
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '220px',
              fontWeight: 500,
              color: '#0d200e',
              lineHeight: 1,
            }}
          >
            ₹
          </div>

          {/* Dot matrix */}
          <div
            className="absolute bottom-10 right-10 opacity-20"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 10px)', gap: '6px' }}
          >
            {Array(25).fill(0).map((_, i) => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#22c55e' }} />
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2.5 relative z-10">
            <div
              className="flex items-center justify-center"
              style={{ width: 32, height: 32, borderRadius: 8, background: '#22c55e' }}
            >
              <TrendingUp size={15} color="#050A06" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Fin<span style={{ color: '#22c55e' }}>Flow</span>
            </span>
          </div>

          {/* Hero */}
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-3">
              <div style={{ width: 20, height: 1, background: '#22c55e' }} />
              <span
                style={{
                  color: '#22c55e',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Personal Finance OS
              </span>
            </div>

            <h1
              style={{
                fontSize: 44,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
              }}
            >
              <span style={{ color: '#fff' }}>Know where</span>
              <br />
              <span style={{ color: '#fff' }}>every </span>
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1.5px #22c55e',
                }}
              >
                rupee
              </span>
              <br />
              <span style={{ color: '#fff' }}>goes.</span>
            </h1>

            <p style={{ color: '#4b6b4e', fontSize: 13, lineHeight: 1.75, maxWidth: 260 }}>
              Track income, expenses, UPI payments and smart insights — built for the way India actually spends money.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2">
              {['UPI Auto-Sync', 'Smart Insights', 'Dark Mode', 'Role-Based Access'].map(f => (
                <span
                  key={f}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#4b6b4e',
                    border: '1px solid #1a3d1c',
                    padding: '4px 10px',
                    borderRadius: 100,
                    letterSpacing: '0.02em',
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div
            className="relative z-10 flex overflow-hidden"
            style={{ border: '1px solid #1a3d1c', borderRadius: 12 }}
          >
            {[
              { lbl: 'Balance',    val: '₹1.2L',  red: false },
              { lbl: 'This month', val: '−₹42K',  red: true  },
              { lbl: 'Saved',      val: '₹32K',   red: false },
            ].map((s, i) => (
              <div
                key={i}
                className="flex-1 px-4 py-3"
                style={{ borderRight: i < 2 ? '1px solid #1a3d1c' : 'none' }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#2d4d30',
                    marginBottom: 4,
                  }}
                >
                  {s.lbl}
                </p>
                <p
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 16,
                    fontWeight: 500,
                    color: s.red ? '#f87171' : '#22c55e',
                  }}
                >
                  {s.val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm space-y-5">

            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <div style={{ width: 28, height: 28, borderRadius: 7, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={13} color="#050A06" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                Fin<span style={{ color: '#22c55e' }}>Flow</span>
              </span>
            </div>

            {/* Section label */}
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#4b6b4e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  whiteSpace: 'nowrap',
                }}
              >
                Access your account
              </span>
              <div style={{ flex: 1, height: 1, background: '#1a3d1c' }} />
            </div>

            {/* Tab pills */}
            <div className="flex gap-2">
              {[['login', 'Sign in'], ['signup', 'Sign up']].map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'Syne, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    border: tab === t ? 'none' : '1px solid #1a3d1c',
                    background: tab === t ? '#22c55e' : 'transparent',
                    color: tab === t ? '#050A06' : '#4b6b4e',
                    letterSpacing: '0.02em',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Google */}
            <button
              onClick={() => loginWithGoogle()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 transition-all duration-150"
              style={{
                padding: '11px',
                borderRadius: 10,
                border: '1px solid #1a3d1c',
                background: 'transparent',
                color: '#9ca3af',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Syne, sans-serif',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a3d1c'; e.currentTarget.style.color = '#9ca3af' }}
            >
              {loading
                ? <Loader2 size={14} className="animate-spin" />
                : (
                  <svg width="14" height="14" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                )
              }
              Continue with Google
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div style={{ flex: 1, height: 1, background: '#1a3d1c' }} />
              <span style={{ fontSize: 10, color: '#4b6b4e', fontWeight: 700, letterSpacing: '0.1em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: '#1a3d1c' }} />
            </div>

            {/* Error */}
            {authError && (
              <div
                className="flex items-start gap-2.5"
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  borderRadius: 10,
                  padding: '10px 14px',
                }}
              >
                <AlertCircle size={13} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#f87171', fontFamily: 'DM Mono, monospace' }}>{authError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label
                    style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4b6b4e', marginBottom: 6 }}
                  >
                    Full name
                  </label>
                  <input className="login-input" type="text" placeholder="Aditi Sharma" />
                </div>
              )}

              <div>
                <label
                  style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4b6b4e', marginBottom: 6 }}
                >
                  Email address
                </label>
                <input
                  className="login-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <label
                    style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4b6b4e' }}
                  >
                    Password
                  </label>
                  {tab === 'login' && (
                    <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600, cursor: 'pointer' }}>
                      Forgot?
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="login-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: 40 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#4b6b4e', padding: 0,
                    }}
                  >
                    {showPw
                      ? <EyeOff size={13} color="#4b6b4e" />
                      : <Eye size={13} color="#4b6b4e" />
                    }
                  </button>
                </div>
              </div>

              {/* Main CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  padding: '12px',
                  borderRadius: 10,
                  background: '#22c55e',
                  color: '#050A06',
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: 'Syne, sans-serif',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  letterSpacing: '-0.2px',
                  transition: 'background 0.15s',
                  marginTop: 4,
                }}
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {tab === 'login' ? 'Sign in to FinFlow' : 'Create account'}
              </button>
            </form>

            {/* Demo fill */}
            <button
              onClick={fillDemo}
              className="w-full flex items-center justify-center gap-2 transition-all duration-150"
              style={{
                padding: '10px',
                borderRadius: 10,
                border: '1.5px dashed #1e4d22',
                background: 'transparent',
                color: filled ? '#22c55e' : '#4b6b4e',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'Syne, sans-serif',
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              <Zap size={12} color={filled ? '#22c55e' : '#4b6b4e'} />
              {filled ? 'Credentials filled — hit Sign in!' : 'Fill demo credentials'}
            </button>

            <p
              className="text-center"
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#2d4d30' }}
            >
              aditi@finflow.app &nbsp;·&nbsp; demo123
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
