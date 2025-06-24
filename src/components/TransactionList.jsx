import React from "react";
import { ChevronLeft, ChevronRight, CircleDollarSign, Gift, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useTransaction } from "../hooks/useTransaction";

export default function TransactionList() {
    const lineUser = JSON.parse(localStorage.getItem("lineUser") || "{}");
    const phoneNumber = lineUser.phoneNumber || "";

    const {
        transactions,
        userId,
        totalPoints,
        pageNumber,
        pageSize,
        totalTransactions,
        loading,
        error,
        handlePrev,
        handleNext,
    } = useTransaction(phoneNumber);

    if (loading)
        return (

            <motion.p
                className="text-center text-main-green mt-8 font-semibold"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div>
                    {/* <Activity className="inline-block mr-2" size={20} /> */}
                    <img src="./loading.gif" />
                </div>
                Loading ...
            </motion.p>
        );

    if (error)
        return (
            <p className="text-center text-main-orange mt-8 font-semibold">
                Error: {error}
            </p>
        );

    if (!transactions.length)
        return (
            <p className="text-center text-main-brown mt-8 font-medium">
                ไม่มีประวัติ.
            </p>
        );

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-xl mx-auto"
        >
            <ul className="space-y-4 p-5">
                {transactions.map((t) => {
                    const isTopUp = t.transactionType === "เติมแต้ม" || t.points > 0;
                    const Icon = isTopUp ? CircleDollarSign : Gift;
                    const iconBgClass = isTopUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";

                    return (
                        <motion.li
                            key={t.transactionId}
                            className="p-4 rounded-2xl shadow border flex items-start gap-4 bg-white hover:shadow-lg transition-all"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className={`p-3 rounded-full ${iconBgClass}`}>
                                <Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-main-green text-lg">
                                        {t.transactionType}
                                    </span>
                                    <span
                                        className={`font-bold text-xl ${t.points > 0 ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {t.points > 0 ? `+${t.points}` : t.points} คะแนน
                                    </span>
                                </div>
                                <div className="text-sm text-main-brown mt-1 flex items-center gap-2">
                                    <FileText size={14} className="opacity-60" />
                                    {t.description}
                                </div>
                                <div className="text-sm text-main-brown/60 mt-1 flex items-center gap-2">
                                    <Clock size={14} />
                                    {new Date(t.transactionDate).toLocaleString("th-TH")}
                                </div>
                            </div>
                        </motion.li>
                    );
                })}
            </ul>

            {/* Pagination */}
            <div className="flex justify-between items-center my-5 px-5">
                <button
                    onClick={handlePrev}
                    disabled={pageNumber === 1}
                    className="px-5 py-2 rounded-full border border-main-green text-main-green font-semibold flex items-center gap-1 hover:bg-main-green hover:text-white disabled:opacity-50 transition"
                >
                    <ChevronLeft size={18} />
                    ก่อนหน้า
                </button>
                <span className="text-sm text-main-brown font-medium select-none">
                    หน้า {pageNumber} / {Math.ceil(totalTransactions / pageSize)}
                </span>
                <button
                    onClick={handleNext}
                    disabled={pageNumber * pageSize >= totalTransactions}
                    className="px-5 py-2 rounded-full border border-main-green text-main-green font-semibold flex items-center gap-1 hover:bg-main-green hover:text-white disabled:opacity-50 transition"
                >
                    ถัดไป
                    <ChevronRight size={18} />
                </button>
            </div>
        </motion.div>
    );
}
