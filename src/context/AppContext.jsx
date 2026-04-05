import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { SEED_TRANSACTIONS } from '../data/seedData.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finova_transactions')
      return saved ? JSON.parse(saved) : SEED_TRANSACTIONS
    } catch {
      return SEED_TRANSACTIONS
    }
  })

  const [role, setRole] = useState('admin')
  const [toast, setToast] = useState(null)

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('finova_transactions', JSON.stringify(transactions))
    } catch {}
  }, [transactions])

  const showToast = useCallback((msg, icon = '✓') => {
    setToast({ msg, icon })
    setTimeout(() => setToast(null), 2800)
  }, [])

  const addTransaction = useCallback((tx) => {
    setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev])
    showToast('Transaction added', '↑')
  }, [showToast])

  const editTransaction = useCallback((tx) => {
    setTransactions((prev) => prev.map((t) => (t.id === tx.id ? tx : t)))
    showToast('Transaction updated', '✎')
  }, [showToast])

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    showToast('Transaction deleted', '✕')
  }, [showToast])

  const handleRoleChange = useCallback((newRole) => {
    setRole(newRole)
    showToast(`Switched to ${newRole} mode`, newRole === 'admin' ? '⬛' : '◻')
  }, [showToast])

  return (
    <AppContext.Provider value={{
      transactions,
      role,
      toast,
      addTransaction,
      editTransaction,
      deleteTransaction,
      setRole: handleRoleChange,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
