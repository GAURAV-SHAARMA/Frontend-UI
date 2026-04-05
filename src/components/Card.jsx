import { useState } from 'react'

export default function Card({ children, className = '', hover = false, onClick, style }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`card ${hover ? 'hoverable' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
