import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, CheckCircle } from "lucide-react";
import UserProfile from "./components/UserProfile";
import HomePage from "./components/HomePage";
import RewardList from "./components/RewardList";
import RedeemedRewardsTabs from "./components/RedeemedRewardsTabs";
import TransactionList from "./components/TransactionList";

const tabs = [
  { key: "home", label: "Home", icon: <Gift className="w-4 h-4 mr-1" /> },
  { key: "reward", label: "Rewards", icon: <Gift className="w-4 h-4 mr-1" /> },
  { key: "redeemed", label: "Redeemed", icon: <CheckCircle className="w-4 h-4 mr-1" /> },
];

export default function MainAppLayout({ user, logout, fetchPoints, points }) {
  const [activeView, setActiveView] = useState("home");
  const activeIndex = tabs.findIndex((tab) => tab.key === activeView);

  const renderContent = () => {
    switch (activeView) {
      case "home":
        return <HomePage />;
      case "reward":
        return <RewardList reloadPoints={fetchPoints} />;
      case "redeemed":
        return <RedeemedRewardsTabs userId={user.userId} />;
      case "transaction":
        return <TransactionList phoneNumber={user.phoneNumber} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`shadow-lg w-full text-center min-h-screen flex flex-col ${activeView === "home" ? "bg-white" : "bg-sub-brown"
        }`}
    >
      <UserProfile user={user} points={points} onLogout={logout} onShowTransactions={() => setActiveView("transaction")} />

      <div className="flex-1 overflow-auto mb-12 -mt-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.1 }}
            className=""
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 rounded-t-lg shadow-inner p-1 mx-2 mb-2 flex items-center justify-center z-50">
        {activeIndex !== -1 && (
          <motion.div
            className="absolute top-1 left-1 bottom-1 w-1/3 bg-main-green rounded-full shadow z-0"
            style={{
              transform: `translateX(${activeIndex * 100}%)`,
              transition: "transform 0.3s ease",
            }}
          />
        )}
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            className={`relative z-10 flex items-center justify-center flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200
              ${tab.key === activeView ? "text-white" : "text-gray-700 hover:bg-white"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
