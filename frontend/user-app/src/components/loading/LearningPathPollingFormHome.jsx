import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AUTHENTICATION_ROUTERS } from '@/data/constants';

export function LearningPathPollingFormHome({ status, message, onClose }) {
  const navigate = useNavigate();

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-600" />,
          bgColor: 'bg-green-100',
          title: 'Learning Path Created Successfully',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          buttonText: 'View Learning Path',
          onClick: () => {
            onClose();
            navigate(AUTHENTICATION_ROUTERS.USERPROFILE + '/roadmap');
          }
        };
      case 'polling':
        return {
          icon: <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />,
          bgColor: 'bg-blue-100',
          title: 'Creating Learning Path',
          message: 'Please wait for a moment...',
          buttonColor: 'bg-blue-600 hover:bg-blue-700',
          buttonText: 'Processing...'
        };
      case 'error':
      default:
        return {
          icon: <XCircle className="h-12 w-12 text-red-600" />,
          bgColor: 'bg-red-100',
          title: 'Cannot create learning path',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          buttonText: 'Retry',
          onClick: onClose
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
            <p className="text-gray-600">{message || config.message}</p>
          </div>

          {status !== 'polling' && (
            <button
              onClick={config.onClick || onClose}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${config.buttonColor}`}
              disabled={status === 'polling'}
            >
              {config.buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}