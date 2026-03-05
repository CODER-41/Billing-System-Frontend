import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const schema = z.object({
  full_name:       z.string().min(3, 'Full name is required'),
  email:           z.string().email('Enter a valid email'),
  phone:           z.string().min(10, 'Enter a valid phone number'),
  department:      z.string().min(1, 'Department is required'),
  position:        z.string().min(1, 'Position is required'),
  employment_type: z.enum(['full-time', 'part-time', 'contract']),
})

type FormData = z.infer<typeof schema>

interface AddEmployeeFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const departmentOptions = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Finance',     label: 'Finance'     },
  { value: 'HR',          label: 'HR'          },
  { value: 'Marketing',   label: 'Marketing'   },
  { value: 'Operations',  label: 'Operations'  },
  { value: 'Sales',       label: 'Sales'       },
  { value: 'Legal',       label: 'Legal'       },
  { value: 'IT',          label: 'IT'          },
]

const employmentTypeOptions = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract',  label: 'Contract'  },
]

export default function AddEmployeeForm({ onSuccess, onCancel }: AddEmployeeFormProps) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { employment_type: 'full-time' }
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => employeesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      onSuccess()
    }
  })

  const onSubmit = (data: FormData) => mutation.mutate(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {(mutation.error as any)?.response?.data?.message || 'Failed to create employee'}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Full Name"
            placeholder="e.g. Jane Wanjiku"
            error={errors.full_name?.message}
            {...register('full_name')}
          />
        </div>
        <Input
          label="Email Address"
          type="email"
          placeholder="jane@company.co.ke"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone Number"
          placeholder="0712345678"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Select
          label="Department"
          options={departmentOptions}
          error={errors.department?.message}
          {...register('department')}
        />
        <Input
          label="Position / Job Title"
          placeholder="e.g. Senior Accountant"
          error={errors.position?.message}
          {...register('position')}
        />
        <div className="col-span-2">
          <Select
            label="Employment Type"
            options={employmentTypeOptions}
            error={errors.employment_type?.message}
            {...register('employment_type')}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={mutation.isPending}>
          Add Employee
        </Button>
      </div>
    </form>
  )
}
