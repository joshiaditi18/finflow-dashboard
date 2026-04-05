import { Pencil, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/helpers'
import { CATEGORY_COLORS } from '../data/transactions'
import { useFinance } from '../context/FinanceContext'

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || '#94a3b8'
  return (
    <span
      className="badge text-white"
      style={{ backgroundColor: color + '22', color }}
    >
      {category}
    </span>
  )
}

export default function TransactionTable({ transactions, onEdit }) {
  const { role, deleteTransaction } = useFinance()
  const isAdmin = role === 'admin'

  if (!transactions.length) {
    return (
      <div className="card p-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <ArrowUpRight size={28} className="text-slate-300 dark:text-slate-600" />
        </div>
        <p className="font-semibold text-slate-500 dark:text-slate-400">No transactions found</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden animate-fade-in">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="text-left px-5 py-3.5 label">Date</th>
              <th className="text-left px-5 py-3.5 label">Description</th>
              <th className="text-left px-5 py-3.5 label">Category</th>
              <th className="text-left px-5 py-3.5 label">Type</th>
              <th className="text-right px-5 py-3.5 label">Amount</th>
              {isAdmin && <th className="text-right px-5 py-3.5 label">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr
                key={txn.id}
                className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-100"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <td className="px-5 py-3.5 font-num text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatDate(txn.date)}
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-sm text-slate-800 dark:text-slate-100">{txn.description}</p>
                </td>
                <td className="px-5 py-3.5">
                  <CategoryBadge category={txn.category} />
                </td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${txn.type === 'income'
                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                  }`}>
                    {txn.type === 'income'
                      ? <ArrowDownLeft size={11} />
                      : <ArrowUpRight size={11} />
                    }
                    {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`font-num font-bold text-sm ${
                    txn.type === 'income'
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(txn)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-500 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(txn.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {transactions.map(txn => (
          <div key={txn.id} className="px-4 py-3.5 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              txn.type === 'income'
                ? 'bg-brand-50 dark:bg-brand-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              {txn.type === 'income'
                ? <ArrowDownLeft size={16} className="text-brand-500" />
                : <ArrowUpRight size={16} className="text-red-500" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">{txn.description}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-slate-400 font-num">{formatDate(txn.date)}</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <CategoryBadge category={txn.category} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-num font-bold text-sm ${
                txn.type === 'income' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'
              }`}>
                {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, true)}
              </span>
              {isAdmin && (
                <button
                  onClick={() => onEdit(txn)}
                  className="p-1.5 text-slate-400 hover:text-brand-500"
                >
                  <Pencil size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
