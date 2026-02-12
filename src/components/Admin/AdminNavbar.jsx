import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAdminLogin from "../../hooks/useAdminLogin";
import { useAdminAuth } from "../../utils/AdminAuthContext";

export default function AdminNavbar() {
    const navigate = useNavigate();
    const { logout, adminUser } = useAdminAuth();
    const role = adminUser?.role;

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
            {role === 'SuperAdmin' && (
                <>
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
                </>
            )}

            <NavLink
                to="/admin/rwtransactions"
                className={({ isActive }) =>
                    isActive ? "font-bold border-b-2 border-white" : "hover:text-gray-300"
                }
            >
                Reward Transaction
            </NavLink>

            <button
                onClick={logout}
                className="ml-auto btn btn-sm bg-main-orange text-black hover:bg-sub-brown transition"
                title="Logout"
            >
                <LogOut size={18} />LOGOUT
            </button>

        </nav>
    );
}
