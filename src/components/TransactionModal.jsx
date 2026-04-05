import { useState, useEffect } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import { CATEGORIES } from '../data/transactions'

const EMPTY = { description: '', amount: '', category: 'Food & Dining', type: 'expense', date: '' }

export default function TransactionModal({ isOpen, onClose, editTxn }) {
  const { addTransaction, updateTransaction } = useFinance()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editTxn) {
      setForm({ ...editTxn, amount: String(editTxn.amount) })
    } else {
      setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) })
    }
    setErrors({})
  }, [editTxn, isOpen])

  function validate() {
    const e = {}
    if (!form.description.trim()) e.description = 'Required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const payload = { ...form, amount: Number(form.amount) }
    if (editTxn) {
      updateTransaction(editTxn.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#161b22] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white">
            {editTxn ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-5 space-y-4">
          {/* Type toggle */}
          <div>
            <span className="label">Type</span>
            <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              {['expense', 'income'].map(t => (
                <button
                  key={t}
                  onClick={() => set('type', t)}
                  className={`flex-1 py-2 text-sm font-semibold transition-all duration-150 ${
                    form.type === t
                      ? t === 'expense'
                        ? 'bg-red-500 text-white'
                        : 'bg-brand-500 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <input
              className={`input-field ${errors.description ? 'ring-2 ring-red-400' : ''}`}
              placeholder="e.g. Grocery Shopping"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount (₹)</label>
              <input
                className={`input-field font-num ${errors.amount ? 'ring-2 ring-red-400' : ''}`}
                placeholder="0"
                type="number"
                min="0"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="label">Date</label>
              <input
                className={`input-field font-num ${errors.date ? 'ring-2 ring-red-400' : ''}`}
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              className="input-field appearance-none"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1 justify-center">
            <CheckCircle2 size={15} />
            {editTxn ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
