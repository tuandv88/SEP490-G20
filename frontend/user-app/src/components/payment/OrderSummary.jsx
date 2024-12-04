import React from 'react';
import { CreditCard, Lock } from 'lucide-react';

const PaymentMethod = ({ selectedMethod, onMethodChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Payment method</h2>
        <div className="flex items-center text-gray-600 text-sm">
          <Lock className="w-4 h-4 mr-1" />
          Secure and encrypted
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={selectedMethod === 'paypal'}
            onChange={() => onMethodChange('paypal')}
            className="mr-3"
          />
          <img src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
               alt="PayPal" 
               className="h-6" />
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={selectedMethod === 'card'}
            onChange={() => onMethodChange('card')}
            className="mr-3"
          />
          <CreditCard className="mr-2" />
          <span>Card</span>
          <div className="ml-auto flex space-x-2">
            <img src="https://athgroup.vn/upload/blocks/thumb_1920x0/ATH-kh%C3%A1m-ph%C3%A1-b%E1%BB%99-nh%E1%BA%ADn-di%E1%BB%87n-mastercard-4.png" 
                 alt="Mastercard" 
                 className="h-6" />
            <img src="https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-512.png" 
                 alt="Visa" 
                 className="h-6" />
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethod;