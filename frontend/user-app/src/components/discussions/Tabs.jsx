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

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
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
          justify-content: space-evenly;
          padding: 22px;
          border-radius: 8px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          background: #f9f9f9;
        }

        .tab-button {
          flex: 1;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 150px;
          min-width: 120px;
          padding: 20px;
          font-size: 14px;
          font-family: "Helvetica Neue", Arial, sans-serif;
          font-weight: 500;
          color: #1e334a;
          border: 1px solid #e0e0e0;
          background: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          position: relative;
          overflow: hidden;
        }

        .tab-button:hover {
          color: #14212b;
          background: rgba(30, 51, 74, 0.1);
          border-color: #b0b0b0;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .tab-button.active {
          color: #ffffff;
          background: linear-gradient(45deg, #374151, #1e334a);
          font-weight: bold;
          border-color: #374151;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
          transform: scale(1.05);
        }

        .tab-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -50%;
          width: 200%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          transform: skewX(-45deg);
          transition: left 0.3s ease-in-out;
        }

        .tab-button:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
}

export default Tabs;
