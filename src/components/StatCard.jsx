import Card from './Card.jsx'

export default function StatCard({ label, value, sub, accent, icon, trend, className = '', delay = '' }) {
  return (
    <Card className={`stat-card fade-up ${delay} ${className}`} hover>
      {/* Top accent bar */}
      <div className="stat-card-accent-bar" style={{ background: accent }} />

      {/* Label */}
      <div className="stat-label">
        <span style={{ color: accent, fontSize: 13 }}>{icon}</span>
        {label}
      </div>

      {/* Value */}
      <div className="stat-value">{value}</div>

      {/* Meta */}
      {(trend !== undefined || sub) && (
        <div className="stat-meta">
          {trend !== undefined && (
            <span className={`stat-trend ${parseFloat(trend) >= 0 ? 'up' : 'down'}`}>
              {parseFloat(trend) >= 0 ? '+' : ''}{trend}%
            </span>
          )}
          {sub && <span className="stat-meta-text">{sub}</span>}
        </div>
      )}
    </Card>
  )
}
