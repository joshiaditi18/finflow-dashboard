import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { formatCurrency } from '../utils/helpers'
import { useFinance } from '../context/FinanceContext'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#1e2530] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 shadow-lg text-sm">
      <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="font-num font-bold text-brand-600 dark:text-brand-400">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

export default function BalanceChart({ data }) {
  const { darkMode } = useFinance()
  const gridColor  = darkMode ? '#1e2a38' : '#f1f5f9'
  const axisColor  = darkMode ? '#475569' : '#94a3b8'

  return (
    <div className="card p-5 animate-slide-up animation-delay-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white">Balance Trend</h3>
          <p className="text-xs text-slate-400 mt-0.5">Running total over time</p>
        </div>
        <span className="badge bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">All time</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: axisColor, fontFamily: 'DM Mono' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: axisColor, fontFamily: 'DM Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `₹${(v/1000).toFixed(0)}K`}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22c55e', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#balanceGrad)"
            dot={false}
            activeDot={{ r: 5, fill: '#22c55e', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
