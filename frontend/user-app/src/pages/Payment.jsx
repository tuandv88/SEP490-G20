import PayPalCheckout from '@/components/payment/PayPalCheckout'
import Layout from '@/layouts/layout'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useEffect } from 'react'

export default function Payment({ courseId, price, onClose }) {
  return (
    <Layout>
      <div className='min-h-screen bg-gray-100 py-12 mt-[70px]'>
        <PayPalScriptProvider
          options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID }}
        >
          <PayPalCheckout />
        </PayPalScriptProvider>       
      </div>
    </Layout>
  )
}
