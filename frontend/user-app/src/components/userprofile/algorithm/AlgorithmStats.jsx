import React from 'react';

export function AlgorithmStats() {
  const stats = [
    { label: 'Dễ', solved: 15, total: 20, color: 'bg-green-500' },
    { label: 'Trung bình', solved: 10, total: 30, color: 'bg-yellow-500' },
    { label: 'Khó', solved: 5, total: 25, color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Thống kê bài giải</h2>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{stat.label}</span>
              <span className="text-sm text-gray-500">{stat.solved}/{stat.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${stat.color} h-2 rounded-full`}
                style={{ width: `${(stat.solved / stat.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}