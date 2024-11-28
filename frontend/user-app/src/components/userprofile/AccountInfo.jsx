import React from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';

export function AccountInfo() {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-6">Thông tin tài khoản</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">namle@example.com</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Số điện thoại</p>
            <p className="font-medium">+84 123 456 789</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Ngày tham gia</p>
            <p className="font-medium">01/01/2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}