import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCheck, CreditCard,
  BarChart3, Settings, LogOut, Building2
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth'

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',  roles: ['super_admin', 'hr_admin', 'finance_admin'] },
  { to: '/employees',  icon: Users,           label: 'Employees',  roles: ['super_admin', 'hr_admin', 'finance_admin'] },
  { to: '/payroll',    icon: CreditCard,      label: 'Payroll',    roles: ['super_admin', 'hr_admin', 'finance_admin'] },
  { to: '/transfers',  icon: BarChart3,       label: 'Transfers',  roles: ['super_admin', 'finance_admin']             },
  { to: '/reports',    icon: BarChart3,       label: 'Reports',    roles: ['super_admin', 'hr_admin', 'finance_admin'] },
  { to: '/users',      icon: UserCheck,       label: 'Users',      roles: ['super_admin']                              },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    logout()
    window.location.href = '/login'
  }

  const allowed = navItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  )

  return (
    <aside className="w-64 min-h-screen bg-gray-900 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">PayrollKE</p>
            <p className="text-gray-400 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {allowed.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="px-3 py-2 mb-2">
          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
          <p className="text-gray-400 text-xs truncate">{user?.role?.replace('_', ' ')}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
