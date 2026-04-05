import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIES, fmt } from '../data/seedData.js'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import Btn from '../components/Btn.jsx'
import TxModal from '../components/TxModal.jsx'

export default function Transactions() {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction } = useApp()

  const [search,     setSearch]     = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCat,  setFilterCat]  = useState('all')
  const [sortCol,    setSortCol]    = useState('date')
  const [sortDir,    setSortDir]    = useState(-1)
  const [modal,      setModal]      = useState(null) // null | {} | txObj

  const isAdmin = role === 'admin'

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir((d) => -d)
    else { setSortCol(col); setSortDir(-1) }
  }
  const sortIcon = (col) => sortCol === col ? (sortDir === -1 ? ' ↓' : ' ↑') : ''

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filterType !== 'all' && t.type !== filterType) return false
        if (filterCat  !== 'all' && t.category !== filterCat)  return false
        if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        if (sortCol === 'date')   return sortDir * (new Date(a.date) - new Date(b.date))
        if (sortCol === 'amount') return sortDir * (a.amount - b.amount)
        if (sortCol === 'name')   return sortDir * a.name.localeCompare(b.name)
        return 0
      })
  }, [transactions, search, filterType, filterCat, sortCol, sortDir])

  const handleSave = (tx) => {
    if (modal?.id) editTransaction({ ...tx, id: modal.id })
    else addTransaction(tx)
  }

  const thStyle = { cursor: 'pointer' }

  return (
    <div className="fade-up">
      <Card hover={false}>
        {/* Header */}
        <div className="panel-header">
          <div>
            <div className="panel-title">Transactions</div>
            <div className="panel-sub">{filtered.length} of {transactions.length} records</div>
          </div>
          {isAdmin && (
            <Btn primary onClick={() => setModal({})}>+ New Transaction</Btn>
          )}
        </div>

        {/* Filters */}
        <div className="tx-filters">
          <input
            className="tx-filter-input"
            placeholder="🔍  Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="tx-filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="tx-filter-select"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
          <button className={`sort-btn ${sortCol === 'date' ? 'active' : ''}`} onClick={() => toggleSort('date')}>
            Date{sortIcon('date')}
          </button>
          <button className={`sort-btn ${sortCol === 'amount' ? 'active' : ''}`} onClick={() => toggleSort('amount')}>
            Amount{sortIcon('amount')}
          </button>
        </div>

        {/* Table */}
        <div className="tx-table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◎</div>
              <div className="empty-text">No transactions match your filters</div>
            </div>
          ) : (
            <table className="tx-table">
              <thead>
                <tr>
                  <th style={thStyle} onClick={() => toggleSort('date')}>Date{sortIcon('date')}</th>
                  <th style={thStyle} onClick={() => toggleSort('name')}>Description{sortIcon('name')}</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }} onClick={() => toggleSort('amount')}>
                    Amount{sortIcon('amount')}
                  </th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, idx) => {
                  const cat = CATEGORIES[t.category] || CATEGORIES.other
                  return (
                    <tr
                      key={t.id}
                      className="tx-row"
                      style={{ animationDelay: `${idx * 0.025}s` }}
                    >
                      <td><span className="tx-date">{t.date}</span></td>
                      <td>
                        <div className="tx-name">{t.name}</div>
                        {t.note && <div className="tx-note">{t.note}</div>}
                      </td>
                      <td>
                        <span
                          className="tx-cat-tag"
                          style={{
                            color: cat.color,
                            background: cat.color + '18',
                            borderColor: cat.color + '40',
                          }}
                        >
                          {cat.icon} {cat.label}
                        </span>
                      </td>
                      <td>
                        <Badge
                          label={t.type === 'income' ? '↑ income' : '↓ expense'}
                          color={t.type === 'income' ? 'var(--green)' : 'var(--red)'}
                          bg={t.type === 'income' ? 'var(--green-dim)' : 'var(--red-dim)'}
                        />
                      </td>
                      <td>
                        <span className={`tx-amount ${t.type}`}>
                          {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="tx-actions">
                            <Btn sm ghost onClick={() => setModal(t)}>✎</Btn>
                            <Btn sm danger onClick={() => deleteTransaction(t.id)}>✕</Btn>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Viewer notice */}
      {!isAdmin && (
        <div className="viewer-notice">
          ◻ Viewer mode — switch to Admin in the sidebar to add or edit transactions
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <TxModal
          tx={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
