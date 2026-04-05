import { useState } from 'react'
import {
  Send, MessageSquare, CheckCircle2, AlertCircle,
  Loader2, RefreshCw, Sparkles, X, ArrowRight, ChevronDown,
} from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import { useAuth } from '../context/AuthContext'
import { parseUpiSms, SAMPLE_SMS } from '../utils/upiParser'
import { formatCurrency } from '../utils/helpers'
import { CATEGORIES } from '../data/transactions'

// ── UPI Pay Tab ──────────────────────────────────────────────────────────────
function UpiPayTab() {
  const { addTransaction } = useFinance()
  const { user } = useAuth()
  const [upiId,   setUpiId]   = useState('')
  const [amount,  setAmount]  = useState('')
  const [note,    setNote]    = useState('')
  const [cat,     setCat]     = useState('Other')
  const [step,    setStep]    = useState('form') // 'form' | 'confirm' | 'success'
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    if (!upiId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) return
    setStep('confirm')
  }

  async function confirmPay() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400)) // simulate UPI processing
    addTransaction({
      description: `UPI → ${upiId}`,
      amount: Number(amount),
      type: 'expense',
      category: cat,
      date: new Date().toISOString().slice(0, 10),
      upiId,
      note,
    })
    setLoading(false)
    setStep('success')
  }

  function reset() {
    setUpiId(''); setAmount(''); setNote(''); setCat('Other')
    setStep('form'); setLoading(false)
  }

  // ── Success screen ──
  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-5 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-brand-500" />
        </div>
        <div className="text-center">
          <p className="text-xl font-extrabold text-slate-800 dark:text-white">Payment Sent!</p>
          <p className="text-slate-400 text-sm mt-1">
            {formatCurrency(Number(amount))} sent to <span className="font-mono font-semibold">{upiId}</span>
          </p>
          <p className="text-xs text-brand-500 font-semibold mt-2 flex items-center justify-center gap-1">
            <CheckCircle2 size={11} /> Auto-logged as expense
          </p>
        </div>
        <button onClick={reset} className="btn-primary mt-2">
          <RefreshCw size={14} /> New Payment
        </button>
      </div>
    )
  }

  // ── Confirm screen ──
  if (step === 'confirm') {
    return (
      <div className="space-y-5 animate-slide-up">
        <div className="card p-5 text-center space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">Paying to</p>
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto">
            <span className="text-brand-500 font-extrabold text-xl">₹</span>
          </div>
          <p className="font-mono font-bold text-slate-700 dark:text-slate-200">{upiId}</p>
          <p className="font-num text-4xl font-extrabold text-slate-800 dark:text-white">
            {formatCurrency(Number(amount))}
          </p>
          {note && <p className="text-sm text-slate-400">"{note}"</p>}
          <p className="text-xs text-slate-400">From: <span className="font-mono">{user?.primaryUpi || 'your@upi'}</span></p>
        </div>

        <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800/50 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Sparkles size={13} className="text-brand-500 flex-shrink-0" />
          <p className="text-xs text-brand-700 dark:text-brand-400 font-medium">
            This will be instantly logged as a <strong>{cat}</strong> expense in your dashboard.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setStep('form')} className="btn-secondary flex-1 justify-center" disabled={loading}>
            <X size={14} /> Cancel
          </button>
          <button onClick={confirmPay} className="btn-primary flex-1 justify-center" disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {loading ? 'Processing…' : 'Confirm Pay'}
          </button>
        </div>
      </div>
    )
  }

  // ── Form ──
  return (
    <div className="space-y-4">
      <div>
        <label className="label">UPI ID / VPA</label>
        <input
          className="input-field font-mono"
          placeholder="merchant@upi or name@okaxis"
          value={upiId}
          onChange={e => setUpiId(e.target.value)}
        />
      </div>

      <div>
        <label className="label">Amount (₹)</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
          <input
            className="input-field pl-8 font-num text-lg font-bold"
            placeholder="0"
            type="number"
            min="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
      </div>

      {/* Quick amounts */}
      <div className="flex gap-2 flex-wrap">
        {[100, 200, 500, 1000, 2000].map(v => (
          <button
            key={v}
            onClick={() => setAmount(String(v))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
              amount === String(v)
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300'
            }`}
          >
            ₹{v.toLocaleString('en-IN')}
          </button>
        ))}
      </div>

      <div>
        <label className="label">Category</label>
        <div className="relative">
          <select
            className="input-field appearance-none pr-8"
            value={cat}
            onChange={e => setCat(e.target.value)}
          >
            {CATEGORIES.filter(c => !['Salary','Freelance','Investment'].includes(c)).map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="label">Note (optional)</label>
        <input
          className="input-field"
          placeholder="e.g. Lunch split, Rent, etc."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      <button
        onClick={handlePay}
        disabled={!upiId || !amount}
        className="btn-primary w-full justify-center py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send size={16} /> Pay via UPI
      </button>

      <p className="text-center text-xs text-slate-400">
        Paying from: <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">{user?.primaryUpi || 'yourname@upi'}</span>
      </p>
    </div>
  )
}

// ── SMS Sync Tab ──────────────────────────────────────────────────────────────
function SmsSyncTab() {
  const { addTransaction } = useFinance()
  const [smsText, setSmsText] = useState('')
  const [parsed,  setParsed]  = useState(null)
  const [added,   setAdded]   = useState(false)
  const [error,   setError]   = useState('')

  function handleParse() {
    setParsed(null); setAdded(false); setError('')
    const result = parseUpiSms(smsText)
    if (result.success) {
      setParsed(result)
    } else {
      setError('Could not parse this SMS. Try one of the sample SMS formats below.')
    }
  }

  function handleAdd() {
    if (!parsed) return
    addTransaction({
      description: parsed.description,
      amount: parsed.amount,
      type: parsed.type,
      category: parsed.category,
      date: parsed.date,
    })
    setAdded(true)
    setSmsText('')
    setParsed(null)
    setTimeout(() => setAdded(false), 4000)
  }

  function useSample(sms) {
    setSmsText(sms)
    setParsed(null); setAdded(false); setError('')
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3.5">
        <p className="text-xs text-blue-700 dark:text-blue-400 font-medium flex items-start gap-2">
          <MessageSquare size={13} className="flex-shrink-0 mt-0.5" />
          Paste your bank's UPI debit/credit SMS below. FinFlow will auto-detect the amount, merchant, and category — then add it to your transactions instantly.
        </p>
      </div>

      <div>
        <label className="label">Bank SMS</label>
        <textarea
          className="input-field resize-none text-sm font-mono"
          rows={4}
          placeholder="Paste your bank SMS here…&#10;e.g. Rs.650.00 debited from A/C XX4321 to zomato@icici on 04-04-25"
          value={smsText}
          onChange={e => { setSmsText(e.target.value); setParsed(null); setError('') }}
        />
      </div>

      <button
        onClick={handleParse}
        disabled={!smsText.trim()}
        className="btn-primary w-full justify-center disabled:opacity-40"
      >
        <Sparkles size={15} /> Parse SMS
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Parsed result */}
      {parsed && !added && (
        <div className="card p-4 space-y-3 border-brand-200 dark:border-brand-800 animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-brand-500" />
            <p className="font-semibold text-sm text-slate-800 dark:text-white">SMS Parsed Successfully</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ['Description', parsed.description],
              ['Amount',      formatCurrency(parsed.amount)],
              ['Type',        parsed.type.charAt(0).toUpperCase() + parsed.type.slice(1)],
              ['Category',    parsed.category],
              ['Date',        parsed.date],
              ['UPI Handle',  parsed.upiId || '—'],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2">
                <p className="text-xs text-slate-400">{k}</p>
                <p className="font-semibold text-slate-700 dark:text-slate-200 font-num truncate">{v}</p>
              </div>
            ))}
          </div>
          <button onClick={handleAdd} className="btn-primary w-full justify-center">
            <ArrowRight size={14} /> Add to Transactions
          </button>
        </div>
      )}

      {/* Success */}
      {added && (
        <div className="flex items-center gap-2.5 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl px-4 py-3 animate-fade-in">
          <CheckCircle2 size={15} className="text-brand-500" />
          <p className="text-sm text-brand-700 dark:text-brand-400 font-semibold">Transaction added to your dashboard!</p>
        </div>
      )}

      {/* Sample SMS */}
      <div>
        <p className="label mb-2">Sample SMS formats to try:</p>
        <div className="space-y-2">
          {SAMPLE_SMS.map((sms, i) => (
            <button
              key={i}
              onClick={() => useSample(sms)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <p className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">{sms}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main UPI page ─────────────────────────────────────────────────────────────
export default function UpiPage() {
  const [tab, setTab] = useState('pay') // 'pay' | 'sms'

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          UPI Payments
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Pay & auto-log · or paste SMS to import instantly
        </p>
      </div>

      {/* Tab bar */}
      <div className="card p-1 flex gap-1 animate-slide-up animation-delay-100">
        {[
          { id: 'pay', label: '💸 Pay via UPI',  },
          { id: 'sms', label: '📩 Import from SMS' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              tab === t.id
                ? 'bg-brand-500 text-white shadow-glow'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card p-5 animate-slide-up animation-delay-200">
        <div key={tab}>
          {tab === 'pay' ? <UpiPayTab /> : <SmsSyncTab />}
        </div>
      </div>
    </div>
  )
}
