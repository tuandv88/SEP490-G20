import React, { useState } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { createPayPalOrder, capturePayPalOrder } from '@/services/api/paypalService';
import OrderItem from './OrderItem';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import PaymentStatus from './PaymentStatus';


const PayPalCheckout = () => {
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const orderItem = {
    id: '1',
    name: 'The Complete Guide to Unity 3D: Making a Top Down Shooter',
    price: 299000,
    originalPrice: 1499000,
    imageUrl: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&q=80&w=300&h=200',
  };

  const orderSummary = {
    originalPrice: 1499000,
    discountRate: 1200000,
    total: 299000,
    itemCount: 1,
  };

  const handleCreateOrder = async () => {
    try {
      const data = await createPayPalOrder();
      setOrderId(data.id);
      setPaymentStatus("Order created! Awaiting payment...");
      return data.id;
    } catch (error) {
      console.error('Error creating order:', error);
      setPaymentStatus("Error creating order. Please try again.");
      throw error;
    }
  };

  const handleApprove = async (data) => {
    try {
      const result = await capturePayPalOrder(data.orderID);
      console.log("Capture result", result);
      setPaymentStatus("Payment successful! Thank you for your purchase.");
    } catch (error) {
      console.error('Error capturing order:', error);
      setPaymentStatus("Error processing payment. Please try again.");
    }
  };

  const handleCancel = () => {
    setPaymentStatus("Payment was canceled.");
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Order information</h2>
            <OrderItem item={orderItem} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <PaymentMethod 
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />

            {paymentMethod === 'paypal' && (
              <div className="mt-6">
                <PayPalButtons
                  createOrder={handleCreateOrder}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  style={{ layout: "vertical" }}
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

        <div className="md:col-span-1">
          <OrderSummary summary={orderSummary} />          
        </div>
      </div>
    </div>
  );
};

export default PayPalCheckout;