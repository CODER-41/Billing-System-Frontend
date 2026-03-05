import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { payrollApi } from '../../api/payroll'
import { formatKES } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { getPayrollStatusBadge } from '../../components/ui/Badge'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import CreatePayrollForm from '../../components/forms/CreatePayrollForm'

export default function PayrollPage() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['payrolls'],
    queryFn: () => payrollApi.list(),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Runs</h1>
          <p className="text-gray-500 mt-1">Manage and process employee payroll</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          New Payroll Run
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading payroll runs...</div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No payroll runs yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-3 font-medium text-gray-500">Title</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Pay Period</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Payment Date</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Total Amount</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.data.map(run => {
                  const badge = getPayrollStatusBadge(run.status)
                  return (
                    <tr
                      key={run.id}
                      onClick={() => navigate(`/payroll/${run.id}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 font-medium text-gray-800">{run.title}</td>
                      <td className="py-3 text-gray-600">
                        {formatDate(run.pay_period_start)} — {formatDate(run.pay_period_end)}
                      </td>
                      <td className="py-3 text-gray-600">{formatDate(run.payment_date)}</td>
                      <td className="py-3 font-semibold text-gray-800">{formatKES(run.total_amount)}</td>
                      <td className="py-3">
                        <Badge label={badge.label} variant={badge.variant} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Payroll Run">
        <CreatePayrollForm
          onSuccess={() => setShowCreateModal(false)}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  )
}
