import React, { useState } from "react";
import Navbar from "../../components/discussions/Navbar";
import Tabs from "../../components/discussions/Tabs";
import PostList from "../../components/discussions/PostList";

const Discuss = () => {
  const [categoryId, setCategoryId] = useState(null); // Lưu categoryId trong state của component cha

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId); // Cập nhật categoryId khi người dùng chọn tab mới
  };

  return (
    <div className="discuss-container">
      <Navbar />
      <div className="tabs-container">
        <Tabs onCategoryChange={handleCategoryChange} categoryId={categoryId} />
      </div>
      <div className="content-container">
        <div className="post-list-wrapper">
          <PostList categoryId={categoryId} />
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .discuss-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          font-family: Arial, sans-serif;
        }

        .tabs-container {
          width: 100%;
          max-width: 800px;
        }

        .content-container {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .post-list-wrapper {
          width: 100%;
          max-width: 800px;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Discuss;
