import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees'
import { useToast } from '../../store/toastStore'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useState } from 'react'

const schema = z.object({
  basic_salary:    z.coerce.number().min(1, 'Basic salary is required'),
  effective_date:  z.string().min(1, 'Effective date is required'),
  housing:         z.coerce.number().min(0).default(0),
  transport:       z.coerce.number().min(0).default(0),
  other_allowance: z.coerce.number().min(0).default(0),
  paye:            z.coerce.number().min(0).default(0),
  nhif:            z.coerce.number().min(0).default(0),
  nssf:            z.coerce.number().min(0).default(0),
  other_deduction: z.coerce.number().min(0).default(0),
})

type FormData = z.infer<typeof schema>

interface Props {
  employeeId: number
  onSuccess: () => void
  onCancel: () => void
}

export default function SetSalaryForm({ employeeId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [preview, setPreview] = useState<number | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nhif: 1700,
      nssf: 200,
    }
  })

  const watched = watch()
  const gross = (Number(watched.basic_salary) || 0) +
    (Number(watched.housing) || 0) +
    (Number(watched.transport) || 0) +
    (Number(watched.other_allowance) || 0)
  const totalDeductions = (Number(watched.paye) || 0) +
    (Number(watched.nhif) || 0) +
    (Number(watched.nssf) || 0) +
    (Number(watched.other_deduction) || 0)
  const net = gross - totalDeductions

  const mutation = useMutation({
    mutationFn: (data: FormData) => employeesApi.createSalary(employeeId, {
      basic_salary: data.basic_salary,
      effective_date: data.effective_date,
      allowances: {
        ...(data.housing       > 0 && { housing: data.housing }),
        ...(data.transport     > 0 && { transport: data.transport }),
        ...(data.other_allowance > 0 && { other: data.other_allowance }),
      },
      deductions: {
        ...(data.paye            > 0 && { paye: data.paye }),
        ...(data.nhif            > 0 && { nhif: data.nhif }),
        ...(data.nssf            > 0 && { nssf: data.nssf }),
        ...(data.other_deduction > 0 && { other: data.other_deduction }),
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary', employeeId] })
      toast.success('Salary structure saved successfully!')
      onSuccess()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to save salary')
    }
  })

  return (
    <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">
      {mutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {(mutation.error as any)?.response?.data?.message || 'Failed to set salary'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Basic Salary (KES)"
          type="number"
          placeholder="85000"
          error={errors.basic_salary?.message}
          {...register('basic_salary')}
        />
        <Input
          label="Effective Date"
          type="date"
          error={errors.effective_date?.message}
          {...register('effective_date')}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Allowances</p>
        <div className="grid grid-cols-3 gap-3">
          <Input label="Housing (KES)"   type="number" placeholder="0" {...register('housing')}         />
          <Input label="Transport (KES)" type="number" placeholder="0" {...register('transport')}       />
          <Input label="Other (KES)"     type="number" placeholder="0" {...register('other_allowance')} />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Deductions</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="PAYE (KES)"  type="number" placeholder="0"    {...register('paye')}            />
          <Input label="NHIF (KES)"  type="number" placeholder="1700" {...register('nhif')}            />
          <Input label="NSSF (KES)"  type="number" placeholder="200"  {...register('nssf')}            />
          <Input label="Other (KES)" type="number" placeholder="0"    {...register('other_deduction')} />
        </div>
      </div>

      {/* Live Net Salary Preview */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Gross Salary</span>
          <span className="font-medium">KES {gross.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Total Deductions</span>
          <span className="font-medium text-red-500">- KES {totalDeductions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 border-t border-blue-200 pt-2">
          <span>Net Salary</span>
          <span className="text-blue-700">KES {net.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={mutation.isPending}>
          Save Salary
        </Button>
      </div>
    </form>
  )
}
