import React, { useRef, useEffect, useState } from "react";
import { Gift, Calendar } from "lucide-react";

export function ConfirmRedeemModal({ reward, isOpen, onClose, onConfirm }) {
    const dialogRef = useRef(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setIsDisabled(false);
            setCooldown(0);
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
            setCooldown(30);
            await onConfirm();
            dialogRef.current?.close();
            onClose(false);
        } catch (err) {
            console.error("❌ Error during confirm redeem:", err);
        }
    };

    return (
        <dialog ref={dialogRef} className="modal sm:modal-middle">
            <div className="modal-box p-0 max-w-sm mx-auto bg-bg rounded-3xl shadow-2xl border-0 overflow-hidden font-[Itim]
                            max-h-[90vh] flex flex-col">
                <div className="relative">
                    <figure>
                        <img
                            src={reward.imageUrl}
                            alt={reward.rewardName}
                            className="w-full h-auto object-cover"
                        />
                    </figure>
                </div>

                {/* Content (scrollable) */}
                <div className="px-6 py-4 space-y-5 flex-1">
                    <div className="border-2 border-main-orange w-16 rounded-3xl mb-3 text-center mx-auto" />

                    <div className="text-center space-y-2">
                        {/* <h3 className="text-xl font-bold text-main-green leading-tight">{reward.rewardName}</h3> */}
                        {/* <div className="w-16 h-1 bg-main-orange rounded-full mx-auto"></div> */}
                        <div className="max-h-24 overflow-auto text-start">
                            <p className="text-main-green text-sm whitespace-pre-wrap">
                                {reward.description.replace(/\\n/g, "\n")}
                            </p>
                        </div>
                    </div>

                    {/* Expiry info */}
                    {/* <div className="card bg-white/60 shadow-sm border-0 mt-1">
                        <div className="card-body px-3 py-2 flex-row items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-main-orange flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex text-left text-xs leading-tight">
                                <div className="font-medium text-main-green">ใช้ได้ถึง :</div>
                                <div className="font-medium text-main-green/60 ml-1">
                                    {reward.rewardType === 1
                                        ? "ภายในเดือนเกิด"
                                        : new Date(reward.endDate).toLocaleDateString("th-TH")}
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* (optional) Cooldown */}
                    {/* {cooldown > 0 && (
                        <div className="card bg-error/10 shadow-sm border-0">
                            <div className="card-body p-4 flex-row items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-error flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-error text-sm">รอสักครู่</div>
                                    <div className="text-xs text-error/60">กรุณารอ {cooldown} วินาที</div>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
                <div className="border border-dashed border-black mx-3 mb-3" />
                {/* Buttons (fixed bottom) */}
                <div className="flex gap-3 pt-2 px-6 pb-6">
                    <button
                        type="button"
                        className="btn btn-outline flex-1 rounded-2xl border-2 border-main-green text-main-green hover:bg-main-green/10"
                        onClick={onClose}
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="button"
                        className={`btn flex-1 rounded-2xl text-white border-0 ${isDisabled
                            ? 'bg-main-green/60 cursor-not-allowed'
                            : 'bg-main-green hover:bg-main-green/90'
                            }`}
                        onClick={handleConfirm}
                        disabled={isDisabled}
                    >
                        {isDisabled ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                กำลังแลก...
                            </>
                        ) : (
                            <>
                                <Gift className="w-4 h-4" />
                                {reward.pointsRequired} คะแนน
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button type="button" onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
