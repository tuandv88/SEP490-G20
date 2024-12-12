import React, { useEffect, useState, useRef } from 'react'
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
import { Loading } from '../ui/overlay'
import Cookies from 'js-cookie'
import { AUTHENTICATION_ROUTERS } from '@/data/constants'
import { useNavigate } from 'react-router-dom'
import { CourseAPI } from '@/services/api/courseApi'
import { PaymentStatusPoll } from './process/PaymentStatusPoll'
import { useToast } from '@/hooks/use-toast'

const PayPalCheckout = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [orderId, setOrderId] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [courseDetail, setCourseDetail] = useState(null)
  const [usePoints, setUsePoints] = useState(false)
  const [userPoint, setUserPoint] = useState(0)
  const [orderSummaryState, setOrderSummaryState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const usePointsRef = useRef(false)
  const [paymentPollStatus, setPaymentPollStatus] = useState(null)
  const [paymentMessage, setPaymentMessage] = useState('')

  const API_BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        setLoading(true)
        const response = await PaymentAPI.checkPaymentEligibility(id)
        
        if (!response.isAccepted) {
          toast({
            title: "Payment Not Allowed",
            description: "You have the order that has been created and not paid.",
            variant: "destructive",
          })
          navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', id))
          return
        }

        await fetchCourseDetail()
        await fetchUserPoint()
      } catch (error) {
        console.error('Error checking payment eligibility:', error)
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        })
        navigate(AUTHENTICATION_ROUTERS.HOME)
      } finally {
        setLoading(false)
      }
    }

    checkEligibility()
  }, [id, navigate, toast])

  const fetchCourseDetail = async () => {
    try {
      const response = await LearningAPI.getCoursePreview(id)
      setCourseDetail(response.course)
    } catch (error) {
      console.error('Error fetching course detail:', error)
      throw error
    }
  }

  const fetchUserPoint = async () => {
    try {
      const response = await UserAPI.getUserPoint()
      setUserPoint(response.totalPoints)
    } catch (error) {
      console.error('Error fetching user points:', error)
      setUserPoint(0)
    }
  }

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

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const enrolledCourses = await CourseAPI.getEnrolledCourses(id);
        if (enrolledCourses && enrolledCourses.enrollmentInfo !== null) {
          navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', id))
        }
      } catch (error) {
        console.error('Error checking enrollment:', error);
      }
    };

    checkEnrollment();
  }, [id, navigate]);

  const orderItem = courseDetail
    ? {
        id: courseDetail.id,
        name: courseDetail.title,
        price: courseDetail.price,
        originalPrice: courseDetail.price,
        imageUrl: courseDetail.imageUrl
      }
    : null

  if (loading) {
    return <Loading />
  }

  const handleCreateOrder = async () => {

    try{
      const response = await PaymentAPI.checkPaymentEligibility(id)
      if (!response.isAccepted) {
        toast({
          title: "Payment Not Allowed",
          description: "You have the order that has been created and not paid.",
          variant: "destructive",
        })
        navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', id))
        return        
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }

    const response = await fetch(`${API_BASE_URL}/payment-service/checkout/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Cookies.get('authToken')}` },
      body: JSON.stringify({
        Order: {
          PaymentMethod: 'Paypal',
          Point: usePointsRef.current ? userPoint : 0,
          Item: {
            ProductId: courseDetail.id,
            ProductName: courseDetail.title,
            ProductType: 'Course',
            Quantity: 1,
            UnitPrice: courseDetail.price
          }
        }
      })
    })
    const data = await response.json()
    setOrderId(data.orderId)
    setPaymentStatus('Order created! Awaiting payment...')
    return data.orderId
  }

  const handleApprove = async (data) => {
    try {
      setPaymentPollStatus('processing')
      setPaymentMessage('Processing your payment ...')
      setIsProcessingPayment(true)
      let intervalId, timeoutId

      const pollForEnrolledCourses = async () => {
        try {
          const enrolledCourses = await CourseAPI.getEnrolledCourses(id)
          if (enrolledCourses && enrolledCourses.enrollmentInfo !== null) {
            cleanup()
            setPaymentPollStatus('success')
            setPaymentMessage('Thank you for your purchase!')
          }
        } catch (error) {
          console.error('Error fetching enrolled courses:', error)
        }
      }

      const cleanup = () => {
        if (intervalId) clearInterval(intervalId)
        if (timeoutId) clearTimeout(timeoutId)
        setIsProcessingPayment(false)
      }

      intervalId = setInterval(pollForEnrolledCourses, 1000)

      timeoutId = setTimeout(() => {
        cleanup()
        setPaymentPollStatus('pending')
        setPaymentMessage('Waiting for payment. Please check again later.')
      }, 15000)

      return () => cleanup()
    } catch (error) {
      console.error('Error processing payment:', error)
      setPaymentPollStatus('error')
      setPaymentMessage('An error occurred during payment. Please try again.')
      setIsProcessingPayment(false)
    }
  }

  const handleCancel = () => {
    setPaymentStatus('Payment was canceled.')
  }

  const handleTogglePoints = () => {
    if (!courseDetail) return

    setUsePoints(!usePoints)
    usePointsRef.current = !usePoints

    const pointValue = userPoint / 1000
    const willUsePoints = !usePoints

    if (willUsePoints) {
      const newTotal = Math.max(0, courseDetail.price - pointValue).toFixed(2)
      setOrderSummaryState({
        originalPrice: courseDetail.price,
        discountRate: pointValue.toFixed(2),
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

  const handleClosePaymentStatus = () => {
    setPaymentPollStatus(null)
    setPaymentMessage('')
    
    switch (paymentPollStatus) {
      case 'success':
        navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', id))
        break
      case 'pending':
        navigate(AUTHENTICATION_ROUTERS.HOME)
        break
      case 'error':
        navigate(AUTHENTICATION_ROUTERS.COURSELIST)
        break
    }
  }

  return (
    <div className='max-w-5xl mx-auto px-4'>
      {paymentPollStatus && (
        <PaymentStatusPoll
          status={paymentPollStatus}
          message={paymentMessage}
          onClose={handleClosePaymentStatus}
        />
      )}
      {/* {isProcessingPayment && <Loading />} */}
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
                <p className='text-sm text-gray-500'>Value: ${(userPoint / 1000).toFixed(2)}</p>
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
                  disabled={paymentPollStatus}
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