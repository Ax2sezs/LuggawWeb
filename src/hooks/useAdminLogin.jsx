import { useState } from "react";
import * as api from '../api/adminAPI';

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
            // api.loginAdmin return res.data ที่มี token, userId, username, fullName
            const data = await api.loginAdmin({ username, password });

            setToken(data.token);
            // เก็บข้อมูล user ที่ได้จาก API ทั้งหมดเลย
            setAdminUser({
                userId: data.userId,
                username: data.username,
                fullName: data.fullName,
            });

            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("admin_user", JSON.stringify({
                userId: data.userId,
                username: data.username,
                fullName: data.fullName,
            }));
            return data; // <-- เพิ่ม return ตรงนี้

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
