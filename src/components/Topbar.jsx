import { useApp } from '../context/AppContext.jsx'
import Btn from './Btn.jsx'

const PAGE_TITLES = {
  overview:     'Overview',
  transactions: 'Transactions',
  insights:     'Insights',
}

export default function Topbar({ page, setSidebarOpen }) {
  const { transactions, role } = useApp()

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'finova-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const header = 'ID,Name,Type,Category,Amount,Date,Note'
    const rows   = transactions.map((t) =>
      `${t.id},"${t.name}",${t.type},${t.category},${t.amount},${t.date},"${t.note}"`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'finova-export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger — visible only on mobile via CSS */}
        <button
          className="hamburger"
          onClick={() => setSidebarOpen((o) => !o)}
          style={{
            display: 'none', // shown via CSS media query
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--text-sub)',
            padding: '6px 9px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
          }}
        >
          ☰
        </button>

        <div>
          <div className="topbar-title">{PAGE_TITLES[page]}</div>
          <div className="topbar-sub">FINOVA · {dateStr}</div>
        </div>
      </div>

      <div className="topbar-right">
        <Btn ghost sm onClick={exportCSV}>↗ CSV</Btn>
        <Btn ghost sm onClick={exportJSON}>↗ JSON</Btn>
        <div className={`topbar-role-chip ${role}`}>
          {role === 'admin' ? '⬛ ADMIN' : '◻ VIEWER'}
        </div>
      </div>
    </header>
  )
}
