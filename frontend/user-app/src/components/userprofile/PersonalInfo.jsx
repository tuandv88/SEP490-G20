import React from 'react';
import { MapPin, Briefcase, GraduationCap } from 'lucide-react';

export function PersonalInfo() {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-6">Thông tin cá nhân</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Địa chỉ</p>
            <p className="font-medium">Hà Nội, Việt Nam</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Briefcase className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Nghề nghiệp</p>
            <p className="font-medium">Software Developer</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <GraduationCap className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Trình độ học vấn</p>
            <p className="font-medium">Đại học</p>
          </div>
        </div>
      </div>
    </div>
  );
}