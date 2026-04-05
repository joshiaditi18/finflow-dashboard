import { useState } from 'react'
import { Search, Plus, X, ArrowUpDown } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import TransactionTable from '../components/TransactionTable'
import TransactionModal from '../components/TransactionModal'

export default function Transactions() {
  const {
    filteredTransactions,
    search, setSearch,
    typeFilter, setTypeFilter,
    sortBy, setSortBy,
    role,
  } = useFinance()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTxn,   setEditTxn]   = useState(null)
  const isAdmin = role === 'admin'

  function openAdd() {
    setEditTxn(null)
    setModalOpen(true)
  }

  function openEdit(txn) {
    setEditTxn(txn)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTxn(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="btn-primary flex-shrink-0">
            <Plus size={16} />
            Add Transaction
          </button>
        )}
      </div>

      {/* Filters bar */}
      <div className="card p-3 flex flex-wrap gap-3 items-center animate-slide-up animation-delay-100">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field pl-8 pr-8"
            placeholder="Search transactions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type filter */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
          {[
            { value: 'all',     label: 'All'     },
            { value: 'income',  label: 'Income'  },
            { value: 'expense', label: 'Expense' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={`px-3.5 py-2 text-xs font-semibold transition-all duration-150 ${
                typeFilter === opt.value
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ArrowUpDown size={14} className="text-slate-400" />
          <select
            className="input-field py-2 text-xs appearance-none"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ width: 150 }}
          >
            <option value="date-desc">Date: Newest first</option>
            <option value="date-asc">Date: Oldest first</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <TransactionTable transactions={filteredTransactions} onEdit={openEdit} />

      {/* Modal */}
      <TransactionModal isOpen={modalOpen} onClose={closeModal} editTxn={editTxn} />
    </div>
  )
}
