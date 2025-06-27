import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import useAdmin from "../../hooks/useAdmin";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { loginAdmin } = useAdmin();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginAdmin(username, password);
            localStorage.setItem("admin_token", res.token);
            toast.success("เข้าสู่ระบบสำเร็จ!");
            navigate("/admin");
        } catch (error) {
            toast.error(error?.response?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } finally {
            setLoading(false);
        }
    };
   
    return (
        <div className="min-h-screen bg-grid-pattern bg-sub-brown flex items-center justify-center px-4 text-black">
            <div className="card w-full max-w-md shadow-xl bg-white rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label" htmlFor="username">
                            <User className="w-5 h-5 text-gray-400 mr-2" />

                            <span className="label-text">Username</span>
                        </label>
                        <div className="input-group">
                            <input
                                id="username"
                                type="text"
                                placeholder="LGADMIN-1"
                                className="input input-bordered w-full bg-white border border-black"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label" htmlFor="password">
                            <Lock className="w-5 h-5 text-gray-400 mr-2" />

                            <span className="label-text">Password</span>
                        </label>
                        <div className="input-group">
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••••••••••"
                                className="input input-bordered w-full bg-white border border-black"
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
                        className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                    >
                        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>
                </form>
            </div>
        </div>
    );
}
