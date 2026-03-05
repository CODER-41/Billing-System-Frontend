import { useQuery } from '@tanstack/react-query'
import { payrollApi } from '../../api/payroll'
import { formatKES } from '../../utils/currency'
import Card from '../../components/ui/Card'

export default function ReportsPage() {
  const { data: payrolls } = useQuery({
    queryKey: ['payrolls'],
    queryFn: () => payrollApi.list(),
  })

  const completed = payrolls?.data.filter(p => p.status === 'completed') || []

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Reports</h1>
        <p className='text-gray-500 mt-1'>Payroll summaries and analytics</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <p className='text-sm text-gray-500 mb-1'>Total Payroll Runs</p>
          <p className='text-3xl font-bold text-gray-900'>{payrolls?.total || 0}</p>
        </div>
        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <p className='text-sm text-gray-500 mb-1'>Completed Runs</p>
          <p className='text-3xl font-bold text-green-600'>{completed.length}</p>
        </div>
        <div className='bg-white rounded-xl border border-gray-200 p-6'>
          <p className='text-sm text-gray-500 mb-1'>Total Disbursed</p>
          <p className='text-3xl font-bold text-blue-600'>
            {formatKES(completed.reduce((sum, p) => sum + p.total_amount, 0))}
          </p>
        </div>
      </div>

      <Card title='Payroll Run History'>
        {payrolls?.data.length === 0 ? (
          <p className='text-gray-400 text-sm text-center py-8'>No payroll data yet</p>
        ) : (
          <div className='space-y-3'>
            {payrolls?.data.map(run => (
              <div key={run.id} className='flex items-center justify-between py-3 border-b border-gray-50 last:border-0'>
                <div>
                  <p className='text-sm font-medium text-gray-800'>{run.title}</p>
                  <p className='text-xs text-gray-400'>{run.pay_period_start} — {run.pay_period_end}</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-semibold text-gray-800'>{formatKES(run.total_amount)}</p>
                  <p className='text-xs text-gray-400 capitalize'>{run.status.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
