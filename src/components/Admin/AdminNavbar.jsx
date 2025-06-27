import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("admin_token"); // ลบ token
        navigate("/admin-login"); // กลับหน้า admin login
    };
    return (
        <nav className="bg-main-green text-white px-6 py-4 flex space-x-6">

            <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                    isActive ? "font-bold border-b-2 border-white" : "hover:text-gray-300"
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                    isActive ? "font-bold border-b-2 border-white" : "hover:text-gray-300"
                }
            >
                Users
            </NavLink>
            <NavLink
                to="/admin/reward"
                className={({ isActive }) =>
                    isActive ? "font-bold border-b-2 border-white" : "hover:text-gray-300"
                }
            >
                Reward
            </NavLink>
            <NavLink
                to="/admin/feed"
                className={({ isActive }) =>
                    isActive ? "font-bold border-b-2 border-white" : "hover:text-gray-300"
                }
            >
                Feed
            </NavLink>
            <NavLink
                to="/admin/transactions"
                className={({ isActive }) =>
                    isActive ? "font-bold border-b-2 border-white" : "hover:text-gray-300"
                }
            >
                Transaction
            </NavLink>

            <button
                onClick={handleLogout}
                className="ml-auto btn btn-sm bg-main-orange text-black hover:bg-sub-brown transition"
                title="Logout"
            >
                <LogOut size={18}/>LOGOUT
            </button>

        </nav>
    );
}
