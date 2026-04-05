import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

// ── Formatting ─────────────────────────────────────────────────────────────────
export function formatCurrency(amount, compact = false) {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  return format(parseISO(dateStr), 'dd MMM yyyy')
}

export function formatDateShort(dateStr) {
  return format(parseISO(dateStr), 'dd MMM')
}

// ── Date helpers ───────────────────────────────────────────────────────────────
export function getMonthTransactions(transactions, date = new Date()) {
  const start = startOfMonth(date)
  const end   = endOfMonth(date)
  return transactions.filter(t =>
    isWithinInterval(parseISO(t.date), { start, end })
  )
}

export function getLastMonthDate() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  return d
}

// ── Stats helpers ──────────────────────────────────────────────────────────────
export function calcStats(transactions) {
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return { income, expense, balance: income - expense }
}

export function getCategoryTotals(transactions) {
  const map = {}
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function getBalanceTrend(transactions) {
  // Group by date, accumulate running balance
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
  let running = 0
  const dateMap = {}
  sorted.forEach(t => {
    running += t.type === 'income' ? t.amount : -t.amount
    dateMap[t.date] = running
  })
  return Object.entries(dateMap).map(([date, balance]) => ({
    date: formatDateShort(date),
    balance,
  }))
}

export function getMonthlyComparison(transactions) {
  const now       = new Date()
  const thisMonth = getMonthTransactions(transactions, now)
  const lastMonth = getMonthTransactions(transactions, getLastMonthDate())

  const thisStats = calcStats(thisMonth)
  const lastStats = calcStats(lastMonth)

  const expenseChange = lastStats.expense > 0
    ? ((thisStats.expense - lastStats.expense) / lastStats.expense) * 100
    : 0
  const savingsChange = thisStats.balance - lastStats.balance

  return { thisStats, lastStats, expenseChange, savingsChange }
}

export function pctChange(a, b) {
  if (b === 0) return 0
  return ((a - b) / b) * 100
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}
