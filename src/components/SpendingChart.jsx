import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'
import { formatCurrency } from '../utils/helpers'
import { CATEGORY_COLORS } from '../data/transactions'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white dark:bg-[#1e2530] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{d.name}</p>
      <p className="font-num font-bold mt-0.5" style={{ color: d.payload.fill }}>
        {formatCurrency(d.value)}
      </p>
    </div>
  )
}

function CustomLegend({ payload }) {
  return (
    <ul className="flex flex-col gap-1.5 mt-2">
      {payload.slice(0, 6).map(entry => (
        <li key={entry.value} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-slate-600 dark:text-slate-300 truncate flex-1">{entry.value}</span>
          <span className="font-num text-slate-500 dark:text-slate-400 font-medium">
            {formatCurrency(entry.payload.value, true)}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function SpendingChart({ data }) {
  if (!data.length) {
    return (
      <div className="card p-5 flex items-center justify-center h-64">
        <p className="text-slate-400 text-sm">No spending data yet</p>
      </div>
    )
  }

  const colored = data.map(d => ({ ...d, fill: CATEGORY_COLORS[d.name] || '#94a3b8' }))

  return (
    <div className="card p-5 animate-slide-up animation-delay-400">
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 dark:text-white">Spending by Category</h3>
        <p className="text-xs text-slate-400 mt-0.5">Expenses breakdown</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={colored}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={74}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {colored.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 min-w-0">
          <CustomLegend payload={colored.slice(0, 6).map(d => ({ value: d.name, color: d.fill, payload: d }))} />
        </div>
      </div>
    </div>
  )
}
