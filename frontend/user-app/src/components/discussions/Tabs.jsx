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
          const activeCategories = data.categoryDtos.filter((category) => category.isActive);
          setTabs(activeCategories);

          if (!categoryId && activeCategories.length > 0) {
            onCategoryChange(activeCategories[0].id);
          }
        }
      } catch (err) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryId, onCategoryChange]);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${categoryId === tab.id ? "active" : ""}`}
          onClick={() => onCategoryChange(tab.id)}
        >
          {tab.name}
        </button>
      ))}

      {/* CSS */}
      <style jsx>{`
        .tabs {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .tab-button {
          padding: 10px 20px;
          font-size: 16px;
          font-family: "Georgia", "Times New Roman", serif;
          color: #555;
          border: none;
          background: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: color 0.3s, border-bottom 0.3s;
        }

        .tab-button:hover {
          color: #007bff;
        }

        .tab-button.active {
          color: #007bff;
          font-weight: bold;
          border-bottom: 2px solid #007bff;
        }
      `}</style>
    </div>
  );
}

export default Tabs;
