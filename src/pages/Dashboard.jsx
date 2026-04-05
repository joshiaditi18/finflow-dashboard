import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import StatCard from '../components/StatCard'
import BalanceChart from '../components/BalanceChart'
import SpendingChart from '../components/SpendingChart'
import RecentTransactions from '../components/RecentTransactions'
import { getBalanceTrend, getCategoryTotals, getMonthlyComparison, pctChange } from '../utils/helpers'

export default function Dashboard() {
  const { transactions, totalIncome, totalExpense, balance } = useFinance()

  const trendData   = getBalanceTrend(transactions)
  const categories  = getCategoryTotals(transactions)
  const { thisStats, lastStats } = getMonthlyComparison(transactions)

  const balanceTrend  = pctChange(thisStats.balance, lastStats.balance)
  const incomeTrend   = pctChange(thisStats.income, lastStats.income)
  const expenseTrend  = pctChange(thisStats.expense, lastStats.expense)

  // Time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {greeting}, Aditi 👋
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Here's your financial overview for today
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Balance"
          amount={balance}
          icon={Wallet}
          iconBg="bg-brand-50 dark:bg-brand-900/20 text-brand-500"
          trend={balanceTrend}
          trendLabel="vs last month"
          delay={0}
        />
        <StatCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          iconBg="bg-blue-50 dark:bg-blue-900/20 text-blue-500"
          trend={incomeTrend}
          trendLabel="vs last month"
          delay={100}
        />
        <StatCard
          title="Total Expenses"
          amount={totalExpense}
          icon={TrendingDown}
          iconBg="bg-red-50 dark:bg-red-900/20 text-red-500"
          trend={-expenseTrend}
          trendLabel="vs last month"
          delay={200}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BalanceChart data={trendData} />
        </div>
        <div>
          <SpendingChart data={categories} />
        </div>
      </div>

      {/* Recent transactions */}
      <RecentTransactions />
    </div>
  )
}
