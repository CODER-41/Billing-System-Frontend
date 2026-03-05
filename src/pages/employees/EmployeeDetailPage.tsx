import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Plus, CreditCard, Banknote } from 'lucide-react'
import { employeesApi } from '../../api/employees'
import { formatDate } from '../../utils/date'
import { formatKES } from '../../utils/currency'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Modal from '../../components/ui/Modal'
import AddBankAccountForm from '../../components/forms/AddBankAccountForm'
import SetSalaryForm from '../../components/forms/SetSalaryForm'

export default function EmployeeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const empId = Number(id)

  const [showBankModal,   setShowBankModal]   = useState(false)
  const [showSalaryModal, setShowSalaryModal] = useState(false)

  const { data: employee } = useQuery({
    queryKey: ['employee', empId],
    queryFn: () => employeesApi.get(empId),
  })

  const { data: bankAccounts } = useQuery({
    queryKey: ['bankAccounts', empId],
    queryFn: () => employeesApi.getBankAccounts(empId),
  })

  const { data: salary } = useQuery({
    queryKey: ['salary', empId],
    queryFn: () => employeesApi.getSalary(empId),
  })

  if (!employee) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/employees')}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 font-bold text-lg">
              {employee.full_name.split(' ').map(n => n[0]).join('').slice(0,2)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.full_name}</h1>
            <p className="text-gray-500">{employee.position} · {employee.department}</p>
          </div>
          <div className="ml-auto">
            <Badge
              label={employee.status === 'active' ? 'Active' : 'Inactive'}
              variant={employee.status === 'active' ? 'success' : 'neutral'}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Employee Info */}
        <div className="col-span-1 space-y-6">
          <Card title="Personal Details">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Employee Code</p>
                <p className="font-medium text-gray-800">{employee.employee_code}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-medium text-gray-800">{employee.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="font-medium text-gray-800">{employee.phone || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400">Employment Type</p>
                <p className="font-medium text-gray-800 capitalize">{employee.employment_type}</p>
              </div>
              <div>
                <p className="text-gray-400">Date Joined</p>
                <p className="font-medium text-gray-800">{formatDate(employee.created_at)}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-2 space-y-6">
          {/* Bank Accounts */}
          <Card title="Bank Accounts">
            <div className="space-y-3 mb-4">
              {bankAccounts?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No bank accounts added yet</p>
              ) : (
                bankAccounts?.map(account => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{account.bank_name}</p>
                        <p className="text-xs text-gray-500">{account.account_number} · {account.account_name}</p>
                      </div>
                    </div>
                    {account.is_primary && (
                      <Badge label="Primary" variant="info" />
                    )}
                  </div>
                ))
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowBankModal(true)}>
              <Plus className="w-4 h-4" /> Add Bank Account
            </Button>
          </Card>

          {/* Salary Structure */}
          <Card title="Salary Structure">
            {salary ? (
              <div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Basic Salary</p>
                    <p className="text-lg font-bold text-gray-900">{formatKES(salary.basic_salary)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Gross Salary</p>
                    <p className="text-lg font-bold text-green-700">
                      {formatKES(salary.basic_salary + Object.values(salary.allowances).reduce((a,b) => a+b, 0))}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Net Salary</p>
                    <p className="text-lg font-bold text-blue-700">{formatKES(salary.net_salary)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Allowances</p>
                    {Object.entries(salary.allowances).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-gray-600 py-1 border-b border-gray-50">
                        <span className="capitalize">{k}</span>
                        <span>{formatKES(v)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Deductions</p>
                    {Object.entries(salary.deductions).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-gray-600 py-1 border-b border-gray-50">
                        <span className="uppercase">{k}</span>
                        <span className="text-red-500">- {formatKES(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="secondary" size="sm" onClick={() => setShowSalaryModal(true)}>
                    <Banknote className="w-4 h-4" /> Update Salary
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 text-sm mb-4">No salary structure set yet</p>
                <Button onClick={() => setShowSalaryModal(true)}>
                  <Banknote className="w-4 h-4" /> Set Salary
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal isOpen={showBankModal} onClose={() => setShowBankModal(false)} title="Add Bank Account">
        <AddBankAccountForm
          employeeId={empId}
          onSuccess={() => setShowBankModal(false)}
          onCancel={() => setShowBankModal(false)}
        />
      </Modal>

      <Modal isOpen={showSalaryModal} onClose={() => setShowSalaryModal(false)} title="Set Salary Structure" size="lg">
        <SetSalaryForm
          employeeId={empId}
          onSuccess={() => setShowSalaryModal(false)}
          onCancel={() => setShowSalaryModal(false)}
        />
      </Modal>
    </div>
  )
}
