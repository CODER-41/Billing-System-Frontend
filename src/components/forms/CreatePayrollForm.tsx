import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { payrollApi } from '../../api/payroll'
import { useToast } from '../../store/toastStore'
import Input from '../ui/Input'
import Button from '../ui/Button'

const schema = z.object({
  title:            z.string().min(3, 'Title is required'),
  pay_period_start: z.string().min(1, 'Start date is required'),
  pay_period_end:   z.string().min(1, 'End date is required'),
  payment_date:     z.string().min(1, 'Payment date is required'),
}).refine(d => d.pay_period_end >= d.pay_period_start, {
  message: 'End date must be after start date',
  path: ['pay_period_end'],
})

type FormData = z.infer<typeof schema>

interface Props {
  onSuccess: () => void
  onCancel: () => void
}

export default function CreatePayrollForm({ onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => payrollApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] })
      toast.success('Payroll run created successfully!')
      onSuccess()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create payroll run')
    }
  })

  return (
    <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
      <Input label="Payroll Title" placeholder="e.g. April 2026 Payroll" error={errors.title?.message} {...register('title')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Pay Period Start" type="date" error={errors.pay_period_start?.message} {...register('pay_period_start')} />
        <Input label="Pay Period End"   type="date" error={errors.pay_period_end?.message}   {...register('pay_period_end')} />
      </div>
      <Input label="Payment Date" type="date" error={errors.payment_date?.message} {...register('payment_date')} />
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        The payroll run will automatically include all active employees
        who have a salary structure and a primary bank account set up.
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="flex-1" loading={mutation.isPending}>Create Payroll Run</Button>
      </div>
    </form>
  )
}
