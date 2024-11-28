import { Icon } from 'lucide-react';
import React from 'react';
import { IconBase } from 'react-icons';



export function StatsCard({icon: Icon, label, value, bgColor, iconColor }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="mt-4 text-sm text-gray-600">{label}</p>
    </div>
    );
}