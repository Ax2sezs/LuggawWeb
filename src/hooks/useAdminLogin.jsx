import { useState } from "react";
import * as api from '../api/adminAPI';
import { jwtDecode } from "jwt-decode";


export default function useAdminLogin() {
    const [adminUser, setAdminUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("admin_user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem("jwtToken") || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ฟังก์ชัน login
    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.loginAdmin({ username, password });

            const decoded = jwtDecode(data.token);

            const role =
                decoded.role ||
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            setToken(data.token);

            const userData = {
                userId: data.userId,
                username: data.username,
                fullName: data.fullName,
                role: role
            };

            setAdminUser(userData);

            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("admin_user", JSON.stringify(userData));

            return data;

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชัน logout
    const logout = () => {
        setToken(null);
        setAdminUser(null);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("admin_user");
        window.location.href = "/";

    };

    return {
        adminUser,
        token,
        loading,
        error,
        login,
        logout,
    };
}
