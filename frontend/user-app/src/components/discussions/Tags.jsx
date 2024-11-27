import React from "react";

function Tags() {
  const tags = ["google", "amazon", "facebook", "online assessment", "interview", "system design"];

  return (
    <div className="mt-6">
      <h6 className="font-semibold text-lg mb-4">Tags</h6>
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-block bg-gray-100 text-gray-800 px-4 py-2 mr-3 mb-3 rounded-full cursor-pointer hover:bg-blue-500 hover:text-white transition duration-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default Tags;
