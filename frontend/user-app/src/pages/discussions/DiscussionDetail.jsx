import React from "react";
import { useParams } from "react-router-dom";

function DiscussionDetail() {
  const { id } = useParams(); // Lấy ID từ URL
  // Ở đây bạn có thể dùng ID này để lấy dữ liệu bài viết từ API hoặc dữ liệu mẫu
  
  // Ví dụ với dữ liệu mẫu:
  const post = {
    id: id,
    title: "Google Online Assessment Questions",
    user: "Sithis",
    views: "813.3K",
    lastUpdated: "February 6, 2021 5:46 AM",
    country: "US/EU",
    questions: [
      "Min Amplitude [New Grad]",
      "Ways to Split String [New Grad]",
      "Maximum Time ⭐⭐⭐ [Intern]",
      "Min Abs Difference of Server Loads ⭐ [Intern]",
      "Most Booked Hotel Room ⭐⭐⭐ [Intern]",
      "Minimum Domino Rotations For Equal Row [New Grad]",
      "Time to Type a String",
      "Maximum Level Sum of a Binary Tree",
      "Min Number of Chairs",
      "K Closest Points to Origin",
      "Odd Even Jump",
      "License Key Formatting",
      "Unique Email Addresses",
      "Fruit Into Baskets",
      "Min Days to Bloom",
      "Fill Matrix",
      "Decreasing Subsequences",
      "Max Distance",
      "Stores and Houses"
    ]
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
          <div className="text-sm text-gray-600">
            <span>Views: {post.views} | Last Edited: {post.lastUpdated}</span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-gray-700">Country: {post.country}</h4>
        </div>
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800">Questions:</h3>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            {post.questions.map((question, index) => (
              <li key={index} className="mt-2">
                {question}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DiscussionDetail;
