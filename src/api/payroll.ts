import apiClient from './client'
import type { PayrollRun, PayrollItem, PaginatedResponse, ApiResponse } from '../types'

export const payrollApi = {
  list: async (params?: { page?: number; status?: string }) => {
    const res = await apiClient.get<PaginatedResponse<PayrollRun>>('/payroll/', { params })
    return res.data
  },
  get: async (id: number) => {
    const res = await apiClient.get<ApiResponse<PayrollRun>>(`/payroll/${id}`)
    return res.data.data
  },
  create: async (data: Partial<PayrollRun>) => {
    const res = await apiClient.post<ApiResponse<PayrollRun>>('/payroll/', data)
    return res.data.data
  },
  submit: async (id: number) => {
    const res = await apiClient.post(`/payroll/${id}/submit`)
    return res.data
  },
  approve: async (id: number) => {
    const res = await apiClient.post(`/payroll/${id}/approve`)
    return res.data
  },
  reject: async (id: number) => {
    const res = await apiClient.post(`/payroll/${id}/reject`)
    return res.data
  },
  process: async (id: number) => {
    const res = await apiClient.post(`/payroll/${id}/process`)
    return res.data
  },
  getItems: async (id: number) => {
    const res = await apiClient.get<ApiResponse<PayrollItem[]>>(`/payroll/${id}/items`)
    return res.data.data
  },
  getSummary: async (id: number) => {
    const res = await apiClient.get(`/reports/payroll-summary/${id}`)
    return res.data.data
  },
}
