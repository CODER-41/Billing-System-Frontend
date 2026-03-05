import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import EmployeesPage from './pages/employees/EmployeesPage'
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage'
import PayrollPage from './pages/payroll/PayrollPage'
import PayrollDetailPage from './pages/payroll/PayrollDetailPage'
import TransfersPage from './pages/transfers/TransfersPage'
import ReportsPage from './pages/reports/ReportsPage'
import UsersPage from './pages/users/UsersPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 }
  }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard"     element={<DashboardPage />} />
            <Route path="/employees"     element={<EmployeesPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/payroll"       element={<PayrollPage />} />
            <Route path="/payroll/:id"   element={<PayrollDetailPage />} />
            <Route path="/transfers"     element={<TransfersPage />} />
            <Route path="/reports"       element={<ReportsPage />} />
            <Route path="/users"         element={<UsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
