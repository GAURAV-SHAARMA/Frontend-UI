import { fmtK } from '../data/seedData.js'

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background: 'var(--surface-hi)',
      border: '1px solid var(--border-hi)',
      borderRadius: 8,
      padding: '10px 14px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
    }}>
      {label && (
        <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontSize: 10 }}>{label}</div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: 'var(--text-sub)' }}>{p.name}</span>
          <span style={{ fontWeight: 600, color: p.color || p.fill }}>{fmtK(p.value)}</span>
        </div>
      ))}
    </div>
  )
}
