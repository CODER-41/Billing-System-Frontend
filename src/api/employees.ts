import apiClient from './client'
import type { Employee, BankAccount, SalaryStructure, PaginatedResponse, ApiResponse } from '../types'

export const employeesApi = {
  list: async (params?: { page?: number; search?: string; department?: string }) => {
    const res = await apiClient.get<PaginatedResponse<Employee>>('/employees/', { params })
    return res.data
  },
  get: async (id: number) => {
    const res = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`)
    return res.data.data
  },
  create: async (data: Partial<Employee>) => {
    const res = await apiClient.post<ApiResponse<Employee>>('/employees/', data)
    return res.data.data
  },
  update: async (id: number, data: Partial<Employee>) => {
    const res = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data)
    return res.data.data
  },
  deactivate: async (id: number) => {
    const res = await apiClient.delete(`/employees/${id}`)
    return res.data
  },
  getBankAccounts: async (id: number) => {
    const res = await apiClient.get<ApiResponse<BankAccount[]>>(`/employees/${id}/bank-accounts`)
    return res.data.data
  },
  addBankAccount: async (id: number, data: Partial<BankAccount>) => {
    const res = await apiClient.post<ApiResponse<BankAccount>>(`/employees/${id}/bank-accounts`, data)
    return res.data.data
  },
  getSalary: async (id: number) => {
    const res = await apiClient.get<ApiResponse<SalaryStructure>>(`/employees/${id}/salary`)
    return res.data.data
  },
  createSalary: async (id: number, data: Partial<SalaryStructure>) => {
    const res = await apiClient.post<ApiResponse<SalaryStructure>>(`/employees/${id}/salary`, data)
    return res.data.data
  },
}
