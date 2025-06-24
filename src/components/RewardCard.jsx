import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Gift, Star, CalendarDays } from "lucide-react";
import useLineAuth from "../hooks/useLineAuth";  // ปรับ path ตามจริง
import { ConfirmRedeemModal } from "./Modals/RewardModals";

export default function RewardCard({ reward, onRedeem, onPointsUpdate, points }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const now = new Date();
    const startDate = new Date(reward.startDate);
    const endDate = new Date(reward.endDate);
    const isTooEarly = now < startDate;
    const isExpired = now > endDate;
    const isDisabled =
        Number(points) < Number(reward.pointsRequired) ||
        now < startDate ||
        now > endDate;
    const handleConfirmRedeem = async () => {
        try {
            await onRedeem(reward.rewardId);
            // ไม่ต้องเปิด modal ที่นี่แล้ว
        } catch (error) {
            console.error("❌ Redeem failed:", error.message || error);
        }
    };


    return (
        <>

            {/* การ์ดรางวัล */}
            <div className="flex w-full max-w-3xl bg-bg shadow-lg rounded-2xl overflow-hidden relative border border-dashed border-black">
                {/* ✅ Overlay ครอบการ์ด ถ้าไม่สามารถใช้รางวัลได้ */}
                {(isTooEarly || isExpired) && (
                    <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center text-white font-bold text-center text-xl">
                        {isTooEarly ? "Coming Soon. . ." : "Expired"}
                    </div>
                )}

                <div className="w-1/2 relative">
                    <img
                        src={reward.imageUrl}
                        alt={reward.rewardName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 h-full w-4 bg-main-green z-10">
                        <div className="h-4 w-4 bg-white rounded-full absolute -right-2 top-4 shadow-inner"></div>
                        <div className="h-4 w-4 bg-white rounded-full absolute -right-2 top-1/2 transform -translate-y-1/2 shadow-inner"></div>
                        <div className="h-4 w-4 bg-white rounded-full absolute -right-2 bottom-4 shadow-inner"></div>
                    </div>

                </div>

                <div className="w-2/3 p-3 text-gray-800 relative">
                    <h2 className="text-base font-bold truncate mb-1 text-start">{reward.rewardName}</h2>
                    {/* <p className="text-sm text-gray-700 mb-2 text-start trucate">{reward.description}</p> */}

                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>ใช้: {reward.pointsRequired} คะแนน</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <CalendarDays className="w-4 h-4" />
                        <span>ใช้ได้ถึง: {new Date(reward.endDate).toLocaleDateString('TH-th')}</span>
                    </div>
                    <div className="border-t border-dashed border-gray-400 my-2"></div>
                    <div className="flex justify-center">
                        <button
                            onClick={() => setShowConfirmModal(true)}
                            disabled={isDisabled}
                            className={`mt-2 px-4 py-1.5 rounded-md text-sm shadow flex gap-2 transition items-center
                            ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-main-green hover:scale-105 text-white"}`}
                        >
                            <Gift /> แลกรางวัล
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmRedeemModal
                reward={reward}
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmRedeem}
            />

        </>
    );
}
