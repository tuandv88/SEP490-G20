import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
        

const TransactionStatus = ({ status }) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-green-600 bg-green-50',
          text: 'Completed'
        };
      case 'created':
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'text-yellow-600 bg-yellow-50',
          text: status
        };
      case 'failed':
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: 'text-red-600 bg-red-50',
          text: 'Failed'
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'text-gray-600 bg-gray-50',
          text: status
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${config.color}`}>
      {config.icon}
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
};

export default TransactionStatus;