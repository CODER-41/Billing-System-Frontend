import { useToastStore } from '../../store/toastStore'
import type { Toast } from '../../store/toastStore'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error:   <AlertCircle className="w-5 h-5 text-red-500" />,
  info:    <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
}

const styles = {
  success: 'border-green-200 bg-green-50',
  error:   'border-red-200 bg-red-50',
  info:    'border-blue-200 bg-blue-50',
  warning: 'border-yellow-200 bg-yellow-50',
}

const textStyles = {
  success: 'text-green-800',
  error:   'text-red-800',
  info:    'text-blue-800',
  warning: 'text-yellow-800',
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore()
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg w-80 ${styles[toast.type]}`}>
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      <p className={`flex-1 text-sm font-medium ${textStyles[toast.type]}`}>{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function Toaster() {
  const { toasts } = useToastStore()
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
