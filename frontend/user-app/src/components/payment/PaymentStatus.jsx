import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';


const PaymentStatus = ({ paymentStatus }) => {
  const getStatusIcon = () => {
    if (paymentStatus.status?.includes('successful')) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (paymentStatus.status?.includes('canceled')) {
      return <XCircle className="w-6 h-6 text-red-500" />;
    }
    return <Clock className="w-6 h-6 text-blue-500" />;
  };

  if (!paymentStatus.orderId) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <div>
          <h3 className="text-sm font-medium text-gray-700">
            Order ID: {paymentStatus.orderId}
          </h3>
          <p className="text-sm text-gray-600">
            Status: {paymentStatus.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;