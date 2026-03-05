import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import apiClient from '../../api/client'
import { formatDate } from '../../utils/date'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import AddUserForm from '../../components/forms/AddUserForm'

export default function UsersPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiClient.get('/users/')
      return res.data
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Users</h1>
          <p className="text-gray-500 mt-1">Manage admin accounts and roles</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-3 font-medium text-gray-500">Name</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Email</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Role</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.data?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-700 text-xs font-semibold">
                            {user.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{user.email}</td>
                    <td className="py-3">
                      <Badge
                        label={user.role.replace(/_/g, ' ')}
                        variant={
                          user.role === 'super_admin'   ? 'danger'  :
                          user.role === 'finance_admin' ? 'info'    : 'neutral'
                        }
                      />
                    </td>
                    <td className="py-3 text-gray-500">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add System User"
      >
        <AddUserForm
          onSuccess={() => setShowAddModal(false)}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  )
}
