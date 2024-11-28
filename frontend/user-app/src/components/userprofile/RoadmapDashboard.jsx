import React from 'react';
import { PlusCircle } from 'lucide-react';

export function RoadmapDashboard() {
  const suggestedRoadmaps = [
    {
      id: 1,
      title: 'Full-stack Developer',
      description: 'Lộ trình học để trở thành Full-stack Developer chuyên nghiệp',
      duration: '12 tháng',
      level: 'Trung cấp',
      courses: 8,
      image: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      title: 'DevOps Engineer',
      description: 'Lộ trình học DevOps từ cơ bản đến nâng cao',
      duration: '9 tháng',
      level: 'Nâng cao',
      courses: 6,
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=400',
    }
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lộ trình được đề xuất</h2>
        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" />
          Tạo lộ trình
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {suggestedRoadmaps.map((roadmap) => (
          <div key={roadmap.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img 
              src={roadmap.image} 
              alt={roadmap.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{roadmap.title}</h3>
              <p className="text-gray-600 mb-4">{roadmap.description}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Thời gian</p>
                  <p className="font-medium">{roadmap.duration}</p>
                </div>
                <div>
                  <p className="text-gray-500">Trình độ</p>
                  <p className="font-medium">{roadmap.level}</p>
                </div>
                <div>
                  <p className="text-gray-500">Số khóa học</p>
                  <p className="font-medium">{roadmap.courses} khóa</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}