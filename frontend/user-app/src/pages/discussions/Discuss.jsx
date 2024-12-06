import React, { useState, useEffect } from "react";
import DiscussionTabs from "../../components/discussions/DiscussionTabs";
import PostList from "../../components/discussions/PostList";
import Layout from "@/layouts/layout";
import { DiscussApi } from "@/services/api/DiscussApi";
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import Stack from '@mui/material/Stack';

const Discuss = () => {
  const [categoryId, setCategoryId] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const location = useLocation();
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
        setErrorCategories("Failed to fetch categories");
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
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showRemoveSuccessAlert]);

  return (
    <Layout>
      {showRemoveSuccessAlert && (
        <div className="fixed top-2 right-2 w-auto max-w-sm z-50 bg-red-100 p-2 rounded-lg shadow-lg">
          <Alert variant="destructive">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Discussion removed successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="bg-gray-100 min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Increased max-width and added padding */}
          {loadingCategories ? (
            <div className="flex justify-center items-center h-15">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

