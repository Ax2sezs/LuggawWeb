import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, CheckCircle, Check, Phone } from "lucide-react";
import UserProfile from "./components/UserProfile";
import HomePage from "./components/HomePage";
import RewardList from "./components/RewardList";
import RedeemedRewardsTabs from "./components/RedeemedRewardsTabs";
import TransactionList from "./components/TransactionList";
import EditPhoneModal from "./components/Modals/EditPhoneModal";
import toast from "react-hot-toast";

const tabs = [
  { key: "home", label: "Home", icon: <Gift className="w-4 h-4 mr-1" /> },
  { key: "reward", label: "Rewards", icon: <Gift className="w-4 h-4 mr-1" /> },
  { key: "redeemed", label: "Redeemed", icon: <CheckCircle className="w-4 h-4 mr-1" /> },
];

export default function MainAppLayout({ user, logout, fetchPoints, points, expire, pointLastYear, expireLastYear, fetchUpdatePhoneNumber }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [activeView, setActiveView] = useState("home");
  const activeIndex = tabs.findIndex((tab) => tab.key === activeView);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  console.log("Render MainAppLayout points:", points);

  const handleLogout = () => {
    // ล้าง token หรือข้อมูล session ถ้าต้องการเพิ่มเติม
    logout();
  };

  const renderContent = () => {
    switch (activeView) {
      case "home":
        return <HomePage />;
      case "reward":
        return <RewardList reloadPoints={fetchPoints} points={points} />;
      case "redeemed":
        return <RedeemedRewardsTabs />;
      case "transaction":
        return <TransactionList phoneNumber={user.phoneNumber} />;
      default:
        return null;
    }
  };

  const handleSavePhone = async (oldPhone, newPhone) => {
    try {
      await fetchUpdatePhoneNumber(oldPhone, newPhone);
      setShowEditModal(false);
    } catch (error) {
      console.error("เปลี่ยนเบอร์ไม่สำเร็จ", error);
      toast.error("เกิดข้อผิดพลาด : เบอร์นี้ถูกใช้งานแล้ว");
    }
  };


  return (
    <div
      className={`shadow-lg w-full text-center min-h-screen flex flex-col ${activeView === "home" ? "bg-white" : "bg-sub-brown"
        }`}
    >
      <UserProfile
        user={user}
        points={points}
        expire={expire}
        pointLastYear={pointLastYear}
        expireLastYear={expireLastYear}
        onLogout={logout}
        onShowTransactions={() => setActiveView("transaction")}
        onUpdatePhoneNumberTrigger={() => setShowEditModal(true)} // ✅ แก้ตรงนี้
        onShowProfile={() => set}
      />
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
      <EditPhoneModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        initialPhone={user.phoneNumber}
        onSave={(newPhone) => handleSavePhone(user.phoneNumber, newPhone)}
      />
      {showSuccessModal && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30`}
          initial={false}
          animate={{ opacity: showSuccessModal ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="modal-box max-w-sm bg-gradient-to-br from-white to-gray-50 rounded-3xl text-center shadow-2xl border-2 border-green-100 relative overflow-hidden"
            style={{
              opacity: showSuccessModal ? 1 : 0,
              transform: showSuccessModal ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(50px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20"></div>

            <div className="relative z-10 mb-6">
              <div className="bg-white border-2 border-main-green w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Phone className="w-10 h-10 text-main-green" /> {/* ใช้ Check icon แทน loading.gif */}
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">เปลี่ยนเบอร์โทรเรียบร้อยแล้ว!</h2>
              <p className="text-gray-500 text-sm">กรุณาเข้าสู่ระบบใหม่อีกครั้ง</p>
            </div>

            <div className="relative z-10 my-6">
              <div className="flex items-center justify-center">
                <div className="flex-1 border-t-2 border-dashed border-main-orange"></div>
                <div className="mx-4 w-12 h-12 flex justify-center items-center">
                  <Check className="w-full h-full text-main-green" />
                </div>
                <div className="flex-1 border-t-2 border-dashed border-main-orange"></div>
              </div>
            </div>

            <div className="relative z-10">
              <button
                className="btn btn-lg bg-main-green text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                onClick={handleLogout}
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
