import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Barcode from "react-barcode";
import { useRedeemedRewards } from "../hooks/useRedeemedRewards";
import { BarcodeIcon, CalendarDays } from "lucide-react";
import useSignalR from "../hooks/useSignalR";
import toast from "react-hot-toast";
import Pagination from "./Pagination";

export default function RedeemedRewardList({ userId, status = "unused" }) {
    const { redeemedRewards, loading, error, refetch, totalItem, page, setPage } = useRedeemedRewards(userId, status);
    const [rewards, setRewards] = useState([]);
    const [selectedReward, setSelectedReward] = useState(null);
    const isModalOpen = selectedReward !== null;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const dialogRef = useRef();
    const couponUsedRef = useRef(null);

    useEffect(() => {
        setPage(1);
    }, [status]);

    useEffect(() => {
        setRewards(redeemedRewards || []);
    }, [redeemedRewards]);

    useEffect(() => {
        if (selectedReward && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [selectedReward]);

    useEffect(() => {
        const couponUsed = couponUsedRef.current;
        if (!couponUsed) return;

        const isMatch = rewards.find(r => r.id === couponUsed.CouponId && r.isUsed);
        const isSelected = selectedReward?.id === couponUsed.CouponId;

        if (isMatch && isSelected) {
            couponUsedRef.current = null;

            requestAnimationFrame(() => {
                dialogRef.current?.close();
                // toast.success("คูปองนี้ถูกใช้เรียบร้อยแล้ว 🎉", {
                //     position: "top-center",
                //     duration: 3000,
                // });
            });
        }
    }, [rewards, selectedReward]);

    useSignalR(
        (couponData) => {
            toast.success("คูปองนี้ถูกใช้เรียบร้อยแล้ว", {
                position: "top-center",
                duration: 3000,
                style: {
                    marginTop: "40vh",  // เลื่อน toast ลงกลางจอ
                    fontSize: "16px",
                    fontWeight: "bold",
                    background: "#dcfce7",
                    color: "#065f46",
                    border: "1px solid #86efac",
                    borderRadius: "12px",
                },
            });
            ; couponUsedRef.current = couponData;
            refetch();
        },
        isModalOpen
    );

    const closeModal = () => {
        setSelectedReward(null);
    };

    if (loading) {
        return (
            <motion.p
                className="text-center text-main-green mt-8 font-semibold"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <img src="./loading.gif" alt="loading" />
                Loading ...
            </motion.p>
        );
    }

    if (error) {
        return (
            <p className="text-center text-red-600 font-semibold mt-8">
                Error: {error}
            </p>
        );
    }

    const formatDate = (dateStr, options = {}) =>
        new Date(dateStr).toLocaleDateString("th-TH", options);

    const formatDateTime = (dateStr) =>
        new Date(dateStr).toLocaleString("th-TH");

    return (
        <>
            <div className="flex flex-col items-center gap-6 min-h-screen">
                {rewards.length === 0 && (
                    <p className="text-center text-main-brown text-lg font-medium mt-12">
                        <img src="./logo.png" alt="logo" />
                        ไม่มีรางวัลที่แลก
                    </p>
                )}

                {rewards
                    .slice()
                    .sort((a, b) => (a.isUsed === b.isUsed ? 0 : a.isUsed ? 1 : -1))
                    .map((reward) => {
                        const isDisabled = status === "expired" || reward.isUsed;


                        return (
                            <motion.div
                                key={reward.id || reward.redeemedRewardId || reward.couponCode}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                whileHover={!isDisabled ? { scale: 1.02, rotateZ: 0.5 } : {}}
                                onClick={() => {
                                    if (!isDisabled) setSelectedReward(reward);
                                }}
                                className={`relative w-full max-w-md bg-bg rounded-2xl shadow-lg border-dashed border border-black overflow-hidden 
          ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                            >
                                {(reward.isUsed || isDisabled) && (
                                    <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center pointer-events-none">
                                        <span className="text-white text-xl font-bold">
                                            {reward.isUsed ? "ใช้แล้ว" : "หมดอายุแล้ว"}
                                        </span>
                                    </div>
                                )}


                                {/* <div className="absolute top-0 left-0 bottom-0 w-4 bg-main-green z-10">
                                {[6, "1/2", -6].map((v, i) => (
                                    <div
                                        key={i}
                                        className="absolute -right-1 h-3 w-3 bg-bg rounded-full shadow-inner"
                                        style={{
                                            top: v === "1/2" ? "50%" : `${v}px`,
                                            transform: v === "1/2" ? "translateY(-50%)" : "none",
                                        }}
                                    />
                                ))}
                            </div> */}

                                <div className="flex h-36">
                                    <div className="w-36">
                                        <img
                                            src={reward.imageUrl}
                                            alt={reward.rewardName}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-between flex-grow px-3 pt-2 text-main-brown border-l-2 border-dashed border-black">
                                        <div>
                                            <h2 className="text-lg font-extrabold text-main-green truncate text-start">
                                                {reward.rewardName}
                                            </h2>
                                            <p className="text-sm line-clamp-2 truncate w-40 text-start">
                                                {reward.description}
                                            </p>

                                            <div className="flex items-center gap-2 text-xs mt-1 text-main-brown/80">
                                                <CalendarDays className="w-4 h-4" />
                                                <span>
                                                    <span>ใช้ได้ถึง: {reward.rewardType === 1 ? "ภายในเดือนเกิด" : new Date(reward.endDate).toLocaleDateString("th-TH")}</span>
                                                </span>
                                            </div>

                                            {/* <p className="text-xs text-main-brown/70 mt-1">
                                            แลกเมื่อ: {formatDateTime(reward.redeemedDate)}
                                        </p> */}
                                        </div>

                                        <div className="border-t border-dashed border-gray-400 mt-2" />

                                        <div className="flex justify-center items-center h-20">
                                            {reward.couponCode && !reward.isUsed && !isDisabled ? (
                                                <span className="btn btn-sm bg-main-green text-white px-3 py-1 rounded flex items-center gap-1 text-sm shadow font-light">
                                                    <BarcodeIcon className="w-4 h-4" />
                                                    แสดง Barcode
                                                </span>
                                            ) : reward.isUsed ? (
                                                <p className="text-red-600 text-sm text-center">
                                                    ใช้แล้วเมื่อ {new Date(reward.usedDate?.split("T")[0]).toLocaleDateString('th-TH')}
                                                </p>
                                            ) : isDisabled ? (
                                                <p className="text-gray-500 text-sm font-medium text-center">หมดอายุแล้ว</p>
                                            ) : null}

                                        </div>


                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}


                {
                    selectedReward?.isUsed && (
                        <div className="text-red-600 text-center font-semibold text-sm">
                            ❌ คูปองนี้ถูกใช้แล้วเมื่อ {formatDateTime(selectedReward.usedDate)}
                        </div>
                    )
                }

                {
                    selectedReward && (
                        <dialog ref={dialogRef} className="modal">
                            <div className="modal-box max-w-xs p-0 rounded-2xl overflow-hidden shadow-xl border border-gray-300 bg-white">
                                <div className="p-1">
                                    <img
                                        src={selectedReward.imageUrl}
                                        alt="Reward"
                                        className="w-full object-cover rounded-2xl"
                                    />
                                </div>

                                <div className="-mt-6 bg-white rounded-t-2xl z-10 relative shadow-inner max-h-[65vh] overflow-y-auto">
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-main-green">
                                            {selectedReward.rewardName}
                                        </h3>
                                        <p className="text-sm text-main-green whitespace-pre-wrap break-words">
                                            {selectedReward.description}
                                        </p>
                                    </div>

                                    <div className="px-4 pb-2 text-sm text-gray-800">
                                        <p className="mb-1 font-medium">ระยะเวลาแลก:</p>
                                        <p className="text-xs">
                                            <span>ใช้ได้ถึง: {selectedReward.rewardType === 1 ? "ภายในเดือนเกิด" : new Date(selectedReward.endDate).toLocaleDateString("th-TH")}</span>
                                        </p>
                                    </div>
                                    {selectedReward.couponCode && (
                                        <div className="flex flex-col items-center py-4 border-t border-gray-200">
                                            <Barcode
                                                value={selectedReward.couponCode}
                                                width={1}
                                                height={40}
                                                displayValue={false}
                                            />
                                            <p className="font-bold text-sm text-gray-700 mt-2">
                                                {selectedReward.couponCode}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-center items-center p-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-error text-sm w-2/3"
                                            onClick={closeModal}
                                        >
                                            ปิด
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                    )
                }
            </div >
            <Pagination currentPage={page} totalPages={totalItem} onPageChange={setPage} loading={loading} />

        </>
    );
}
