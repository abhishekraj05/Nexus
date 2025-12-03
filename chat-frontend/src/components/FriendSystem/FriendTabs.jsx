import React, { useState } from "react";

const FriendTabs = () => {
  const [activeTab, setActiveTab] = useState("friends");

  return (
    <div>
      <div className="tabs flex mb-2">
        <button
          className={activeTab === "friends" ? "tab-active" : "tab-inactive"}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
        <button
          className={activeTab === "requests" ? "tab-active" : "tab-inactive"}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "friends" && <p>Friend list here...</p>}
        {activeTab === "requests" && <p>Friend requests here...</p>}
      </div>
    </div>
  );
};

export default FriendTabs;
