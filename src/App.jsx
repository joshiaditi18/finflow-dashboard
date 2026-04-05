import { FinanceProvider, useFinance } from './context/FinanceContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import MobileHeader from './components/MobileHeader'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights from './pages/Insights'
import Login from './pages/Login'
import Profile from './pages/Profile'
import UpiPage from './pages/UpiPage'

function AppContent() {
  const { activePage } = useFinance()
  const { user } = useAuth()

  if (!user) return <Login />

  const pages = {
    dashboard:    <Dashboard />,
    transactions: <Transactions />,
    insights:     <Insights />,
    upi:          <UpiPage />,
    profile:      <Profile />,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0d1117]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
          <div key={activePage} className="animate-fade-in">
            {pages[activePage] || <Dashboard />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AuthProvider>
  )
}
