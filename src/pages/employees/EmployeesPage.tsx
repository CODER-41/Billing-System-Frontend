import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, UserCheck } from 'lucide-react'
import { employeesApi } from '../../api/employees'
import { formatDate } from '../../utils/date'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['employees', page, search],
    queryFn: () => employeesApi.list({ page, search }),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 mt-1">{data?.total || 0} total employees</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading employees...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-3 font-medium text-gray-500">Employee</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Code</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Department</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Position</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Status</th>
                  <th className="text-left pb-3 font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.data.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 text-xs font-semibold">
                            {emp.full_name.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{emp.full_name}</p>
                          <p className="text-xs text-gray-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{emp.employee_code}</td>
                    <td className="py-3 text-gray-600">{emp.department}</td>
                    <td className="py-3 text-gray-600">{emp.position}</td>
                    <td className="py-3">
                      <Badge
                        label={emp.status === 'active' ? 'Active' : 'Inactive'}
                        variant={emp.status === 'active' ? 'success' : 'neutral'}
                      />
                    </td>
                    <td className="py-3 text-gray-500">{formatDate(emp.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.total > data.per_page && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {((page-1) * data.per_page) + 1} to {Math.min(page * data.per_page, data.total)} of {data.total}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage(p => p-1)} disabled={page === 1}>Previous</Button>
              <Button variant="secondary" size="sm" onClick={() => setPage(p => p+1)} disabled={page * data.per_page >= data.total}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
