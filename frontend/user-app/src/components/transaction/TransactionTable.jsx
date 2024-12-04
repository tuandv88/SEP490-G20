import React from 'react';
import TransactionStatus from './TransactionStatus';
import { Coins } from 'lucide-react';


const TransactionTable = ({ transactions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{transaction.courseName}</div>
                <div className="text-sm text-gray-500">ID: {transaction.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                  <div className="text-sm text-gray-900">
                    Original: ${transaction.amount.toFixed(2)}
                  </div>
                  {transaction.pointsUsed > 0 && (
                    <div className="flex items-center gap-1 text-sm text-indigo-600">
                      <Coins className="w-4 h-4" />
                      <span>-${transaction.pointsValue.toFixed(2)} ({transaction.pointsUsed} points)</span>
                    </div>
                  )}
                  <div className="text-sm font-medium text-green-600">
                    Final: ${transaction.finalAmount.toFixed(2)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <TransactionStatus status={transaction.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.paymentMethod}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;