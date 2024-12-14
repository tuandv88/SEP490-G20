import React, { useState } from 'react';
import TransactionStatus from './TransactionStatus';
import { Coins, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { CustomConfirmModal } from '../ui/button-confirm-modal';
import { PaymentAPI } from '@/services/api/paymentApi';
import { useToast } from '@/hooks/use-toast';
import { AUTHENTICATION_ROUTERS } from '@/data/constants';
import { useNavigate } from 'react-router-dom';

const isWithin30Minutes = (dateTime) => {
  const transactionDate = new Date(dateTime);
  const currentDate = new Date();
  const diffInMinutes = Math.floor((currentDate - transactionDate) / (1000 * 60));
  return diffInMinutes <= 30;
};

const TransactionTable = ({ transactions, onTransactionCancelled }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate()

  const handleCancelClick = (transaction) => {
    if (isWithin30Minutes(transaction.dateTime)) {
      toast({
        title: "Cannot cancel transaction",
        description: "You need to wait 30 minutes after creating the transaction to cancel it.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTransaction(transaction);
    setIsConfirmOpen(true);
  };

  const handleCourseClick = (courseId) => {
    navigate(AUTHENTICATION_ROUTERS.COURSEDETAIL.replace(':id', courseId))
  }

  const handleConfirmCancel = async () => {
    if (!selectedTransaction) return;

    try {
      setIsCancelling(true);
      await PaymentAPI.cancelTransaction(selectedTransaction.transactionId);
      toast({
        title: "Transaction Cancelled",
        description: "The transaction has been cancelled successfully.",
      });

      // Notify parent component to refresh the transactions
      if (onTransactionCancelled) {
        onTransactionCancelled();
      }
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      toast({
        title: "Error",
        description: "Failed to cancel the transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setIsConfirmOpen(false);
      setSelectedTransaction(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Price Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Payment Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 w-[200px]">
                  <div onClick={() => handleCourseClick(transaction.items[0]?.productId)} className="text-sm font-medium text-gray-900 truncate cursor-pointer" >
                    {transaction.items[0]?.productName || 'Unnamed Course'}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    ID: {transaction.items[0]?.productId}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 w-[120px]">
                  {new Date(transaction.dateTime).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 w-[200px]">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">
                      Original: ${transaction.items[0]?.unitPrice.toFixed(2)}
                    </div>
                    {transaction.pointsUsed > 0 && (
                      <div className="flex items-center gap-1 text-sm text-indigo-600">
                        <Coins className="w-4 h-4" />
                        <span>-${transaction.discountAmount.toFixed(2)} ({transaction.pointsUsed} points)</span>
                      </div>
                    )}
                    <div className="text-sm font-medium text-green-600">
                      Final: ${transaction.grossAmount.toFixed(2)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 w-[120px]">
                  <TransactionStatus status={transaction.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 w-[120px]">
                  {transaction.paymentMethod}
                </td>
                <td className="px-6 py-4 w-[100px]">
                  {transaction.status === 'Created' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelClick(transaction)}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomConfirmModal
        isOpen={isConfirmOpen}
        onComplete={() => {
          setIsConfirmOpen(false);
          setSelectedTransaction(null);
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Transaction"
        content="Are you sure you want to cancel this transaction? This action cannot be undone."
        confirmText="Yes, cancel transaction"
        cancelText="No, keep it"
        isLoading={isCancelling}
      />
    </>
  );
};

export default TransactionTable;