import { History, Menu, Phone, LogOut, PersonStanding, AlertCircle, User } from "lucide-react"; // นำเข้า icon
import EditPhoneModal from "./Modals/EditPhoneModal";
import { useEffect, useState } from "react";

export default function UserProfile({ user, points, expire, pointLastYear, expireLastYear, onLogout, onShowTransactions, onShowProfile, onUpdatePhoneNumberTrigger, fetchPoint }) {
    function formatExpireDate(expireString) {
        if (!expireString) {
            return ''; // หรือคืนค่าว่างเปล่า หรือค่าที่คุณต้องการหากไม่มีข้อมูล
        }

        // ตัวอย่าง expireString: "ex 2026-1-31"
        // แยกเอาเฉพาะส่วนที่เป็นวันที่ออกมา
        const datePart = expireString.replace('ex ', ''); // จะได้ "2026-1-31"

        // สร้าง Date object จาก string
        const date = new Date(datePart);

        // ตรวจสอบว่าวันที่ถูกต้องหรือไม่ (เช่น ถ้า datePart ไม่ใช่รูปแบบวันที่ที่ถูกต้อง)
        if (isNaN(date.getTime())) {
            return expireString; // คืนค่าเดิมถ้าไม่สามารถแปลงเป็นวันที่ได้
        }

        // ดึงวัน เดือน ปี
        const day = String(date.getDate()).padStart(2, '0'); // ทำให้เป็น 2 หลัก (เช่น 1 -> 01)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 ดังนั้นต้อง +1
        const year = date.getFullYear();

        // รวมกันเป็นรูปแบบ DD/MM/YYYY
        return `${day}/${month}/${year}`;
    }
    const formattedDate = formatExpireDate(expire);
    useEffect(() => {
        // console.log("Profile Point : ", points)
        points
    }, [points])
    return (
        <div className="relative z-10">
            {/* Header background */}
            <div className="relative bg-main-green text-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <img
                            src={user.pictureUrl || "./default.png"}
                            alt={user.displayName}
                            className="w-16 h-16 rounded-full border-2 border-sub-brown object-cover shadow-sm"
                        />
                        <div className="flex flex-col text-start">
                            <span className="text-lg font-bold">สวัสดีคุณ {user.displayName}</span>

                            <div className="flex items-center gap-2 text-yellow-200 font-semibold">
                                {points !== undefined && points !== null ? (
                                    <div className="flex gap-2">
                                        <span>{points} คะแนน</span>
                                        {/* <div
                                            className="tooltip tooltip-warning"
                                            data-tip={`คะแนน ${pointLastYear} จะหมดอายุใน ${new Date(expireLastYear).toLocaleDateString("th-TH", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                timeZone: "Asia/Bangkok"
                                            })}`}                                        >
                                            <button className="">
                                                <AlertCircle size={18} />
                                            </button>
                                        </div> */}

                                    </div>

                                ) : (
                                    <span className="loading loading-spinner loading-xs"></span>
                                )}
                            </div>

                            {/* <span className="text-xs text-bg">
                                {formattedDate ? (
                                    formattedDate
                                ) : (
                                    <span className="loading loading-spinner loading-xs"></span>
                                )}
                            </span> */}
                        </div>
                    </div>


                    {/* Hamburger Menu */}
                    <div className="dropdown dropdown-end z-50 relative">
                        <button tabIndex={0} className="btn btn-ghost btn-circle text-white">
                            <Menu />
                        </button>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-white text-black rounded-box w-48 absolute z-50"
                        >
                            <li>
                                <button onClick={onUpdatePhoneNumberTrigger} className="flex items-center gap-2">
                                    <User size={16} /> ข้อมูลของฉัน
                                </button>
                            </li>
                            {/* <li>
                                <button onClick={onShowProfile} className="flex items-center gap-2">
                                    <History size={16} /> ข้อมูลของฉัน
                                </button>
                            </li> */}
                            <li>
                                <button onClick={onShowTransactions} className="flex items-center gap-2">
                                    <History size={16} /> ประวัติการใช้งาน
                                </button>
                            </li>
                            <div className="border border-main-orange my-2" />
                            <li>
                                <button onClick={onLogout} className="flex items-center gap-2 text-red-600">
                                    <LogOut size={16} /> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Decorative wave */}
            <div className="-mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path
                        fill="#194829"
                        fillOpacity="1"
                        d="M0,160L30,165.3C60,171,120,181,180,165.3C240,149,300,107,360,117.3C420,128,480,192,540,197.3C600,203,660,149,720,144C780,139,840,181,900,170.7C960,160,1020,96,1080,80C1140,64,1200,96,1260,128C1320,160,1380,192,1410,208L1440,224L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
                    ></path>
                </svg>
            </div>
        </div>
    );
}
