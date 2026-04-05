export default function Badge({ label, color, bg, borderColor, style }) {
  return (
    <span
      className="badge"
      style={{
        color: color || 'var(--text)',
        background: bg || 'var(--surface-hi)',
        borderColor: borderColor || (color ? color + '33' : 'var(--border)'),
        ...style,
      }}
    >
      {label}
    </span>
  )
}
