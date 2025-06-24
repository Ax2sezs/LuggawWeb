import React, { useState ,useEffect} from "react";
import RedeemedRewardList from "./RedeemedRewardList";
import { AnimatePresence, motion } from "framer-motion";

const statuses = [
    { key: "unused", label: "ยังไม่ใช้" },
    { key: "used", label: "ใช้แล้ว" },
    { key: "expired", label: "หมดอายุ" },
];

export default function RedeemedRewardsTabs({ userId }) {
    const [activeStatus, setActiveStatus] = useState("unused");

    return (
        <div className="p-5 w-full mx-auto">
            {/* Tab buttons */}
            <div className="relative flex gap-4 mb-6 border-b border-gray-200 justify-center">
                {statuses.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveStatus(key)}
                        className={`relative px-4 py-2 font-semibold transition-all duration-200 ${activeStatus === key
                            ? "text-main-green"
                            : "text-gray-600 hover:text-main-green"
                            }`}
                    >
                        {label}
                        {activeStatus === key && (
                            <motion.div
                                layoutId="underline"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-main-green rounded-t"
                            />
                        )}
                    </button>
                ))}
            </div>
            <RedeemedRewardList userId={userId} status={activeStatus}/>

        </div>
    );
}
