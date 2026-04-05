import { useState } from 'react'
import {
  User, Phone, Mail, Star, Plus, Trash2, CheckCircle2,
  Shield, LogOut, ChevronRight, Edit3, X, Check,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ── UPI app definitions ──────────────────────────────────────────────────────
const UPI_APPS = [
  {
    id: 'gpay',
    name: 'Google Pay',
    handle: '@okicici / @okhdfcbank',
    color: '#4285F4',
    bg: '#EBF2FF',
    darkBg: 'rgba(66,133,244,0.12)',
    logo: (
      <svg viewBox="0 0 48 48" className="w-7 h-7">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    ),
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    handle: '@ybl',
    color: '#5f259f',
    bg: '#F3EEFF',
    darkBg: 'rgba(95,37,159,0.12)',
    logo: (
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#5f259f' }}>
        <span className="text-white font-extrabold text-xs">Pe</span>
      </div>
    ),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    handle: '@paytm',
    color: '#00BAF2',
    bg: '#E6F9FF',
    darkBg: 'rgba(0,186,242,0.1)',
    logo: (
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#00BAF2' }}>
        <span className="text-white font-extrabold text-[10px]">Pay</span>
      </div>
    ),
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    handle: '@apl',
    color: '#FF9900',
    bg: '#FFF7E6',
    darkBg: 'rgba(255,153,0,0.1)',
    logo: (
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#FF9900' }}>
        <span className="text-white font-extrabold text-[10px]">a</span>
      </div>
    ),
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    handle: '@upi',
    color: '#00A6E0',
    bg: '#E8F7FD',
    darkBg: 'rgba(0,166,224,0.1)',
    logo: (
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#FF6600,#00A6E0)' }}>
        <span className="text-white font-extrabold text-[9px]">BHIM</span>
      </div>
    ),
  },
  {
    id: 'cred',
    name: 'CRED Pay',
    handle: '@axisbank',
    color: '#1a1a2e',
    bg: '#EBEBF0',
    darkBg: 'rgba(200,200,220,0.08)',
    logo: (
      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#1a1a2e' }}>
        <span className="text-white font-extrabold text-[9px]">CRED</span>
      </div>
    ),
  },
]

// ── Avatar initials ───────────────────────────────────────────────────────────
function Avatar({ name, size = 'lg' }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '??'
  const cls = size === 'lg' ? 'w-16 h-16 text-xl' : 'w-9 h-9 text-sm'
  return (
    <div className={`${cls} rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-extrabold text-white shadow-glow flex-shrink-0`}>
      {initials}
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="card p-5 space-y-4">
      <h3 className="font-bold text-slate-800 dark:text-white text-sm">{title}</h3>
      {children}
    </div>
  )
}

export default function Profile() {
  const { user, logout, linkUpiApp, unlinkUpiApp, addUpiId, removeUpiId, setPrimaryUpi, updateProfile } = useAuth()
  const [newUpi,     setNewUpi]     = useState('')
  const [upiError,   setUpiError]   = useState('')
  const [upiSuccess, setUpiSuccess] = useState('')
  const [editName,   setEditName]   = useState(false)
  const [nameVal,    setNameVal]     = useState(user?.name || '')

  function handleAddUpi() {
    setUpiError('')
    setUpiSuccess('')
    if (!newUpi.includes('@')) {
      setUpiError('Enter a valid UPI ID (e.g. name@upi)')
      return
    }
    if (user.upiIds.includes(newUpi)) {
      setUpiError('This UPI ID is already added')
      return
    }
    addUpiId(newUpi)
    setUpiSuccess(`${newUpi} added successfully!`)
    setNewUpi('')
    setTimeout(() => setUpiSuccess(''), 3000)
  }

  function handleSaveName() {
    if (nameVal.trim()) updateProfile({ name: nameVal.trim() })
    setEditName(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account and linked UPI apps</p>
      </div>

      {/* User card */}
      <div className="card p-5 flex items-center gap-4 animate-slide-up animation-delay-100">
        <Avatar name={user?.name} />
        <div className="flex-1 min-w-0">
          {editName ? (
            <div className="flex items-center gap-2">
              <input
                className="input-field text-sm py-1.5"
                value={nameVal}
                onChange={e => setNameVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                autoFocus
              />
              <button onClick={handleSaveName} className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg">
                <Check size={15} />
              </button>
              <button onClick={() => setEditName(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-bold text-slate-800 dark:text-white">{user?.name}</p>
              <button onClick={() => setEditName(true)} className="p-1 text-slate-400 hover:text-brand-500">
                <Edit3 size={13} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <Mail size={12} className="text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone size={12} className="text-slate-400" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{user?.phone}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`badge ${user?.role === 'admin'
            ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
            {user?.role === 'admin' ? '👑 Admin' : '👁 Viewer'}
          </span>
          <div className="flex items-center gap-1">
            <Shield size={11} className="text-brand-500" />
            <span className="text-xs text-brand-500 font-medium">Verified</span>
          </div>
        </div>
      </div>

      {/* UPI IDs */}
      <Section title="🔗 Your UPI IDs">
        <div className="space-y-2">
          {user?.upiIds?.length === 0 && (
            <p className="text-sm text-slate-400">No UPI IDs added yet.</p>
          )}
          {user?.upiIds?.map(upi => (
            <div key={upi} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <span className="text-brand-500 font-bold text-xs">₹</span>
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100">{upi}</p>
                  {upi === user.primaryUpi && (
                    <p className="text-[10px] text-brand-500 font-semibold flex items-center gap-1">
                      <Star size={9} fill="currentColor" /> Primary
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {upi !== user.primaryUpi && (
                  <button
                    onClick={() => setPrimaryUpi(upi)}
                    className="text-xs text-slate-400 hover:text-brand-500 font-medium px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                  >
                    Set primary
                  </button>
                )}
                <button
                  onClick={() => removeUpiId(upi)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add UPI */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              className="input-field flex-1 font-mono text-sm"
              placeholder="yourname@upi"
              value={newUpi}
              onChange={e => { setNewUpi(e.target.value); setUpiError('') }}
              onKeyDown={e => e.key === 'Enter' && handleAddUpi()}
            />
            <button onClick={handleAddUpi} className="btn-primary flex-shrink-0">
              <Plus size={15} /> Add
            </button>
          </div>
          {upiError   && <p className="text-xs text-red-500 flex items-center gap-1"><X size={11} />{upiError}</p>}
          {upiSuccess && <p className="text-xs text-brand-500 flex items-center gap-1"><CheckCircle2 size={11} />{upiSuccess}</p>}
        </div>
      </Section>

      {/* Linked UPI apps */}
      <Section title="📱 Linked UPI Apps">
        <p className="text-xs text-slate-400 -mt-1">
          Link your UPI apps so FinFlow can auto-import your transactions via SMS parsing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {UPI_APPS.map(app => {
            const linked = user?.linkedApps?.includes(app.id)
            return (
              <div
                key={app.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  linked
                    ? 'border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30'
                }`}
              >
                <div className="flex-shrink-0">{app.logo}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{app.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{app.handle}</p>
                </div>
                <button
                  onClick={() => linked ? unlinkUpiApp(app.id) : linkUpiApp(app.id)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    linked
                      ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
                >
                  {linked ? 'Linked ✓' : 'Link'}
                </button>
              </div>
            )
          })}
        </div>
        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3">
          <span className="text-amber-500 text-base flex-shrink-0">ℹ️</span>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            UPI apps don't expose public APIs. FinFlow simulates auto-sync via SMS parsing — paste your bank SMS in the <strong>UPI Sync</strong> tab to auto-import transactions.
          </p>
        </div>
      </Section>

      {/* Security section */}
      <Section title="🔒 Security">
        {[
          { label: 'Change Password', icon: Shield },
          { label: 'Two-Factor Authentication', icon: Phone },
          { label: 'Active Sessions', icon: User },
        ].map(({ label, icon: Icon }) => (
          <button key={label} className="w-full flex items-center justify-between px-1 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Icon size={14} className="text-slate-500" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          </button>
        ))}
      </Section>

      {/* Logout */}
      <div className="animate-slide-up animation-delay-400">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-800/50 text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-150"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
