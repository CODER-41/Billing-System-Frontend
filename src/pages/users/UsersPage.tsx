import { useQuery } from '@tanstack/react-query'
import apiClient from '../../api/client'
import { formatDate } from '../../utils/date'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Plus } from 'lucide-react'

export default function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiClient.get('/users/')
      return res.data
    }
  })

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>System Users</h1>
          <p className='text-gray-500 mt-1'>Manage admin accounts and roles</p>
        </div>
        <Button><Plus className='w-4 h-4' />Add User</Button>
      </div>

      <Card>
        {isLoading ? (
          <div className='text-center py-12 text-gray-400'>Loading users...</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100'>
                  <th className='text-left pb-3 font-medium text-gray-500'>Name</th>
                  <th className='text-left pb-3 font-medium text-gray-500'>Email</th>
                  <th className='text-left pb-3 font-medium text-gray-500'>Role</th>
                  <th className='text-left pb-3 font-medium text-gray-500'>Created</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {data?.data?.map((user: any) => (
                  <tr key={user.id} className='hover:bg-gray-50'>
                    <td className='py-3 font-medium text-gray-800'>{user.name}</td>
                    <td className='py-3 text-gray-600'>{user.email}</td>
                    <td className='py-3'>
                      <Badge
                        label={user.role.replace(/_/g, ' ')}
                        variant={user.role === 'super_admin' ? 'danger' : user.role === 'finance_admin' ? 'info' : 'neutral'}
                      />
                    </td>
                    <td className='py-3 text-gray-500'>{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
