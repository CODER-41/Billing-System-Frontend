import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '../../api/employees'
import { useToast } from '../../store/toastStore'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const schema = z.object({
  bank_code:      z.string().min(1, 'Please select a bank'),
  account_number: z.string().min(5, 'Enter a valid account number'),
  account_name:   z.string().min(3, 'Account name is required'),
  recipient_type: z.enum(['bank', 'mobile_money']),
})

type FormData = z.infer<typeof schema>

interface Props {
  employeeId: number
  onSuccess: () => void
  onCancel: () => void
}

const kenyanBanks = [
  { value: '03',     label: 'Absa Bank Kenya'        },
  { value: '26',     label: 'Access Bank Kenya'       },
  { value: '063',    label: 'KCB Bank'                },
  { value: '068',    label: 'Equity Bank'             },
  { value: '011',    label: 'Co-operative Bank'       },
  { value: '012',    label: 'Standard Chartered'      },
  { value: '023',    label: 'Diamond Trust Bank'      },
  { value: '049',    label: 'Family Bank'             },
  { value: '066',    label: 'Absa Bank Kenya'         },
  { value: 'MTN',    label: 'M-Pesa'                  },
]

const recipientTypeOptions = [
  { value: 'bank',         label: 'Bank Account' },
  { value: 'mobile_money', label: 'M-Pesa'       },
]

export default function AddBankAccountForm({ employeeId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { recipient_type: 'bank', bank_code: '' }
  })

  const recipientType = watch('recipient_type')

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const bank = kenyanBanks.find(b => b.value === data.bank_code)
      return employeesApi.addBankAccount(employeeId, {
        bank_name:      bank?.label || data.bank_code,
        bank_code:      data.bank_code,
        account_number: data.account_number,
        account_name:   data.account_name,
        recipient_type: data.recipient_type,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts', employeeId] })
      toast.success('Bank account added successfully!')
      onSuccess()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add bank account')
    }
  })

  return (
    <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
      <Select
        label="Payment Method"
        options={recipientTypeOptions}
        error={errors.recipient_type?.message}
        {...register('recipient_type')}
      />
      <Select
        label={recipientType === 'mobile_money' ? 'Mobile Provider' : 'Bank'}
        options={kenyanBanks}
        error={errors.bank_code?.message}
        {...register('bank_code')}
      />
      <Input
        label={recipientType === 'mobile_money' ? 'Phone Number' : 'Account Number'}
        placeholder={recipientType === 'mobile_money' ? '0712345678' : '1234567890'}
        error={errors.account_number?.message}
        {...register('account_number')}
      />
      <Input
        label="Account Name"
        placeholder="Full name as registered with bank"
        error={errors.account_name?.message}
        {...register('account_name')}
      />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={mutation.isPending}>
          Save Account
        </Button>
      </div>
    </form>
  )
}
