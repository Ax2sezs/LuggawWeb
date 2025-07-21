import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, User } from "lucide-react";
import toast from "react-hot-toast";
import useAdminLogin from "../../hooks/useAdminLogin";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login, loading } = useAdminLogin();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(username, password);
            toast.success("เข้าสู่ระบบสำเร็จ!");
            navigate("/admin");
        } catch (error) {
            toast.error(error?.response?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        }
    };

    return (
        <div className="w-screen h-screen flex">
            {/* ฝั่งซ้าย: รูปภาพ */}
            <div className="hidden md:block md:w-1/2 h-full">
                <img
                    src="/bannerlg.jpg"
                    alt="Admin Login Banner"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ฝั่งขวา: ฟอร์ม Login */}
            <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-grid-pattern p-6">
                <div className="min-w-lg bg-bg p-8 rounded-3xl shadow-2xl">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-center text-main-green">
                            <Shield className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">LUGGAW ADMIN</h3>
                        </div>
                    </div>

                    <div className="border-2 border-main-orange my-3 rounded-3xl" />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    className="text-main-green pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-main-orange"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="text-main-green pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-main-orange"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-main-green hover:bg-[#193619]"
                                }`}
                        >
                            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
