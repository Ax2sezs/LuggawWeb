import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Gift, Star, CalendarDays } from "lucide-react";
import { useReward } from "../hooks/useReward";
import RewardCard from "../components/RewardCard";
import useLineAuth from "../hooks/useLineAuth";

export default function RewardList({ reloadPoints, points }) {
    const { rewards, loading, error, handleRedeem } = useReward();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [redeemedReward, setRedeemedReward] = useState(null);

    useEffect(() => {
        // console.log("Point At RewardList", points);
    }, [points]); const sortedRewards = [...(rewards || [])].sort((a, b) => {
        const now = new Date();

        const isADisabled = now < new Date(a.startDate) || now > new Date(a.endDate);
        const isBDisabled = now < new Date(b.startDate) || now > new Date(b.endDate);

        if (isADisabled !== isBDisabled) {
            return Number(isADisabled) - Number(isBDisabled);
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


    console.log("Sorted Rewards: ", sortedRewards);


    const onRedeemCallback = useCallback(async (rewardId) => {
        await handleRedeem(rewardId);
        const redeemed = rewards.find(r => r.rewardId === rewardId);
        setRedeemedReward(redeemed);

        await reloadPoints();
        setShowSuccessModal(true);
    }, [handleRedeem, reloadPoints, rewards]);

    console.log("Check Redeemed Reward: ", redeemedReward);
    // useEffect(() => {
    //     fetchPoints();
    // }, [reloadPoints]);

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
            <motion.div
                className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 ${showSuccessModal ? '' : 'pointer-events-none'}`}
                initial={false}
                animate={{ opacity: showSuccessModal ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <div
                    className="modal-box max-w-sm bg-gradient-to-br from-white to-gray-50 rounded-3xl text-center shadow-2xl border-2 border-green-100 relative overflow-hidden"
                    style={{
                        opacity: showSuccessModal ? 1 : 0,
                        transform: showSuccessModal ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(50px)',
                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                    }}
                >
                    {/* Background decoration */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20"></div>

                    {/* Success icon */}
                    <div className="relative z-10 mb-6">
                        <div className="bg-main-green w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <Gift className="text-white w-10 h-10" />
                        </div>

                        {/* Celebration sparkles */}
                        {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-yellow-400 text-2xl">
                            ✨
                        </div>
                        <div className="absolute top-2 right-6 text-yellow-400 text-lg">
                            ✨
                        </div>
                        <div className="absolute top-2 left-6 text-yellow-400 text-lg">
                            ✨
                        </div> */}
                    </div>

                    {/* Success text */}
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            แลกของรางวัลสำเร็จ!
                        </h2>

                        <div className="flex justify-center items-center gap-2 text-2xl font-bold mb-2">
                            <span className="text-main-brown">โปรดใช้ภายใน</span>
                            <span className="text-main-green">
                                {redeemedReward?.rewardType == 1 ? "เดือนเกิด" : redeemedReward?.validDays}
                            </span>
                            {redeemedReward?.rewardType == 1 ? "" : <span className="text-main-brown">วัน</span>
                            }
                        </div>

                        {/* <p className="text-gray-600 text-base mb-6">
                            ตรวจสอบในหน้า{" "}
                            <span className="font-semibold text-main-green">Redeemed</span>
                        </p> */}
                    </div>


                    {/* Decorative divider */}
                    <div className="relative z-10 my-6">
                        <div className="flex items-center justify-center">
                            <div className="flex-1 border-t-2 border-dashed border-main-orange"></div>
                            <div className="mx-4 w-16 h-16">
                                <img src="logo.png" className="object-cover w-full h-full" loading="eager" />
                            </div>
                            <div className="flex-1 border-t-2 border-dashed border-main-orange"></div>
                        </div>
                    </div>

                    {/* Close button */}
                    <div className="relative z-10">
                        <button
                            className="btn btn-lg bg-main-green text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            เรียบร้อย !
                        </button>
                    </div>
                </div>
            </motion.div>




        </>
    );
}
