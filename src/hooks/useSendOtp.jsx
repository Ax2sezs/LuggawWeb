import { useState, useRef } from "react";
import { sendOtp, verifyOtp } from "../api/lineLoginAPI";

export const useSendOtp = () => {
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [otperror, setError] = useState(null);
    const [cooldown, setCooldown] = useState(0);

    // ✅ เก็บค่า token/refCode ปัจจุบันแบบไม่รอ state update
    const tokenRef = useRef(null);
    const refCodeRef = useRef(null);

    const fetchSendOtp = async (phoneNumber) => {
        setLoading(true);
        setError(null);
        try {
            const res = await sendOtp(phoneNumber);

            // ⏱ เริ่ม cooldown 180 วิ
            startCooldown(180);

            // ✅ เก็บใน ref เพื่อให้ทันใช้ทันที ไม่รอ render ใหม่
            refCodeRef.current = res.data.refCode;
            tokenRef.current = res.data.token;

            return res.data;
        } catch (err) {
            setError(err.response?.data || err.message || "Failed to send OTP");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchVerifyOtp = async (otp) => {
        setLoading(true);
        setError(null);
        try {
            const refCode = refCodeRef.current;
            const token = tokenRef.current;

            if (!refCode || !token) throw new Error("ข้อมูลอ้างอิงไม่ครบ");

            await verifyOtp({ refCode, token, otp });
            setVerified(true);
            return true;
        } catch (err) {
            setError(err.response?.data || err.message || "Invalid OTP");
            setVerified(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Cooldown function
    const startCooldown = (seconds) => {
        setCooldown(seconds);
        const interval = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return {
        fetchSendOtp,
        fetchVerifyOtp,
        verified,
        loading,
        otperror,
        cooldown,
    };
};
