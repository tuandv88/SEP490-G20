import React from 'react';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';

export function MyPosts() {
  const posts = [
    {
      id: 1,
      title: 'Kinh nghiệm học Kubernetes',
      excerpt: 'Chia sẻ một số kinh nghiệm khi học và làm việc với Kubernetes...',
      date: '2024-03-15',
      comments: 5,
      likes: 12,
      views: 234
    },
    {
      id: 2,
      title: 'Tips và tricks khi làm việc với ReactJS',
      excerpt: 'Tổng hợp các mẹo hay khi làm việc với ReactJS mà tôi học được...',
      date: '2024-03-10',
      comments: 8,
      likes: 20,
      views: 456
    }
  ];

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bài viết của tôi</h2>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          Tạo bài viết mới
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold hover:text-red-500 cursor-pointer">
              {post.title}
            </h3>
            <p className="text-gray-600 mt-2">{post.excerpt}</p>
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
              <div className="flex items-center space-x-6">
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {post.comments}
                </span>
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {post.likes}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {post.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}