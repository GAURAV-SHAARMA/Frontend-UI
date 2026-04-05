export default function Btn({ children, onClick, primary, ghost, danger, sm, style, disabled }) {
  const variant = primary ? 'btn-primary' : danger ? 'btn-danger' : 'btn-ghost'
  return (
    <button
      className={`btn ${variant} ${sm ? 'btn-sm' : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
    >
      {children}
    </button>
  )
}
