import PayPalCheckout from '@/components/payment/PayPalCheckout'
import Layout from '@/layouts/layout'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useEffect } from 'react'

export default function Payment() {
  return (
    <Layout>
      <div className='min-h-screen bg-gray-100 py-12 mt-[70px]'>
        <PayPalScriptProvider
          options={{ 'client-id': 'ATncYgnc0VHRxHwgBByz3OLk3Nuw4SG4KXA3sLJZkwmYVxTxXFoxlEBt-UoBmZ-U0xKTY0dBZ18li-GA' }}
        >
          <PayPalCheckout />
        </PayPalScriptProvider>
      </div>
    </Layout>
  )
}
