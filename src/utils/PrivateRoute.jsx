import { Navigate, useLocation } from "react-router-dom";
import useLineAuth from "../hooks/useLineAuth";

export default function PrivateRoute({ children }) {
  const { user, isProfileCompleted, isLoading } = useLineAuth();
  const location = useLocation();

  const isOnCompleteProfilePage = location.pathname === "/complete-profile";

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isProfileCompleted && !isOnCompleteProfilePage) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}
