import { useState } from 'react'
import { Menu, X, Wallet } from 'lucide-react'
import Sidebar from './Sidebar'
import { useFinance } from '../context/FinanceContext'

export default function MobileHeader() {
  const [open, setOpen] = useState(false)
  const { activePage } = useFinance()

  const labels = {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    insights: 'Insights',
    upi: 'UPI Payments',
    profile: 'Profile',
  }

  return (
    <>
      <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Wallet size={13} className="text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-800 dark:text-white">
            Fin<span className="text-brand-500">Flow</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {labels[activePage]}
          </span>
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-72 h-full animate-slide-in">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 shadow"
              >
                <X size={16} />
              </button>
            </div>
            <Sidebar mobile onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
