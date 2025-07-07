import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Gift, Star, CalendarDays } from "lucide-react";
import { useReward } from "../hooks/useReward";
import RewardCard from "../components/RewardCard";
import useLineAuth from "../hooks/useLineAuth";

export default function RewardList({ reloadPoints }) {
    const { rewards, loading, error, handleRedeem } = useReward(undefined, reloadPoints);
    const { fetchPoints, points } = useLineAuth();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const sortedRewards = [...(rewards || [])].sort((a, b) => {
        const now = new Date();

        const isADisabled = now < new Date(a.startDate) || now > new Date(a.endDate);
        const isBDisabled = now < new Date(b.startDate) || now > new Date(b.endDate);

        if (isADisabled !== isBDisabled) {
            return Number(isADisabled) - Number(isBDisabled); // enabled มาก่อน disabled
        }

        const pointA = Number(a.pointsRequired);
        const pointB = Number(b.pointsRequired);

        const getPriority = (reward) => {
            const rt = Number(reward.rewardType);
            if (rt === 1) return 0; // Birthday
            if (rt === 2) return 1; // Exclusive
            return 2;               // ปกติ
        };

        if (!isADisabled && !isBDisabled) {
            const priorityA = getPriority(a);
            const priorityB = getPriority(b);

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            return pointA - pointB;
        } else {
            // ทั้งคู่ disabled → เรียงตาม pointsRequired
            return pointA - pointB;
        }
    });




    const onRedeemCallback = useCallback(async (rewardId) => {
        await handleRedeem(rewardId);
        await fetchPoints();
        setShowSuccessModal(true);
    }, [handleRedeem, fetchPoints]);


    useEffect(() => {
        fetchPoints();
    }, [reloadPoints]);

    if (loading)
        return (
            <motion.div
                className="text-center text-main-green mt-8 font-semibold"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div>
                    <img src="./loading.gif" alt="loading" />
                </div>
                Loading ...
            </motion.div>
        );

    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <>
            <div className="grid grid-cols-1 gap-6 p-5">
                {sortedRewards?.length === 0 && (
                    <p className="text-center text-main-brown text-lg font-medium mt-12">
                        <img src="./logo.png" className="" />
                        รางวัลหมดแล้ว :(
                    </p>
                )}

                {sortedRewards.map((reward) => (
                    <motion.div
                        key={reward.rewardId}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        whileHover={{ scale: 1.02, rotateZ: 0.5 }}
                    >
                        <RewardCard
                            key={reward.rewardId}
                            reward={reward}
                            points={points}
                            onRedeem={onRedeemCallback}
                        />

                    </motion.div>
                ))}

            </div>
            {showSuccessModal && (
                <motion.dialog
                    open
                    className="modal"
                // initial={{ opacity: 0, scale: 0.95 }}
                // animate={{ opacity: 1, scale: 1 }}
                // exit={{ opacity: 0, scale: 0.95 }}
                // transition={{ duration: 0.25 }}
                >
                    <div className="modal-box max-w-sm bg-white rounded-2xl text-center">
                        <Gift className="mx-auto text-green-600 w-16 h-16 mb-4" />
                        <h2 className="text-xl font-semibold text-black">แลกของรางวัลสำเร็จ!</h2>
                        <p className="text-gray-600 mt-2">โปรดตรวจสอบในหน้า Redeemed</p>
                        <div className="border-dashed border-gray-200 border-2 mx-5 my-5"></div>

                        <div className="mt-4">
                            <button
                                className="btn border-main-green btn-outline text-main-green w-1/3 text-lg hover:bg-main-green hover:text-bg"
                                onClick={() => setShowSuccessModal(false)}
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </motion.dialog>
            )}


        </>
    );
}
