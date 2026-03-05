import { useQuery } from '@tanstack/react-query'
import apiClient from '../../api/client'
import { formatKES } from '../../utils/currency'
import { formatDateTime } from '../../utils/date'
import Badge from '../../components/ui/Badge'
import { getTransferStatusBadge } from '../../components/ui/Badge'
import Card from '../../components/ui/Card'

export default function TransfersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['transfers'],
    queryFn: async () => {
      const res = await apiClient.get('/transfers/')
      return res.data
    }
  })

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Transfers</h1>
        <p className='text-gray-500 mt-1'>Track all Paystack transfer transactions</p>
      </div>
      <Card>
        {isLoading ? (
          <div className='text-center py-12 text-gray-400'>Loading transfers...</div>
        ) : data?.data?.length === 0 ? (
          <div className='text-center py-12 text-gray-400'>No transfers yet</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='text-left pb-3 font-medium text-gray-500'>Reference</th>
                  <th className='text-left pb-3 font-medium text-gray-500'>Amount</th>
                  <th className='text-left pb-3 font-medium text-gray-500'>Status</th>
                  <th className='text-left pb-3 font-medium text-gray-500'>Initiated</th>
                  <th className='text-left pb-3 font-medium text-gray-500'>Completed</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {data?.data?.map((t: any) => {
                  const badge = getTransferStatusBadge(t.status)
                  return (
                    <tr key={t.id} className='hover:bg-gray-50'>
                      <td className='py-3 font-mono text-xs text-gray-600'>{t.paystack_reference}</td>
                      <td className='py-3 font-semibold text-gray-800'>{formatKES(t.amount)}</td>
                      <td className='py-3'><Badge label={badge.label} variant={badge.variant} /></td>
                      <td className='py-3 text-gray-500'>{formatDateTime(t.initiated_at)}</td>
                      <td className='py-3 text-gray-500'>{t.completed_at ? formatDateTime(t.completed_at) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
