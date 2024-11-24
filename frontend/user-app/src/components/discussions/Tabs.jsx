import React, { useEffect, useState } from "react";
import { DiscussApi } from "@/services/api/DiscussApi";

function Tabs({ onCategoryChange, categoryId }) {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await DiscussApi.getCategories();
        if (data && data.categoryDtos) {
          const activeCategories = data.categoryDtos.filter(category => category.isActive);
          setTabs(activeCategories);
          
          // Nếu không có categoryId, chọn tab đầu tiên
          if (!categoryId && activeCategories.length > 0) {
            onCategoryChange(activeCategories[0].id);
          }
        }
      } catch (err) {
        setError("Failed to fetch categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryId, onCategoryChange]);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <div className="flex space-x-4 border-b-2 border-gray-300 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${
              categoryId === tab.id
                ? "text-blue-500 font-bold border-b-2 border-blue-500"
                : "text-gray-500"
            } text-lg py-2 px-4 cursor-pointer`}
            onClick={() => {
              onCategoryChange(tab.id); // Gửi categoryId khi người dùng chọn tab
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
