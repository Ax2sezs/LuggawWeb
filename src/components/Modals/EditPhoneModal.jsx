import { useState, useEffect } from "react";
import { X, Phone, Check, Search, PersonStanding, User, Settings, Edit, MessageSquare } from "lucide-react";
import useLineAuth from "../../hooks/useLineAuth";
import { useSendOtp } from "../../hooks/useSendOtp";

export default function EditPhoneModal({ isOpen, onClose, onSave, user, initialPhone, setShowSuccessModal }) {
    const { checkPhoneNumber, fetchUEditProfile, isUsed, isChecking, error } = useLineAuth();
    const { fetchSendOtp, fetchVerifyOtp, verified, loading, otperror, cooldown } = useSendOtp();

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    // OTP states
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPhone(initialPhone || "");
            const lineUserRaw = localStorage.getItem("lineUser");
            const lineUser = lineUserRaw ? JSON.parse(lineUserRaw) : null;
            setFirstName(lineUser?.firstName || "");
            setLastName(lineUser?.lastName || "");
            setHasChecked(false);
            // Reset OTP states
            setShowOtpInput(false);
            setOtp("");
            setOtpSent(false);
        }
    }, [isOpen, initialPhone, user]);

    const handlePhoneChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
        setPhone(raw);
        setHasChecked(false);
        // Reset OTP states when phone changes
        setShowOtpInput(false);
        setOtp("");
        setOtpSent(false);
    };

    const handleCheckPhone = async () => {
        const isValid = phone.match(/^0\d{9}$/);
        if (!isValid) {
            alert("กรุณากรอกเบอร์ให้ถูกต้อง");
            return;
        }

        await checkPhoneNumber(phone);
        setHasChecked(true);
    };

    const handleSendOtp = async () => {
        if (!phone.match(/^0\d{9}$/)) {
            alert("กรุณากรอกเบอร์ให้ถูกต้อง");
            return;
        }

        if (!hasChecked || isUsed === true) {
            alert("กรุณาตรวจสอบเบอร์โทรให้เรียบร้อยก่อน");
            return;
        }

        const result = await fetchSendOtp(phone);
        if (result) {
            setOtpSent(true);
            setShowOtpInput(true);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            alert("กรุณากรอก OTP ให้ครบ 6 หลัก");
            return;
        }

        const isVerified = await fetchVerifyOtp(otp);
        if (isVerified) {
            // OTP verified successfully, now save the phone number
            handleSave();
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await onSave(phone);
        setIsLoading(false);
        onClose();
    };

    const handleProfileSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            alert("กรุณากรอกชื่อและนามสกุลให้ครบ");
            return;
        }

        setIsLoading(true);
        try {
            await fetchUEditProfile(firstName.trim(), lastName.trim()); // 👈 call ไป backend
            onClose(); // ปิด modal
        } catch (e) {
            console.error("Save failed", e);
        } finally {
            setIsLoading(false);
        }
    };


    const isPhoneValid = phone.match(/^0\d{9}$/);
    const canCheckPhone = isPhoneValid && phone !== initialPhone;
    const canSendOtp = hasChecked && isUsed === false && !otpSent;
    const canSave = verified; // Only allow save if OTP is verified

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
                            แก้ไขข้อมูล
                        </div>
                        <button onClick={onClose}>
                            <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between w-full gap-2">
                            <div className="flex flex-col w-1/2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <User className="w-4 h-4" />
                                    ชื่อ
                                </label>
                                <input
                                    className="input input-lg text-sm bg-white w-full border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="ชื่อจริง"
                                />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    นามสกุล
                                </label>
                                <input
                                    className="input input-lg text-sm bg-white w-full border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="นามสกุล"
                                />
                            </div>
                        </div>


                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Phone className="w-4 h-4" />
                            หมายเลขโทรศัพท์
                        </label>

                        <div className="flex gap-2">
                            <div className="relative w-full">
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="000-000-0000"
                                    className="input input-lg bg-white w-full border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400"
                                    disabled={otpSent}
                                />
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            <button
                                type="button"
                                onClick={handleCheckPhone}
                                disabled={!canCheckPhone || isChecking}
                                className="bg-main-green text-white px-4 py-2 rounded-xl hover:bg-amber-400 transition disabled:opacity-50"
                            >
                                {isChecking ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Phone Check Status */}
                        {hasChecked && isUsed === false && (
                            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                                <Check className="w-4 h-4" />
                                เบอร์นี้สามารถใช้งานได้
                            </div>
                        )}

                        {hasChecked && isUsed === true && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                <X className="w-4 h-4" />
                                เบอร์นี้ถูกใช้งานแล้ว
                            </div>
                        )}

                        {/* OTP Send Button */}
                        {hasChecked && isUsed === false && !showOtpInput && (

                            <button
                                onClick={handleSendOtp}
                                disabled={!canSendOtp || loading || cooldown > 0}
                                className="w-full flex items-center justify-center gap-2 bg-main-green text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        กำลังส่ง OTP...
                                    </>
                                ) : cooldown > 0 ? (
                                    <>
                                        <MessageSquare className="w-4 h-4" />
                                        ส่งอีกครั้งใน {cooldown} วินาที
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare className="w-4 h-4" />
                                        ส่ง OTP
                                    </>
                                )}
                            </button>
                        )}

                        {/* OTP Input */}
                        {showOtpInput && (
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <MessageSquare className="w-4 h-4" />
                                    รหัส OTP
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="กรอกรหัส OTP 6 หลัก"
                                        className="input input-lg bg-white w-full border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 text-center text-lg tracking-widest"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={otp.length !== 6 || loading}
                                        className="bg-main-orange text-white px-4 py-2 rounded-xl disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Resend OTP */}
                                {cooldown === 0 && (
                                    <button
                                        onClick={handleSendOtp}
                                        disabled={loading}
                                        className="w-full text-main-green text-sm underline"
                                    >
                                        ส่ง OTP อีกครั้ง
                                    </button>
                                )}

                                {cooldown > 0 && (
                                    <div className="text-center text-sm text-gray-500">
                                        ส่ง OTP อีกครั้งใน {cooldown} วินาที
                                    </div>
                                )}
                            </div>
                        )}

                        {/* OTP Verification Status */}
                        {verified && (
                            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                                <Check className="w-4 h-4" />
                                ยืนยัน OTP สำเร็จ
                            </div>
                        )}

                        {/* Error Messages */}
                        {error && (
                            <div className="text-sm text-red-500">{error}</div>
                        )}

                        {otperror && (
                            <div className="text-sm text-red-500">{otperror}</div>
                        )}
                    </div>
                    {/* Footer */}
                    <div className="flex items-center gap-3 p-6 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleProfileSave}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 bg-main-green text-white rounded-xl font-medium transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    บันทึก
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}