import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Loader2 } from "lucide-react";

import useLineAuth from "./hooks/useLineAuth";
import useAdminLogin from "./hooks/useAdminLogin";

import LoginScreen from "./pages/LoginScreen";
import ProfileFormScreen from "./pages/ProfileFormScreen";
import MainAppLayout from "./MainLayout";

import AdminUsers from "./components/Admin/AdminUsers";
import AdminHome from "./components/Admin/AdminHome";
import AdminReward from "./components/Admin/AdminReward";
import AdminLayout from "./components/Admin/AdminLayout";
import RewardManagement from "./components/Admin/RewardManagement";
import CreateRewardForm from "./components/Admin/CreateRewardForm";
import AdminFeedManage from "./components/Admin/AdminFeedManage";
import CreateFeedForm from "./components/Admin/CreateFeedForm";
import AdminTransaction from "./components/Admin/AdminTransaction";

import CallbackHandler from "./components/CallbackHandler";

import { clearAuthData } from "./utils/auth";
import AdminLogin from "./components/Admin/AdminLogin";

function ProtectedAdminRoute() {
  const { adminUser, loading } = useAdminLogin();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default function App() {
  const {
    user,
    error,
    isProfileCompleted,
    setUser,
    logout,
    setError,
    fetchPoints,
    isLoading,
    points,
    expire,
  } = useLineAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔒 ล้าง localStorage ทุก 30 นาที");
      clearAuthData();
      window.location.href = "/"; // redirect ไปหน้า login
    }, 30 * 60 * 1000); // 30 นาที

    return () => clearInterval(interval); // เคลียร์เมื่อ component unmount
  }, []);

  useEffect(() => {
    console.log("isProfileCompleted", isProfileCompleted);
  }, [isProfileCompleted]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Router>
        <Routes>
          {/* หน้าแรก */}
          <Route
            path="/"
            element={
              !user ? (
                <LoginScreen setError={setError} />
              ) : isProfileCompleted === null ? (
                <div className="flex items-center justify-center min-h-screen text-gray-600">
                  <Loader2 className="animate-spin w-6 h-6 mr-2" />
                  กำลังโหลดข้อมูล...
                </div>
              ) : isProfileCompleted ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/complete-profile" replace />
              )
            }
          />

          <Route
            path="/complete-profile"
            element={
              !user ? (
                <Navigate to="/" replace />
              ) : isProfileCompleted === false ? (
                <ProfileFormScreen user={user} setUser={setUser} />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />

          {/* หน้า callback LINE */}
          <Route path="/callback" element={<CallbackHandler />} />

          {/* หน้า home */}
          <Route
            path="/home"
            element={
              !user ? (
                <Navigate to="/" replace />
              ) : isProfileCompleted === false ? (
                <Navigate to="/complete-profile" replace />
              ) : (
                <MainAppLayout
                  user={user}
                  logout={logout}
                  fetchPoints={fetchPoints}
                  points={points}
                  expire={expire}
                />
              )
            }
          />

          {/* หน้า inactive */}
          <Route path="/inactive" element={<div>บัญชีคุณยังไม่เปิดใช้งาน</div>} />

          {/* หน้า admin login (แยก) */}
          <Route path="/admin/login" element={<AdminLogin isLoginPage={true} />} />

          {/* หน้า admin protected */}
          <Route path="/admin/*" element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reward" element={<AdminReward />} />
              <Route path="reward/edit/:rewardId" element={<RewardManagement />} />
              <Route path="reward/create" element={<CreateRewardForm />} />
              <Route path="feed" element={<AdminFeedManage />} />
              <Route path="feed/create" element={<CreateFeedForm />} />
              <Route path="feed/edit/:feedId" element={<CreateFeedForm />} />
              <Route path="transactions" element={<AdminTransaction />} />
            </Route>
          </Route>

          {/* fallback หน้าอื่นๆ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}
