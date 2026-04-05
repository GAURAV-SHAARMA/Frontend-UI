import { useApp } from '../context/AppContext.jsx'
import { fmtK } from '../data/seedData.js'

const NAV_ITEMS = [
  { id: 'overview',      icon: '◈', label: 'Overview'     },
  { id: 'transactions',  icon: '↕', label: 'Transactions' },
  { id: 'insights',      icon: '◆', label: 'Insights'     },
]

export default function Sidebar({ page, setPage, sidebarOpen, setSidebarOpen }) {
  const { transactions, role, setRole } = useApp()

  const income  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const net     = income - expense

  const navigate = (id) => {
    setPage(id)
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">FINOVA</div>
          <div className="sidebar-logo-sub">Finance Terminal</div>
        </div>

        {/* Quick stats strip */}
        <div className="sidebar-quickstats">
          <div className="qs-row">
            <span className="qs-label">Net</span>
            <span className={`qs-value net`} style={{ color: net >= 0 ? 'var(--amber)' : 'var(--red)' }}>
              {fmtK(Math.abs(net))}
            </span>
          </div>
          <div className="qs-row">
            <span className="qs-label">In</span>
            <span className="qs-value pos">+{fmtK(income)}</span>
          </div>
          <div className="qs-row">
            <span className="qs-label">Out</span>
            <span className="qs-value neg">-{fmtK(expense)}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {page === item.id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>

        {/* Role switcher */}
        <div className="sidebar-bottom">
          <div className="role-label">Access Role</div>
          <select
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">⬛ Admin — full access</option>
            <option value="viewer">◻ Viewer — read-only</option>
          </select>
          <div className={`role-badge ${role}`}>
            <span>{role === 'admin' ? '⬛' : '◻'}</span>
            <span>{role === 'admin' ? 'ADMIN · edit enabled' : 'VIEWER · read-only'}</span>
          </div>
        </div>
      </aside>
    </>
  )
}
