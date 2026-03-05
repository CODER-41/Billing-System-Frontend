export interface User {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'hr_admin' | 'finance_admin'
  created_at: string
}

export interface Employee {
  id: number
  employee_code: string
  full_name: string
  email: string
  phone: string
  department: string
  position: string
  employment_type: 'full-time' | 'part-time' | 'contract'
  status: 'active' | 'inactive'
  created_at: string
}

export interface BankAccount {
  id: number
  employee_id: number
  bank_name: string
  bank_code: string
  account_number: string
  account_name: string
  recipient_type: string
  paystack_recipient_code: string | null
  is_primary: boolean
  created_at: string
}

export interface SalaryStructure {
  id: number
  employee_id: number
  basic_salary: number
  allowances: Record<string, number>
  deductions: Record<string, number>
  net_salary: number
  effective_date: string
  created_at: string
}

export interface PayrollRun {
  id: number
  title: string
  pay_period_start: string
  pay_period_end: string
  payment_date: string
  status: 'draft' | 'pending_approval' | 'approved' | 'processing' | 'completed' | 'failed'
  total_amount: number
  created_by: number
  approved_by: number | null
  created_at: string
}

export interface PayrollItem {
  id: number
  payroll_run_id: number
  employee: Employee
  bank_account: BankAccount
  gross_salary: number
  total_allowances: number
  total_deductions: number
  net_salary: number
  status: 'pending' | 'processing' | 'paid' | 'failed'
  created_at: string
}

export interface Transfer {
  id: number
  payroll_item_id: number
  paystack_transfer_code: string | null
  paystack_reference: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  failure_reason: string | null
  initiated_at: string
  completed_at: string | null
}

export interface PaginatedResponse<T> {
  status: string
  data: T[]
  total: number
  page: number
  per_page: number
}

export interface ApiResponse<T> {
  status: string
  data: T
  message?: string
}
