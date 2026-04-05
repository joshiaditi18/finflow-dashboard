import {
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Flame, PiggyBank, ShoppingBag,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { useFinance } from '../context/FinanceContext'
import {
  getMonthlyComparison, getCategoryTotals,
  getMonthTransactions, getLastMonthDate,
  formatCurrency, pctChange,
} from '../utils/helpers'
import { CATEGORY_COLORS } from '../data/transactions'

// ── Insight card ─────────────────────────────────────────────────────────────
function InsightCard({ icon: Icon, iconBg, title, body, tag, tagColor, delay = 0 }) {
  return (
    <div
      className="card p-4 flex gap-3.5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={17} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{title}</p>
          {tag && (
            <span className={`badge flex-shrink-0 ${tagColor}`}>{tag}</span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

// ── Monthly bar chart tooltip ─────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#1e2530] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 shadow-lg text-xs space-y-1">
      <p className="font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="font-num font-bold" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Insights() {
  const { transactions, darkMode } = useFinance()

  const now       = new Date()
  const thisMonth = getMonthTransactions(transactions, now)
  const lastMonth = getMonthTransactions(transactions, getLastMonthDate())

  const { thisStats, lastStats, expenseChange, savingsChange } = getMonthlyComparison(transactions)

  // Category breakdowns
  const thisCats = getCategoryTotals(thisMonth)
  const lastCats = getCategoryTotals(lastMonth)
  const topCategory = thisCats[0]

  // Per-category comparison data for bar chart
  const allCats = Array.from(
    new Set([...thisCats.map(c => c.name), ...lastCats.map(c => c.name)])
  )
  const barData = allCats
    .map(name => ({
      name: name.replace(' & ', ' ').split(' ')[0], // shorten labels
      fullName: name,
      thisMonth: thisCats.find(c => c.name === name)?.value || 0,
      lastMonth: lastCats.find(c => c.name === name)?.value || 0,
    }))
    .filter(d => d.thisMonth > 0 || d.lastMonth > 0)
    .sort((a, b) => b.thisMonth - a.thisMonth)
    .slice(0, 7)

  // Food-specific change
  const foodThis = thisCats.find(c => c.name === 'Food & Dining')?.value || 0
  const foodLast = lastCats.find(c => c.name === 'Food & Dining')?.value || 0
  const foodChange = pctChange(foodThis, foodLast)

  // Build dynamic insights
  const insights = []

  if (topCategory) {
    insights.push({
      icon: Flame,
      iconBg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500',
      title: `Highest spend: ${topCategory.name}`,
      body: `You've spent ${formatCurrency(topCategory.value)} on ${topCategory.name} this month — your largest category.`,
      tag: 'Top Category',
      tagColor: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    })
  }

  if (expenseChange !== 0) {
    const up = expenseChange > 0
    insights.push({
      icon: up ? TrendingUp : TrendingDown,
      iconBg: up ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-brand-50 dark:bg-brand-900/20 text-brand-500',
      title: `Expenses ${up ? 'up' : 'down'} ${Math.abs(expenseChange).toFixed(1)}% vs last month`,
      body: `You spent ${formatCurrency(thisStats.expense)} this month vs ${formatCurrency(lastStats.expense)} last month.`,
      tag: up ? '⚠ Increasing' : '✓ Reducing',
      tagColor: up
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        : 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
    })
  }

  if (savingsChange !== 0) {
    const saved = savingsChange > 0
    insights.push({
      icon: PiggyBank,
      iconBg: saved ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500',
      title: saved
        ? `You saved ${formatCurrency(Math.abs(savingsChange))} more this month`
        : `Savings down by ${formatCurrency(Math.abs(savingsChange))} vs last month`,
      body: saved
        ? `Great job! Your net savings improved compared to last month. Keep it up.`
        : `Your savings dipped this month. Review your expense categories to find areas to cut.`,
      tag: saved ? '🎉 Better savings' : '📉 Lower savings',
      tagColor: saved
        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-500',
    })
  }

  if (foodChange !== 0 && foodThis > 0) {
    insights.push({
      icon: ShoppingBag,
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600',
      title: `Food expenses ${foodChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(foodChange).toFixed(0)}%`,
      body: `Food & Dining: ${formatCurrency(foodThis)} this month vs ${formatCurrency(foodLast)} last month.`,
      tag: foodChange > 0 ? '↑ Watch out' : '↓ Good control',
      tagColor: foodChange > 0
        ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
        : 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
    })
  }

  // Savings rate
  if (thisStats.income > 0) {
    const rate = ((thisStats.balance / thisStats.income) * 100).toFixed(1)
    insights.push({
      icon: CheckCircle2,
      iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
      title: `Savings rate this month: ${rate}%`,
      body: `You're saving ${rate}% of your income. Financial advisors recommend saving at least 20%.`,
      tag: Number(rate) >= 20 ? '✓ On track' : '⚡ Improve it',
      tagColor: Number(rate) >= 20
        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    })
  }

  const gridColor = darkMode ? '#1e2a38' : '#f1f5f9'
  const axisColor = darkMode ? '#475569' : '#94a3b8'

  // Month names
  const monthNames = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec',
  ]
  const thisMonthName = monthNames[now.getMonth()]
  const lastMonthName = monthNames[new Date(getLastMonthDate()).getMonth()]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Insights
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Smart analysis of your spending habits
        </p>
      </div>

      {/* Monthly comparison summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up animation-delay-100">
        {[
          {
            label: `${thisMonthName} Income`,
            value: formatCurrency(thisStats.income),
            sub: `vs ${formatCurrency(lastStats.income)}`,
            color: 'text-brand-600 dark:text-brand-400',
          },
          {
            label: `${thisMonthName} Expenses`,
            value: formatCurrency(thisStats.expense),
            sub: `vs ${formatCurrency(lastStats.expense)}`,
            color: 'text-red-500',
          },
          {
            label: `${thisMonthName} Savings`,
            value: formatCurrency(thisStats.balance),
            sub: `vs ${formatCurrency(lastStats.balance)}`,
            color: thisStats.balance >= lastStats.balance ? 'text-brand-600 dark:text-brand-400' : 'text-red-500',
          },
          {
            label: 'Transactions',
            value: thisMonth.length,
            sub: `vs ${lastMonth.length} last month`,
            color: 'text-blue-500',
          },
        ].map((item, i) => (
          <div key={i} className="card p-4">
            <p className="label">{item.label}</p>
            <p className={`font-num text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-1 font-num">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar chart comparison */}
      <div className="card p-5 animate-slide-up animation-delay-200">
        <div className="mb-5">
          <h3 className="font-bold text-slate-800 dark:text-white">
            Category Comparison: {lastMonthName} vs {thisMonthName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Expense breakdown by category</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: axisColor, fontFamily: 'DM Mono' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: axisColor, fontFamily: 'DM Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `₹${(v/1000).toFixed(0)}K`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'Syne', paddingTop: 12 }}
              formatter={(v) => v === 'lastMonth' ? lastMonthName : thisMonthName}
            />
            <Bar dataKey="lastMonth" fill="#94a3b8" radius={[4,4,0,0]} maxBarSize={28} />
            <Bar dataKey="thisMonth" fill="#22c55e" radius={[4,4,0,0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Smart insight cards */}
      <div>
        <h3 className="font-bold text-slate-800 dark:text-white mb-3 animate-slide-up animation-delay-300">
          💡 Smart Insights
        </h3>
        {insights.length === 0 ? (
          <div className="card p-10 text-center">
            <AlertCircle size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Add more transactions to unlock insights</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <InsightCard key={i} {...ins} delay={300 + i * 80} />
            ))}
          </div>
        )}
      </div>

      {/* Category breakdown table */}
      {thisCats.length > 0 && (
        <div className="card p-5 animate-slide-up animation-delay-500">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">
            This Month — Category Breakdown
          </h3>
          <div className="space-y-2.5">
            {thisCats.map(cat => {
              const color  = CATEGORY_COLORS[cat.name] || '#94a3b8'
              const total  = thisCats.reduce((s, c) => s + c.value, 0)
              const pct    = total ? ((cat.value / total) * 100).toFixed(1) : 0
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-num">{pct}%</span>
                      <span className="font-num font-bold text-sm text-slate-800 dark:text-slate-100">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
