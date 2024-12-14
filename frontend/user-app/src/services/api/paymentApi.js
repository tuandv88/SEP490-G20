import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL = import.meta.env.VITE_API_URL

export const PaymentAPI = {
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/checkout/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      })
      console.log(response)
      return response.json()
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },
  getTransactions: async (pageIndex, pageSize) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payment-service/transactions?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },
  cancelTransaction: async (transactionId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/payment-service/transactions/${transactionId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error cancelling transaction:', error)
      throw error
    }
  },
  checkPaymentEligibility: async (itemId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payment-service/items/${itemId}/payment-eligibility`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error checking payment eligibility:', error)
      throw error
    }
  }
}
