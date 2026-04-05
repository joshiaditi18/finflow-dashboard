import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

export default function StatCard({ title, amount, icon: Icon, iconBg, trend, trendLabel, delay = 0 }) {
  const positive = trend >= 0

  return (
    <div
      className="stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={17} />
        </div>
      </div>

      <div>
        <p className="font-num text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          {formatCurrency(amount)}
        </p>
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {positive
            ? <TrendingUp size={13} className="text-brand-500" />
            : <TrendingDown size={13} className="text-red-500" />
          }
          <span className={`text-xs font-semibold ${positive ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'}`}>
            {positive ? '+' : ''}{trend.toFixed(1)}%
          </span>
          {trendLabel && (
            <span className="text-xs text-slate-400 dark:text-slate-500">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
