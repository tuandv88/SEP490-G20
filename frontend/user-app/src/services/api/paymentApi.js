import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL =  import.meta.env.VITE_API_URL

export const PaymentAPI = {
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/checkout/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }
}