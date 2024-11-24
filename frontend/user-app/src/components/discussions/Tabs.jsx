import React, { useState } from "react";

function Tabs() {
  const [activeTab, setActiveTab] = useState("All Interview Questions");

  const tabs = [
    "All Interview Questions",
    "System Design",
    "Operating System",
    "Object-Oriented Design",
  ];

  return (
    <div className="flex space-x-4 border-b-2 border-gray-300 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${
            activeTab === tab
              ? "text-blue-500 font-bold border-b-2 border-blue-500"
              : "text-gray-500"
          } text-lg py-2 px-4 cursor-pointer`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
