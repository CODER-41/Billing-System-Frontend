import { useQuery } from '@tanstack/react-query'
import { Users, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { employeesApi } from '../../api/employees'
import { payrollApi } from '../../api/payroll'
import { formatKES } from '../../utils/currency'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesApi.list(),
  })

  const { data: payrolls } = useQuery({
    queryKey: ['payrolls'],
    queryFn: () => payrollApi.list(),
  })

  const pending = payrolls?.data.filter(p => p.status === 'pending_approval').length || 0
  const totalPayroll = payrolls?.data
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.total_amount, 0) || 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here is what is happening with your payroll today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={employees?.total || 0}
          color="bg-blue-600"
        />
        <StatCard
          icon={CreditCard}
          label="Total Payroll Runs"
          value={payrolls?.total || 0}
          color="bg-purple-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed Payrolls"
          value={payrolls?.data.filter(p => p.status === 'completed').length || 0}
          color="bg-green-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Approval"
          value={pending}
          color={pending > 0 ? 'bg-yellow-500' : 'bg-gray-400'}
        />
      </div>

      {/* Recent Payroll Runs */}
      <Card title="Recent Payroll Runs">
        {payrolls?.data.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No payroll runs yet</p>
        ) : (
          <div className="space-y-3">
            {payrolls?.data.slice(0, 5).map(run => (
              <div key={run.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{run.title}</p>
                  <p className="text-xs text-gray-400">{run.payment_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{formatKES(run.total_amount)}</p>
                  <span className="text-xs text-gray-400 capitalize">{run.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
