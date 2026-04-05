import { useState } from 'react'
import { CATEGORIES } from '../data/seedData.js'
import Btn from './Btn.jsx'

const todayStr = () => new Date().toISOString().slice(0, 10)

export default function TxModal({ tx, onClose, onSave }) {
  const isEdit = !!tx?.id
  const [form, setForm] = useState(
    tx || { name: '', type: 'expense', category: 'food', amount: '', date: todayStr(), note: '' }
  )

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSave = () => {
    if (!form.name.trim() || !form.amount || !form.date) return
    onSave({ ...form, amount: parseFloat(form.amount) })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">{isEdit ? 'Edit Transaction' : 'New Transaction'}</h2>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Monthly Salary"
          />
        </div>

        {/* Type + Amount */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Category + Date */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>
        </div>

        {/* Note */}
        <div className="form-group">
          <label className="form-label">Note (optional)</label>
          <input
            className="form-input"
            value={form.note}
            onChange={(e) => set('note', e.target.value)}
            placeholder="Any additional details"
          />
        </div>

        <div className="modal-footer">
          <Btn ghost onClick={onClose}>Cancel</Btn>
          <Btn primary onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Transaction'}</Btn>
        </div>
      </div>
    </div>
  )
}
