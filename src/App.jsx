import { useState } from 'react'
import { AppProvider } from './context/AppContext.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Toast from './components/Toast.jsx'
import Overview from './pages/Overview.jsx'
import Transactions from './pages/Transactions.jsx'
import Insights from './pages/Insights.jsx'

function Dashboard() {
  const [page, setPage]               = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (page) {
      case 'overview':     return <Overview />
      case 'transactions': return <Transactions />
      case 'insights':     return <Insights />
      default:             return <Overview />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-area">
        <Topbar page={page} setSidebarOpen={setSidebarOpen} />

        <main className="page-content">
          {renderPage()}
        </main>
      </div>

      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
