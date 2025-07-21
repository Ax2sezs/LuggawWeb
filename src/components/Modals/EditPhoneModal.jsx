import { useState, useEffect } from "react";
import { X, Phone, Check } from "lucide-react";

export default function EditPhoneModal({ isOpen, onClose, onSave, initialPhone }) {
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPhone(initialPhone || "");
        }
    }, [isOpen, initialPhone]);


    const handlePhoneChange = (e) => {
        // รับเฉพาะตัวเลข ไม่เกิน 10 หลัก
        const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
        setPhone(raw);
    };



    const handleSave = async () => {
        const rawPhone = phone.replace(/\D/g, "");
        if (!rawPhone.match(/^0\d{9}$/)) {
            alert("กรุณากรอกเบอร์ให้ถูกต้อง เช่น 0812345678");
            return;
        }

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay
        onSave(rawPhone);
        setIsLoading(false);
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">                               
                                    <h3 className="font-semibold text-gray-900 text-lg">แก้ไขเบอร์โทร</h3>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        หมายเลขโทรศัพท์
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="081-234-5678"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Validation indicator */}
                                {phone.replace(/\D/g, "").match(/^0\d{9}$/) && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                        <Check className="w-4 h-4" />
                                        <span>รูปแบบเบอร์โทรถูกต้อง</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-3 p-6 border-t border-gray-100">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || phone.replace(/\D/g, "").length !== 10}
                                className="flex-1 px-4 py-2.5 bg-main-green text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
            )}
        </>
    );
}
