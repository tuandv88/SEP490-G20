import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DiscussionTabs from "../../components/discussions/DiscussionTabs";
import PostList from "../../components/discussions/PostList";
import Layout from "@/layouts/layout";
import { DiscussApi } from "@/services/api/DiscussApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import Stack from '@mui/material/Stack';
import AlertRemovePost from '@mui/material/Alert';

const Discuss = () => {
  const [categoryId, setCategoryId] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { removeDiscussionStateMessage } = location.state || {};

  const [showRemoveSuccessAlert, setShowRemoveSuccessAlert] = useState(!!removeDiscussionStateMessage);

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const data = await DiscussApi.getCategories();
        if (data && data.categoryDtos && data.categoryDtos.length > 0) {
          setCategoryId(data.categoryDtos[0].id);
        }
      } catch (error) {
        //setErrorCategories("Failed to fetch categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (showRemoveSuccessAlert) {
      const timer = setTimeout(() => {
        setShowRemoveSuccessAlert(false);
        // Xóa trạng thái location.state sau khi sử dụng
        navigate(location.pathname, { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showRemoveSuccessAlert, navigate, location.pathname]);

  return (
    <Layout>
      {showRemoveSuccessAlert && (
        <AlertRemovePost
          severity="error"
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 text-red-800 border border-red-300 max-w-sm w-auto p-4 rounded-lg shadow-lg"
        >
          Remove Post Success!
        </AlertRemovePost>
      )}

      <div className="bg-gray-100 min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Increased max-width and added padding */}
          {loadingCategories ? (
            <div className="flex justify-center items-center h-15">
              <Loader2 className="h-8 w-8 animate-spin text-[#32679b]" />
            </div>
          ) : errorCategories ? (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorCategories}</AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <div className="w-full">
                <DiscussionTabs onCategoryChange={handleCategoryChange} categoryId={categoryId} />
                {categoryId && <PostList categoryId={categoryId} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Discuss;

