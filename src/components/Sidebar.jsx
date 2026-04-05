import { LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun, ChevronDown, RotateCcw, Wallet, Smartphone, UserCircle2 } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions',  icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',      icon: Lightbulb       },
  { id: 'upi',          label: 'UPI Payments',  icon: Smartphone      },
  { id: 'profile',      label: 'Profile',       icon: UserCircle2     },
]

export default function Sidebar({ mobile = false, onClose }) {
  const { activePage, setActivePage, darkMode, setDarkMode, role, setRole, resetData } = useFinance()
  const { user } = useAuth()

  function navigate(page) {
    setActivePage(page)
    onClose?.()
  }

  return (
    <aside className={`flex flex-col h-full bg-white dark:bg-[#161b22] border-r border-slate-100 dark:border-slate-800 ${mobile ? 'w-full' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow">
          <Wallet size={16} className="text-white" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-white">
          Fin<span className="text-brand-500">Flow</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`nav-link w-full ${active ? 'nav-link-active' : 'nav-link-inactive'}`}
            >
              <Icon size={18} className={active ? 'text-brand-500' : ''} />
              {item.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </button>
          )
        })}
      </nav>

      {/* User info */}
      {user && (
        <div
          className="mx-3 mb-2 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => { setActivePage('profile'); onClose?.() }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-extrabold text-white text-xs flex-shrink-0">
            {user.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate font-mono">{user.primaryUpi || user.email}</p>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {/* Role switcher */}
        <div>
          <span className="label px-1">Role</span>
          <div className="relative">
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="input-field appearance-none pr-8 cursor-pointer"
            >
              <option value="admin">👑 Admin</option>
              <option value="viewer">👁 Viewer</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Dark mode + Reset */}
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(d => !d)}
            className="btn-secondary flex-1 justify-center"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            <span className="text-xs">{darkMode ? 'Light' : 'Dark'}</span>
          </button>
          <button
            onClick={resetData}
            className="btn-secondary px-3"
            title="Reset to sample data"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
