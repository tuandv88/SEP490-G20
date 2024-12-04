import React from 'react';

const OrderItem = ({ item }) => {
  return (
    <div className="flex space-x-4 mb-6">
      <img 
        src={item.imageUrl} 
        alt={item.name}
        className="w-24 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <div className="flex items-center space-x-2 mt-1">
          <span className="font-bold">₫{item.price.toLocaleString()}</span>
          <span className="text-gray-500 line-through text-sm">
            ₫{item.originalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;