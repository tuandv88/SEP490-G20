import React, { useState } from "react";
import Navbar from "../../components/discussions/Navbar";
import Tabs from "../../components/discussions/Tabs";
import PostList from "../../components/discussions/PostList";
import Layout from "@/layouts/layout";

const Discuss = () => {
  const [categoryId, setCategoryId] = useState(null);

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
  };

  return (
    <Layout>
      <div className="discuss-container">
        <Navbar />
        <div className="tabs-container">
          <Tabs onCategoryChange={handleCategoryChange} categoryId={categoryId} />
        </div>
        <div className="content-container">
          <PostList categoryId={categoryId} />
        </div>

        {/* CSS */}
        <style jsx>{`
          .discuss-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            font-family: "Georgia", "Times New Roman", serif;
            background-color: #f9f9f9;
            min-height: 100vh;
          }

          .tabs-container {
            width: 100%;
            max-width: 1200px; /* Increased max-width */
            margin: 20px 0;
            padding: 10px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }

          .content-container {
            width: 100%;
            max-width: 1200px; /* Increased max-width */
            margin-top: 20px;
          }

          .create-button-container {
            margin-top: 20px;
          }

          .create-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
          }

          .create-button:hover {
            background-color: #0056b3;
          }

          @media (max-width: 768px) {
            .tabs-container,
            .content-container {
              max-width: 90%; /* Keep responsiveness on smaller screens */
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Discuss;
