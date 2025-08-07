import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

export default function OtpScreen({
    profileForm,
    fetchVerifyOtp,
    refCode,
    token,
    onOtpVerified,
    otpVerified,
    isOpen,    // ควบคุมเปิด/ปิด จาก parent
    onClose,   // callback ปิด modal
}) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);  // เริ่มที่ 0
    const [message, setMessage] = useState(false)
    const [error, setError] = useState("")
    const dialogRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
            setOtp("");
            setCooldown(0);  // เปิด modal ยังไม่เริ่มนับ cooldown
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            toast.error("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
            return;
        }
        setLoading(true);
        try {
            const success = await fetchVerifyOtp(otp, refCode, token);
            if (success) {
                onOtpVerified();
                setMessage(true)
                setCooldown(30);  // เริ่มนับ cooldown 30 วิ หลังจากยืนยันสำเร็จ
            } else {
                setError("OTP ไม่ถูกต้อง");
            }
        } catch {
            setError("OTP ไม่ถูกต้องหรือหมดอายุ");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <dialog
            id="otp-modal"
            className="modal"
            ref={dialogRef}
            onCancel={handleClose}
            onClose={handleClose}
        >
            <form method="dialog" className="modal-box bg-bg text-gray-800 rounded-3xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4 text-center">ยืนยันรหัส OTP</h2>

                {message ? (
                    <div className="">
                        <Loading />
                        <p className="text-green-600 text-center font-semibold">
                            ยืนยัน OTP สำเร็จ! กรุณารอซักครู่ . .
                        </p>

                    </div>
                ) : (
                    <>
                        <input
                            type="text"
                            maxLength={6}
                            className="w-full border border-main-green rounded-2xl px-3 py-2 text-center text-lg mb-4"
                            placeholder="กรอกรหัส OTP 6 หลัก"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        />
                        <div className="">
                            {error}
                        </div>
                        <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={loading || cooldown > 0}
                            className={`w-full py-2 rounded font-semibold mb-2 ${loading || cooldown > 0
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-main-green text-white"
                                }`}
                        >
                            {cooldown > 0 ? `รออีก ${cooldown} วิ` : loading ? "กำลังตรวจสอบ..." : "ยืนยัน"}
                        </button>
                    </>
                )}

                <div className="modal-action absolute -top-3 right-3">
                    <button className="bg-black/20 rounded-full w-8 h-8" type="button" onClick={handleClose}>
                        X
                    </button>
                </div>
            </form>
        </dialog>
    );
}
