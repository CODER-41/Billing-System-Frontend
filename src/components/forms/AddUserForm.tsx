import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../api/client'
import { useToast } from '../../store/toastStore'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const schema = z.object({
  name:     z.string().min(3, 'Name is required'),
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role:     z.enum(['super_admin', 'hr_admin', 'finance_admin']),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSuccess: () => void
  onCancel: () => void
}

const roleOptions = [
  { value: 'super_admin',   label: 'Super Admin'   },
  { value: 'hr_admin',      label: 'HR Admin'      },
  { value: 'finance_admin', label: 'Finance Admin' },
]

export default function AddUserForm({ onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'hr_admin' }
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiClient.post('/users/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully!')
      onSuccess()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create user')
    }
  })

  return (
    <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
      <Input label="Full Name" placeholder="e.g. John Kamau" error={errors.name?.message} {...register('name')} />
      <Input label="Email Address" type="email" placeholder="john@company.co.ke" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" placeholder="Min 8 characters" error={errors.password?.message} {...register('password')} />
      <Select label="Role" options={roleOptions} error={errors.role?.message} {...register('role')} />
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-700">
        <p className="font-medium mb-1">Role permissions:</p>
        <p><strong>Super Admin</strong> — Full access including user management</p>
        <p><strong>HR Admin</strong> — Manage employees and create payroll runs</p>
        <p><strong>Finance Admin</strong> — Approve and process payroll runs</p>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="flex-1" loading={mutation.isPending}>Create User</Button>
      </div>
    </form>
  )
}
