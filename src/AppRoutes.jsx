import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import HomePage from "./components/HomePage";
import RewardList from "./components/RewardList";
import RedeemedRewardList from "./components/RedeemedRewardList";
import TransactionList from "./components/TransactionList";

// Wrapper สำหรับ animation หน้าต่าง ๆ
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

export default function AppRoutes({ user, fetchPoints, points }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/reward"
          element={
            <PageWrapper>
              <RewardList reloadPoints={fetchPoints} />
            </PageWrapper>
          }
        />
        <Route
          path="/redeemed"
          element={
            <PageWrapper>
              <RedeemedRewardList userId={user.userId} />
            </PageWrapper>
          }
        />
        <Route
          path="/transaction"
          element={
            <PageWrapper>
              <TransactionList phoneNumber={user.phoneNumber} />
            </PageWrapper>
          }
        />

        {/* กรณี path ไม่ตรง ให้ redirect ไปหน้า Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
