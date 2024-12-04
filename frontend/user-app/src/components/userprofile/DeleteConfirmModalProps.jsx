import React from 'react';
import { AlertTriangle } from 'lucide-react';


export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  pathName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-yellow-500">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold">Delete Learning Path</h2>
        </div>
        
        <p className="mb-6">
          Are you sure you want to delete the learning path "{pathName}"? This
          action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};