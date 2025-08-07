import { useState, useEffect } from "react";
import { X, Phone, Check, Search, PersonStanding, User, Settings, Edit } from "lucide-react";
import useLineAuth from "../../hooks/useLineAuth";

export default function EditPhoneModal({ isOpen, onClose, onSave, user, initialPhone, setShowSuccessModal }) {
    const { checkPhoneNumber, isUsed, isChecking, error } = useLineAuth();
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPhone(initialPhone || "");
            setHasChecked(false);
        }
    }, [isOpen, initialPhone]);

    const handlePhoneChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
        setPhone(raw);
        setHasChecked(false); // reset check state เมื่อมีการแก้ไข
    };

    const handleCheckPhone = async () => {
        const isValid = phone.match(/^0\d{9}$/);
        if (!isValid) {
            alert("กรุณากรอกเบอร์ให้ถูกต้อง");
            return;
        }
        console.log("isUsed:", isUsed); // 👈 log ตรงนี้

        await checkPhoneNumber(phone);
        setHasChecked(true);
    };

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        await onSave(phone);
        setIsLoading(false);
        onClose();
    };

    const isPhoneValid = phone.match(/^0\d{9}$/);
    const canSave = hasChecked && isUsed === false;

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">

                            แก้ไขเบอร์โทร
                        </div>
                        <button onClick={onClose}>
                            <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between w-full gap-2">
                            <div className="flex flex-col">
                                <span className="text-start text-gray-700">นามสกุล</span>
                                <input
                                    className="input input-lg text-sm bg-white text-shadow-black w-full border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400"
                                    value={user.firstName} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-start text-gray-700">นามสกุล</span>
                                <input
                                    className="input input-lg bg-white text-shadow-black w-full border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400"
                                    value={user.lastName} />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="w-4 h-4" />
                            หมายเลขโทรศัพท์
                        </label>

                        <div className="flex gap-2">
                            <div className="relative w-full">
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="0812345678"
                                    className="input input-lg bg-white w-full border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-400"
                                />
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                            <button
                                type="button"
                                onClick={handleCheckPhone}
                                disabled
                                className="bg-main-green text-white px-4 py-2 rounded-xl hover:bg-amber-400 transition disabled:opacity-50"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Status */}
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

                        {error && (
                            <div className="text-sm text-red-500">{error}</div>
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
                            onClick={handleSave}
                            disabled={!canSave || isLoading}
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
