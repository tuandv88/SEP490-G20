import axios from 'axios'
import Cookies from 'js-cookie'
const API_BASE_URL =  import.meta.env.VITE_API_URL

export const PaymentAPI = {
  createPaymentIntent: async (courseId) => {
    const response = await axios.post(`${API_BASE_URL}/payment/create-payment-intent`, { courseId })
    return response.data
  }
}