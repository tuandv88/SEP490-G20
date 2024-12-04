import React, { useState, useEffect } from "react";
import Navbar from "../../components/discussions/Navbar";
import Tabs from "../../components/discussions/Tabs";
import PostList from "../../components/discussions/PostList";
import Layout from "@/layouts/layout";
import { DiscussApi } from "@/services/api/DiscussApi";
import { useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const Discuss = () => {
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const location = useLocation();
  const { removeDiscussionStateMessage } = location.state || {};  // Lấy thông báo thành công nếu có

  // Trạng thái để kiểm tra khi hiển thị thông báo
  const [showRemoveSuccesAlert, setShowRemoveSuccesAlert] = useState(removeDiscussionStateMessage);


  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
  };

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
  }, []);

  useEffect(() => {
    // Hiển thị thông báo thành công sau khi xóa
    if (showRemoveSuccesAlert) {
      const timerShowRemoveSucces = setTimeout(() => {
        setShowRemoveSuccesAlert(false);  // Ẩn thông báo sau 5 giây
      }, 5000);

      // Dọn dẹp timer khi component unmount hoặc trạng thái thay đổi
      return () => clearTimeout(timerShowRemoveSucces);
    }
  }, [showRemoveSuccesAlert]);  // Chỉ phụ thuộc vào showRemoveSuccesAlert

  return (
    <Layout>

      {/* Hiển thị thông báo khi post thành công */}
      {showRemoveSuccesAlert && (
        <Stack
          sx={{
            position: 'fixed',
            top: 20, // Đặt cách từ đầu trang một chút
            left: '50%', // Căn giữa theo chiều ngang
            transform: 'translateX(-50%)', // Đảm bảo căn giữa tuyệt đối
            zIndex: 9999, // Đảm bảo thông báo hiển thị trên tất cả các phần tử khác
            width: 'auto', // Giới hạn chiều rộng thông báo
            maxWidth: '500px', // Giới hạn chiều rộng tối đa cho thông báo
          }}
        >
          <Alert severity="error">
            Remove Discussion Successfully!
          </Alert>
        </Stack>
      )}

      <div className="discuss-container">
        {/* Hiển thị khi đang tải categories hoặc có lỗi */}
        {loadingCategories && <p>Loading categories...</p>}
        {errorCategories && <p style={{ color: "red" }}>{errorCategories}</p>}

        {!loadingCategories && !errorCategories && (
          <>
            <Navbar />
            <div className="tabs-container">
              <Tabs onCategoryChange={handleCategoryChange} categoryId={categoryId} categories={categories} />
            </div>
            <div className="content-container">
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
            padding: 15px;
            font-family: "Helvetica Neue", Arial, sans-serif;
            background-color: #f9f9f9;
            min-height: 100vh;
          }

          .tabs-container {
            width: 100%;
            max-width: 1200px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Đồng bộ đổ bóng */
          }

          .content-container {
            width: 100%;
            max-width: 1200px;
            margin-top: 2px;
            padding: 0;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }

          .create-button-container {
            margin-top: 20px;
            text-align: right; /* Đưa nút về phía bên phải */
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
            transition: background-color 0.3s ease-in-out;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Nhấn nhẹ nút */
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
