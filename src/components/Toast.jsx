import { useApp } from '../context/AppContext.jsx'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null

  return (
    <div className="toast">
      <span className="toast-icon">{toast.icon}</span>
      <span>{toast.msg}</span>
    </div>
  )
}
