import React from 'react';
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';

export function PaymentStatusPoll({ status, message, onClose  }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-600" />,
          bgColor: 'bg-green-100',
          title: 'Successful payment',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          buttonText: 'Continue'
        };
      case 'processing':
        return {
          icon: <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />,
          bgColor: 'bg-blue-100',
          title: 'Processing payment',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          buttonText: 'Processing...'
        };
      case 'pending':
        return {
          icon: <Clock className="h-12 w-12 text-yellow-600" />,
          bgColor: 'bg-yellow-100',
          title: 'Waiting for payment',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          buttonText: 'Back to home'
        };
      case 'error':
      default:
        return {
          icon: <XCircle className="h-12 w-12 text-red-600" />,
          bgColor: 'bg-red-100',
          title: 'Payment failed',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          buttonText: 'Try again'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className={`inline-flex p-4 rounded-full ${config.bgColor}`}>
            {config.icon}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {config.title}
            </h2>
            <p className="text-gray-600">{message}</p>
          </div>

          {status !== 'processing' && (
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${config.buttonColor}`}
              disabled={status === 'processing'}
            >
              {config.buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}