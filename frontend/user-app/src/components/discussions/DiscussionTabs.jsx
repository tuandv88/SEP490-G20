import React, { useEffect, useState } from "react";
import { DiscussApi } from "@/services/api/DiscussApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faComments,
  faCodeBranch,
  faLightbulb,
  faUsers,
  faCommentDots,
  faExclamationTriangle,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

function DiscussionTabs({ onCategoryChange, categoryId }) {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getIconForCategory = (categoryName) => {
    const lowerCaseName = categoryName.toLowerCase();
    if (lowerCaseName.includes('general')) return faComments;
    if (lowerCaseName.includes('programming') || lowerCaseName.includes('code')) return faCodeBranch;
    if (lowerCaseName.includes('ideas') || lowerCaseName.includes('innovation')) return faLightbulb;
    if (lowerCaseName.includes('community') || lowerCaseName.includes('social')) return faUsers;
    return faCommentDots; // default icon
  };

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
        setError("Failed to fetch discussion topics");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryId, onCategoryChange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 bg-white rounded-lg shadow-md">
        <FontAwesomeIcon icon={faSpinner} spin className="text-[#0a192f] text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-6" role="alert">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3 text-xl" />
            <p className="text-lg">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 text-xl">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap justify-center gap-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              flex items-center justify-center px-6 py-2 rounded-md transition-all duration-200 
              text-sm font-medium shadow-md hover:shadow-lg
              ${categoryId === tab.id
                ? "bg-[#0a192f] text-white hover:bg-[#112240]"
                : "bg-white text-[#0a192f] hover:bg-gray-200"
              }
              w-40 h-20
            `}
            onClick={() => onCategoryChange(tab.id)}
          >
            <FontAwesomeIcon
              icon={getIconForCategory(tab.name)}
              className={`mr-2 text-lg ${categoryId === tab.id ? 'text-white' : 'text-[#0a192f]'}`}
            />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DiscussionTabs;

