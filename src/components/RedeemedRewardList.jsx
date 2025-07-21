import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Barcode from "react-barcode";
import { useRedeemedRewards } from "../hooks/useRedeemedRewards";
import { BarcodeIcon, CalendarDays, Check, Calendar, CircleCheckBig } from "lucide-react";
import useSignalR from "../hooks/useSignalR";
import toast from "react-hot-toast";
import Pagination from "./Pagination";

export default function RedeemedRewardList({ userId, status = "unused" }) {
    const { redeemedRewards, loading, error, refetch, totalItem, page, setPage } = useRedeemedRewards(userId, status);
    const [rewards, setRewards] = useState([]);
    const [selectedReward, setSelectedReward] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
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
            couponUsedRef.current = couponData;
            refetch();
            setShowSuccessModal(true);   // เปิด success modal
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
                                            <h2 className="text-lg font-extrabold text-main-green truncate text-start w-44 mb-2">
                                                {reward.rewardName}
                                            </h2>
                                            {/* <p className="text-sm line-clamp-2 truncate w-40 text-start">
                                                {reward.description}
                                            </p> */}

                                            <div className="flex items-center gap-2 text-xs mt-1 text-gray-500">
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
                                                <span className="btn btn-md bg-main-green text-white px-3 py-1 rounded-xl flex items-center gap-1 text-sm shadow font-light">
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

                {selectedReward && (
                    <dialog ref={dialogRef} className="modal">
                        <div className="modal-box p-0 max-w-sm mx-auto bg-bg rounded-3xl shadow-2xl border-0 overflow-hidden font-[Itim]
                            max-h-[90vh] flex flex-col">
                            {/* Hero Image + Gradient */}
                            <div className="relative ">
                                <figure>
                                    <img
                                        src={selectedReward.imageUrl}
                                        alt={selectedReward.rewardName}
                                        className="w-full max-h-96 object-cover"
                                    />
                                </figure>
                            </div>

                            {/* Content */}
                            <div className="px-6 pb-6 pt-3 space-y-5">

                                {/* <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-main-green leading-tight">{selectedReward.rewardName}</h3>
                                    <div className="w-16 h-1 bg-main-orange rounded-full mx-auto"></div> 
                                    <div className="max-h-24 overflow-auto text-start">
                                        <p className="text-main-green/70 text-sm whitespace-pre-wrap">
                                            {selectedReward.description}
                                        </p>
                                    </div>
                                </div> */}
                                <div className="border-2 border-main-orange w-16 rounded-3xl mb-3 text-center mx-auto" />

                                <div className="space-y-3">
                                    {/* <div className="card bg-white/60 shadow-sm border-0 mt-1">
                                        <div className="card-body px-3 py-2 flex-row items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-main-orange flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex text-left text-xs leading-tight">
                                                <div className="font-medium text-main-green">ใช้ได้ถึง :</div>
                                                <div className="font-medium text-main-green/60 ml-1">
                                                    {selectedReward.rewardType === 1
                                                        ? "ภายในเดือนเกิด"
                                                        : new Date(selectedReward.endDate).toLocaleDateString("th-TH")}
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* Coupon code (ถ้ามี) */}
                                    {selectedReward.couponCode && (
                                        <div className="flex flex-col items-center py-2 border border-black border-dashed rounded-3xl bg-white">
                                            <Barcode
                                                value={selectedReward.couponCode}
                                                width={1.5}
                                                height={40}
                                                displayValue={true}
                                            />
                                            {/* <p className="font-bold text-sm text-gray-700">
                                                {selectedReward.couponCode}
                                            </p> */}
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline flex-1 rounded-2xl border-2 border-main-green text-main-green hover:bg-main-green/10"
                                        onClick={closeModal}
                                    >
                                        ปิด
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Backdrop */}
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                )}

            </div >
            <Pagination currentPage={page} totalPages={totalItem} onPageChange={setPage} loading={loading} />
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
                        <div className="bg-white border-2 border-main-green w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <img src="loading.gif" className="w-full h-full" alt="success" />
                        </div>
                    </div>

                    {/* Success text */}
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">ใช้คูปองสำเร็จ !</h2>
                    </div>

                    {/* Decorative divider */}
                    <div className="relative z-10 my-6">
                        <div className="flex items-center justify-center">
                            <div className="flex-1 border-t-2 border-dashed border-main-orange"></div>
                            <div className="mx-4 w-12 h-12 flex justify-center items-center">
                                <Check className="w-full h-full text-main-green" />
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
