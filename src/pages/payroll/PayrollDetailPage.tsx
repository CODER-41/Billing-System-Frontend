import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle, XCircle, Play, Send } from 'lucide-react'
import { payrollApi } from '../../api/payroll'
import { formatKES } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { getPayrollStatusBadge, getTransferStatusBadge } from '../../components/ui/Badge'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useAuthStore } from '../../store/authStore'

export default function PayrollDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const runId = Number(id)

  const { data: run, isLoading } = useQuery({
    queryKey: ['payroll', runId],
    queryFn: () => payrollApi.get(runId),
  })

  const { data: items } = useQuery({
    queryKey: ['payrollItems', runId],
    queryFn: () => payrollApi.getItems(runId),
  })

  const { data: summary } = useQuery({
    queryKey: ['payrollSummary', runId],
    queryFn: () => payrollApi.getSummary(runId),
  })

  const submitMutation   = useMutation({ mutationFn: () => payrollApi.submit(runId),  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payroll', runId] }) })
  const approveMutation  = useMutation({ mutationFn: () => payrollApi.approve(runId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payroll', runId] }) })
  const rejectMutation   = useMutation({ mutationFn: () => payrollApi.reject(runId),  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payroll', runId] }) })
  const processMutation  = useMutation({ mutationFn: () => payrollApi.process(runId), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payroll', runId] }) })

  if (isLoading || !run) return <div className="text-center py-20 text-gray-400">Loading...</div>

  const badge = getPayrollStatusBadge(run.status)
  const canSubmit  = run.status === 'draft'
  const canApprove = run.status === 'pending_approval' && run.created_by !== Number(user?.id)
  const canReject  = run.status === 'pending_approval' && run.created_by !== Number(user?.id)
  const canProcess = run.status === 'approved' && (user?.role === 'super_admin' || user?.role === 'finance_admin')

  const errorMsg = (submitMutation.error || approveMutation.error || rejectMutation.error || processMutation.error) as any

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/payroll')} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{run.title}</h1>
            <Badge label={badge.label} variant={badge.variant} />
          </div>
          <p className="text-gray-500 mt-1">
            {formatDate(run.pay_period_start)} — {formatDate(run.pay_period_end)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {canSubmit && (
            <Button onClick={() => submitMutation.mutate()} loading={submitMutation.isPending}>
              <Send className="w-4 h-4" /> Submit for Approval
            </Button>
          )}
          {canReject && (
            <Button variant="danger" onClick={() => rejectMutation.mutate()} loading={rejectMutation.isPending}>
              <XCircle className="w-4 h-4" /> Reject
            </Button>
          )}
          {canApprove && (
            <Button onClick={() => approveMutation.mutate()} loading={approveMutation.isPending}>
              <CheckCircle className="w-4 h-4" /> Approve
            </Button>
          )}
          {canProcess && (
            <Button onClick={() => processMutation.mutate()} loading={processMutation.isPending}>
              <Play className="w-4 h-4" /> Process Payroll
            </Button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMsg?.response?.data?.message || 'An error occurred'}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">{summary?.total_employees || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Total Gross</p>
          <p className="text-2xl font-bold text-gray-900">{formatKES(summary?.total_gross || 0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Total Deductions</p>
          <p className="text-2xl font-bold text-red-500">{formatKES(summary?.total_deductions || 0)}</p>
        </div>
        <div className="bg-blue-600 rounded-xl p-4">
          <p className="text-xs text-blue-200 mb-1">Total Net Payroll</p>
          <p className="text-2xl font-bold text-white">{formatKES(summary?.total_net || 0)}</p>
        </div>
      </div>

      {/* Payroll Items Table */}
      <Card title="Payroll Items">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-3 font-medium text-gray-500">Employee</th>
                <th className="text-left pb-3 font-medium text-gray-500">Bank</th>
                <th className="text-left pb-3 font-medium text-gray-500">Gross</th>
                <th className="text-left pb-3 font-medium text-gray-500">Deductions</th>
                <th className="text-left pb-3 font-medium text-gray-500">Net Pay</th>
                <th className="text-left pb-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items?.map(item => {
                const itemBadge = getTransferStatusBadge(item.status)
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <p className="font-medium text-gray-800">{item.employee.full_name}</p>
                      <p className="text-xs text-gray-400">{item.employee.employee_code}</p>
                    </td>
                    <td className="py-3">
                      <p className="text-gray-600">{item.bank_account.bank_name}</p>
                      <p className="text-xs text-gray-400">{item.bank_account.account_number}</p>
                    </td>
                    <td className="py-3 text-gray-600">{formatKES(item.gross_salary)}</td>
                    <td className="py-3 text-red-500">- {formatKES(item.total_deductions)}</td>
                    <td className="py-3 font-semibold text-gray-800">{formatKES(item.net_salary)}</td>
                    <td className="py-3">
                      <Badge label={item.status} variant={
                        item.status === 'paid' ? 'success' :
                        item.status === 'failed' ? 'danger' :
                        item.status === 'processing' ? 'info' : 'neutral'
                      } />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
