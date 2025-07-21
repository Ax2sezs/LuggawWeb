import React, { useState } from "react";
import RedeemedRewardList from "./RedeemedRewardList";
import { AnimatePresence, motion } from "framer-motion";

const statuses = [
  { key: "unused", label: "ยังไม่ใช้" },
  { key: "used", label: "ใช้แล้ว" },
  { key: "expired", label: "หมดอายุ" },
];

export default function RedeemedRewardsTabs({ userId }) {
  const [activeStatus, setActiveStatus] = useState("unused");

  return (
    <div className="p-5 w-full mx-auto">
      {/* Tabs Container */}
      <div className="relative inline-flex bg-gray-100 rounded-full p-1 mx-auto mb-6 justify-center">
        {statuses.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveStatus(key)}
            className={`relative z-0 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeStatus === key
                ? "text-white"
                : "text-gray-600 hover:text-main-green"
            }`}
          >
            {label}
            {activeStatus === key && (
              <motion.div
                layoutId="pill-tab"
                className="absolute inset-0 bg-main-green rounded-full z-[-1]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <RedeemedRewardList userId={userId} status={activeStatus} />
    </div>
  );
}
