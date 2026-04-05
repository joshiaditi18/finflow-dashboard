import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/transactions'

const FinanceContext = createContext(null)

const STORAGE_KEY = 'finflow_transactions'
const THEME_KEY   = 'finflow_theme'
const ROLE_KEY    = 'finflow_role'

export function FinanceProvider({ children }) {
  // ── Theme ──────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored !== null) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light')
  }, [darkMode])

  // ── Role ───────────────────────────────────────────────────────────
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || 'admin')

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role)
  }, [role])

  // ── Transactions ───────────────────────────────────────────────────
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS
    } catch {
      return INITIAL_TRANSACTIONS
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  // ── Filters / Search ───────────────────────────────────────────────
  const [search,   setSearch]   = useState('')
  const [typeFilter, setTypeFilter] = useState('all')   // 'all' | 'income' | 'expense'
  const [sortBy,   setSortBy]   = useState('date-desc') // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
  const [activePage, setActivePage] = useState('dashboard') // 'dashboard' | 'transactions' | 'insights'

  // ── CRUD ───────────────────────────────────────────────────────────
  const addTransaction = useCallback((txn) => {
    const newTxn = { ...txn, id: Date.now().toString() }
    setTransactions(prev => [newTxn, ...prev])
  }, [])

  const updateTransaction = useCallback((id, data) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const resetData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS)
  }, [])

  // ── Derived: filtered + sorted list ───────────────────────────────
  const filteredTransactions = transactions
    .filter(t => {
      const matchType   = typeFilter === 'all' || t.type === typeFilter
      const matchSearch = !search || 
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':   return new Date(b.date) - new Date(a.date)
        case 'date-asc':    return new Date(a.date) - new Date(b.date)
        case 'amount-desc': return b.amount - a.amount
        case 'amount-asc':  return a.amount - b.amount
        default:            return 0
      }
    })

  // ── Derived: summary stats ─────────────────────────────────────────
  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance      = totalIncome - totalExpense

  return (
    <FinanceContext.Provider value={{
      // theme
      darkMode, setDarkMode,
      // role
      role, setRole,
      // data
      transactions, filteredTransactions,
      addTransaction, updateTransaction, deleteTransaction, resetData,
      // filters
      search, setSearch,
      typeFilter, setTypeFilter,
      sortBy, setSortBy,
      // navigation
      activePage, setActivePage,
      // summary
      totalIncome, totalExpense, balance,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used inside FinanceProvider')
  return ctx
}
