// // UserRoutes.jsx
// import React from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import LoginScreen from "./pages/LoginScreen";
// import ProfileFormScreen from "./pages/ProfileFormScreen";
// import MainAppLayout from "./MainLayout";
// import CallbackHandler from "./components/CallbackHandler";

// export default function UserRoutes({ user, isProfileCompleted, setUser, setError, logout, fetchPoints, points }) {
//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={
//           !user ? (
//             <LoginScreen setError={setError} />
//           ) : isProfileCompleted === null ? (
//             <div className="flex items-center justify-center min-h-screen text-gray-600">
//               <span className="loading loading-spinner" />
//               กำลังโหลดข้อมูล...
//             </div>
//           ) : isProfileCompleted ? (
//             <Navigate to="/home" replace />
//           ) : (
//             <Navigate to="/complete-profile" replace />
//           )
//         }
//       />

//       <Route
//         path="/complete-profile"
//         element={
//           !user ? (
//             <Navigate to="/" replace />
//           ) : isProfileCompleted === false ? (
//             <ProfileFormScreen user={user} setUser={setUser} />
//           ) : (
//             <Navigate to="/home" replace />
//           )
//         }
//       />

//       <Route
//         path="/home"
//         element={
//           !user ? (
//             <Navigate to="/" replace />
//           ) : isProfileCompleted === false ? (
//             <Navigate to="/complete-profile" replace />
//           ) : (
//             <MainAppLayout user={user} logout={logout} fetchPoints={fetchPoints} points={points} />
//           )
//         }
//       />

//       <Route path="/inactive" element={<div>บัญชีคุณยังไม่เปิดใช้งาน</div>} />
//       <Route path="/callback" element={<CallbackHandler />} />
//     </Routes>
//   );
// }
