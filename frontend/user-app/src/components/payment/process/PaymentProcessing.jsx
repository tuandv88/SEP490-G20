import React, { useEffect, useState } from 'react';

import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';


const processingMessages = [
  'Đang xử lý thanh toán của bạn...',
  'Đang xác thực giao dịch...',
  'Gần xong rồi...',
  'Hoàn tất thanh toán...'
];

export function PaymentProcessing({ status = 'processing', onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % processingMessages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-blue-50 p-4 rounded-full">
            <CreditCard className="h-12 w-12 text-blue-600" />
          </div>
          
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Đang xử lý</h2>
            <p className="text-gray-600">{processingMessages[messageIndex]}</p>
          </div>

          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((messageIndex + 1) / processingMessages.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Giao dịch an toàn & bảo mật</span>
          </div>
        </div>
      </div>
    </div>
  );
}