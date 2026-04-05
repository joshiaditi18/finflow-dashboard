import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/helpers'
import { CATEGORY_COLORS } from '../data/transactions'
import { useFinance } from '../context/FinanceContext'

export default function RecentTransactions() {
  const { transactions, setActivePage } = useFinance()
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="card p-5 animate-slide-up animation-delay-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest activity</p>
        </div>
        <button
          onClick={() => setActivePage('transactions')}
          className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-slate-400 text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {recent.map(txn => {
            const color = CATEGORY_COLORS[txn.category] || '#94a3b8'
            return (
              <div key={txn.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: color + '22' }}
                >
                  {txn.type === 'income'
                    ? <ArrowDownLeft size={14} style={{ color }} />
                    : <ArrowUpRight size={14} style={{ color }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{txn.description}</p>
                  <p className="text-xs text-slate-400 font-num">{formatDate(txn.date)}</p>
                </div>
                <span className={`font-num font-bold text-sm ${
                  txn.type === 'income' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'
                }`}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, true)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
