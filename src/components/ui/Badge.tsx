interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

const variants = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger:  'bg-red-100 text-red-800',
  info:    'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-700',
}

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {label}
    </span>
  )
}

// Helper to map payroll status to badge variant
export function getPayrollStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    draft:            { label: 'Draft',            variant: 'neutral'  },
    pending_approval: { label: 'Pending Approval', variant: 'warning'  },
    approved:         { label: 'Approved',         variant: 'info'     },
    processing:       { label: 'Processing',       variant: 'info'     },
    completed:        { label: 'Completed',        variant: 'success'  },
    failed:           { label: 'Failed',           variant: 'danger'   },
  }
  return map[status] || { label: status, variant: 'neutral' }
}

export function getTransferStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    pending:  { label: 'Pending',  variant: 'warning' },
    success:  { label: 'Paid',     variant: 'success' },
    failed:   { label: 'Failed',   variant: 'danger'  },
  }
  return map[status] || { label: status, variant: 'neutral' }
}
