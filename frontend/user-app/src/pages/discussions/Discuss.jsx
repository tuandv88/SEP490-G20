import React, { useState, useEffect } from "react";
import Navbar from "../../components/discussions/Navbar";
import Tabs from "../../components/discussions/Tabs";
import PostList from "../../components/discussions/PostList";
import Layout from "@/layouts/layout";
import { DiscussApi } from "@/services/api/DiscussApi"; // Import DiscussApi

const Discuss = () => {
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
  };

  // Lấy danh sách categories trước khi gọi PostList
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const data = await DiscussApi.getCategories();
        setCategories(data); // Lưu danh sách categories vào state
        if (data && data.length > 0) {
          setCategoryId(data[0].id); // Chọn categoryId mặc định là category đầu tiên
        }
      } catch (error) {
        setErrorCategories("Failed to fetch categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Chạy một lần khi component mount

  return (
    <Layout>
      <div className="discuss-container">
        {/* Hiển thị khi đang tải categories hoặc có lỗi */}
        {loadingCategories && <p>Loading categories...</p>}
        {errorCategories && <p style={{ color: "red" }}>{errorCategories}</p>}

        {/* Hiển thị các phần tử khi categories đã có */}
        {!loadingCategories && !errorCategories && (
          <>
            <Navbar />
            <div className="tabs-container">
              <Tabs onCategoryChange={handleCategoryChange} categoryId={categoryId} categories={categories} />
            </div>
            <div className="content-container">
              {/* Hiển thị PostList khi có categoryId */}
              {categoryId && <PostList categoryId={categoryId} />}
            </div>
          </>
        )}

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
            max-width: 1200px;
            margin: 20px 0;
            padding: 10px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }

          .content-container {
            width: 100%;
            max-width: 1200px;
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
              max-width: 90%;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default Discuss;
