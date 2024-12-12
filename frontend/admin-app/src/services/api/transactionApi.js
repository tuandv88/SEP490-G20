import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'

export const getTransactionsAudit = async (
  pageIndex,
  pageSize,
  filters = {
    startDate: null,
    endDate: null,
    status: null,
    paymentMethod: null,
    minAmount: null,
    maxAmount: null
  }
) => {
  try {
    // Tạo object chứa các query params
    const queryParams = {
      PageIndex: pageIndex,
      PageSize: pageSize,
      ...(filters.startDate && { StartDate: filters.startDate }),
      ...(filters.endDate && { EndDate: filters.endDate }),
      ...(filters.status && { Status: filters.status }),
      ...(filters.paymentMethod && { PaymentMethod: filters.paymentMethod }),
      ...(filters.minAmount && { MinAmount: filters.minAmount }),
      ...(filters.maxAmount && { MaxAmount: filters.maxAmount })
    }

    // Chuyển đổi object thành query string, loại bỏ các giá trị null/undefined
    const queryString = Object.entries(queryParams)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    const response = await axiosInstance.get(`/payment-service/transactions/audits?${queryString}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('authToken')}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
