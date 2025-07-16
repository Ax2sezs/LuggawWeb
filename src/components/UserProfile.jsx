import { History } from "lucide-react"; // นำเข้า icon

export default function UserProfile({ user, points, expire, onLogout, onShowTransactions }) {
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

    return (
        <div className="relative z-10">
            {/* Header background */}
            <div className="relative bg-main-green text-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <img
                            src={user.pictureUrl || "https://via.placeholder.com/100"}
                            alt={user.displayName}
                            className="w-16 h-16 rounded-full border-2 border-sub-brown object-cover shadow-sm"
                        />
                        <div className="flex flex-col text-start">
                            <span className="text-lg font-bold">สวัสดีคุณ {user.displayName}</span>
                            <div className="flex items-center gap-2 text-yellow-200 font-semibold">
                                <span>{points} คะแนน</span>
                            </div>
                            <span className="text-xs text-bg">หมดอายุใน {formattedDate}</span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="flex flex-col justify-between gap-3">
                        <button
                            onClick={onLogout}
                            className="text-xs bg-sub-brown text-main-brown font-semibold px-4 py-2 rounded-2xl hover:bg-main-brown hover:text-sub-brown transition"
                        >
                            LOGOUT
                        </button>
                        <button className="flex gap-2" onClick={onShowTransactions}
                        >
                            <History color="#fbf9f3" />History
                        </button>
                    </div>
                </div>
            </div>

            Decorative wave
            <div className="-mt-10">
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
