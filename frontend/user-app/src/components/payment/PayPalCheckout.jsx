import React, { useEffect, useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { createPayPalOrder, capturePayPalOrder } from '@/services/api/paypalService'
import OrderItem from './OrderItem'
import PaymentMethod from './PaymentMethod'
import OrderSummary from './OrderSummary'
import PaymentStatus from './PaymentStatus'
import { useParams } from 'react-router-dom'
import { LearningAPI } from '@/services/api/learningApi'
import { Switch } from '@mui/material'
import { UserAPI } from '@/services/api/userApi'
import { PaymentAPI } from '@/services/api/paymentApi'

const PayPalCheckout = () => {
  const { id } = useParams()
  const [orderId, setOrderId] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [courseDetail, setCourseDetail] = useState(null)
  const [usePoints, setUsePoints] = useState(false)
  const [userPoint, setUserPoint] = useState(0)
  const [orderSummaryState, setOrderSummaryState] = useState(null)

  console.log(userPoint)

  useEffect(() => {
    const fetchUserPoint = async () => {
      try {
        const response = await UserAPI.getUserPoint()
        setUserPoint(response.totalPoints)
      } catch (error) {
        console.error('Error fetching user points:', error)
        setUserPoint(0)
      }
    }
    fetchUserPoint()
  }, [])


  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await LearningAPI.getCoursePreview(id)
        setCourseDetail(response.course)
      } catch (error) {
        console.error('Error fetching course detail:', error)
      }
    }
    fetchCourseDetail()
  }, [id])


  useEffect(() => {
    if (courseDetail) {
      setOrderSummaryState({
        originalPrice: courseDetail.price,
        discountRate: 0,
        total: courseDetail.price,
        itemCount: 1
      })
    }
  }, [courseDetail])

  const orderItem = courseDetail
    ? {
        id: courseDetail.id,
        name: courseDetail.title,
        price: courseDetail.price,
        originalPrice: courseDetail.price,
        imageUrl: courseDetail.imageUrl
      }
    : null

  const handleCreateOrder = async () => {
    console.log("IN")
    try {
      const orderData = {
        order: {
          paymentMethod: "Paypal",
          point: usePoints ? userPoint : 0,
          item: {
            productId: courseDetail.id,
            productType: "Course",
            quantity: 1,
            unitPrice: courseDetail.price
          }
        }
      }

      const response = await PaymentAPI.createOrder(orderData)
      setOrderId(response.data.orderId)
      setPaymentStatus('Order created! Awaiting payment...')
      console.log(response.data.orderId)
      return response.data.orderId
    } catch (error) {
      console.error('Error creating order:', error)
      setPaymentStatus('Error creating order. Please try again.')
      throw error
    }
  }

  const handleApprove = async (data) => {
    try {
      const result = await capturePayPalOrder(data.orderID)
      console.log('Capture result', result)
      setPaymentStatus('Payment successful! Thank you for your purchase.')
    } catch (error) {
      console.error('Error capturing order:', error)
      setPaymentStatus('Error processing payment. Please try again.')
    }
  }

  const handleCancel = () => {
    setPaymentStatus('Payment was canceled.')
  }

  const handleTogglePoints = () => {
    if (!courseDetail) return;
    
    setUsePoints(!usePoints)
    if (!usePoints) {
      const pointValue = (userPoint / 1000)
      const newTotal = Math.max(0, courseDetail.price - pointValue)
      setOrderSummaryState({
        originalPrice: courseDetail.price,
        discountRate: pointValue,
        total: newTotal,
        itemCount: 1
      })
    } else {
      setOrderSummaryState({
        originalPrice: courseDetail.price,
        discountRate: 0,
        total: courseDetail.price,
        itemCount: 1
      })
    }
  }

  return (
    <div className='max-w-5xl mx-auto px-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 space-y-8'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-6'>Order information</h2>
            {courseDetail && <OrderItem item={orderItem} />}
          </div>

          <div className='mt-6 border-t border-gray-200 pt-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium text-gray-700'>Use Points</span>
                  <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                    {userPoint} points available
                  </span>
                </div>
                <p className='text-sm text-gray-500'>
                  Value: ${(userPoint / 1000).toFixed(2)}
                </p>
              </div>
              <Switch
                checked={usePoints}
                onChange={handleTogglePoints}
                className='relative inline-flex h-6 w-11 items-center rounded-full'
              />
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <PaymentMethod selectedMethod={paymentMethod} onMethodChange={setPaymentMethod} />

            {paymentMethod === 'paypal' && (
              <div className='mt-6'>
                <PayPalButtons
                  createOrder={handleCreateOrder}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  style={{ layout: 'vertical' }}
                />
              </div>
            )}

            <PaymentStatus
              paymentStatus={{
                orderId,
                status: paymentStatus
              }}
            />
          </div>
        </div>

        <div className='md:col-span-1'>
          {courseDetail && orderSummaryState && <OrderSummary summary={orderSummaryState} />}
        </div>
      </div>
    </div>
  )
}

export default PayPalCheckout
