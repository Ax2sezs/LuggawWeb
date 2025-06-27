import React, { useRef, useEffect, useState } from "react";
import { CheckCircle, Gift, Star, CalendarDays } from "lucide-react";

export function ConfirmRedeemModal({ reward, isOpen, onClose, onConfirm }) {
    const dialogRef = useRef(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [cooldown, setCooldown] = useState(0);


    useEffect(() => {
        if (isOpen) {
            setIsDisabled(false);   // 🟢 รีเซ็ตให้กดได้ใหม่
            setCooldown(0);         // 🟢 รีเซ็ต cooldown ด้วย
            dialogRef.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);


    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        } else if (cooldown === 0 && isDisabled) {
            setIsDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [cooldown, isDisabled]);

    const handleConfirm = async () => {
        try {
            setIsDisabled(true);
            setCooldown(30); // 30 วินาที

            await onConfirm();
            dialogRef.current?.close();
            onClose(false)
        } catch (err) {
            console.error("❌ Error during confirm redeem:", err);
        }
    };


    return (
        <>
            {/* Confirm Dialog */}
            <dialog ref={dialogRef} className="modal">
                <div className="relative modal-box max-w-xs p-0 rounded-2xl overflow-hidden shadow-xl border border-gray-300 bg-white">

                    {/* รูปภาพ */}
                    <div className="p-1">
                        <img
                            src={reward.imageUrl}
                            alt={reward.rewardName}
                            className="w-full h-auto object-cover rounded-2xl"
                        />
                    </div>

                    {/* กล่องรายละเอียด */}
                    <div className="-mt-6 bg-white rounded-t-2xl z-10 relative shadow-inner max-h-[65vh] overflow-y-auto">

                        {/* ชื่อและคำอธิบาย */}
                        <div className="p-4 h-1/2 overflow-auto">
                            <h3 className="text-lg font-bold text-main-green">{reward.rewardName}</h3>
                            <p className="text-sm text-main-green whitespace-pre-wrap break-words max-h-40 overflow-auto">
                                {reward.description.replace(/\\n/g, "\n")}
                            </p>
                        </div>
                        <div className="border-dashed border-gray-200 border-2 mx-5"></div>
                        {/* ระยะเวลาแลก */}
                        <div className="px-4 pb-2 text-sm text-gray-800 mt-2">
                            <p className="mb-1 font-medium">ระยะเวลาแลก:</p>
                            <p className="text-xs">
                                <span>ใช้ได้ถึง: {reward.rewardType === 1 ? "ภายในเดือนเกิด" : new Date(reward.endDate).toLocaleDateString("th-TH")}</span>
                            </p>
                        </div>

                        {/* แสดงคะแนนที่ใช้ */}
                        <div className="px-4 pb-2 text-sm mt-2 text-gray-800">
                            <p className="font-medium flex items-center justify-center text-lg">
                                <Star className="w-5 h-5 text-yellow-500 mr-1" /> ใช้: {reward.pointsRequired} คะแนน
                            </p>
                        </div>
                        <div className="border-dashed border-gray-200 border-2 mx-5"></div>

                        {/* ปุ่มยืนยัน/ยกเลิก */}
                        <div className="flex justify-center items-center gap-3 p-4 w-full">
                            <button
                                type="button"
                                className="btn btn-outline btn-error text-sm w-1/2"
                                onClick={onClose}
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="button"
                                className={`btn text-sm w-1/2 text-white border-hidden ${isDisabled ? "bg-main-green cursor-not-allowed" : "bg-main-green hover:bg-green-700"}`}
                                onClick={handleConfirm}
                                disabled={isDisabled}
                            >
                                <Gift className="mr-1" />
                                {isDisabled ? "กำลังแลก. . ." : "ยืนยันแลก"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Backdrop */}
                <form method="dialog" className="modal-backdrop">
                    <button type="button" onClick={onClose}>close</button>
                </form>
            </dialog>



        </>
    );
}
