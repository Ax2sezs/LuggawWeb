import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

export default function ProfileForm({ formData, setFormData, onSubmit, error }) {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cooldown, setCooldown] = useState(0); // 0 = พร้อมกด

    const handleSubmit = () => {
        if (
            !isValidPhone(formData.phoneNumber) ||
            !formData.birthDate ||
            !formData.gender ||
            !formData.allowMarketing ||
            !formData.firstName ||
            !formData.lastName
        ) return;

        setIsSubmitting(true);
        setCooldown(30); // เริ่ม cooldown 30 วิ
        onSubmit();
    };
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => {
            setCooldown(cooldown - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);
    const isValidPhone = (phone) => /^\d{10}$/.test(phone);

    const isDisabled =
        isSubmitting ||
        cooldown > 0 ||
        !formData.phoneNumber ||
        formData.phoneNumber.length !== 10 ||
        !formData.birthDate ||
        !formData.gender ||
        !formData.allowMarketing ||
        !formData.firstName ||
        !formData.lastName;

    const genderOptions = [
        { label: "ชาย", value: "male" },
        { label: "หญิง", value: "female" },
        { label: "อื่นๆ", value: "other" },
    ];

    const birthDateValue = formData.birthDate
        ? parseISO(formData.birthDate)
        : null;

    return (
        <div className="flex w-full justify-center items-center p-6">
            {/* <div className="flex justify-center h-auto -mb-7">
                <img src="./logo.png" className="" />
            </div> */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg mx-auto p-6 rounded-2xl shadow-lg bg-bg border-main-green text-main-brown font-itim"
            >
                <h2 className="text-3xl font-semibold mb-6 text-center text-main-green">
                    กรอกข้อมูลเพิ่มเติม
                </h2>
                {/* ชื่อ */}
                <div className="form-control mb-5">
                    <label className="label">
                        <span className="label-text font-medium text-main-green">ชื่อ</span>
                    </label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                        }
                        placeholder="กรอกชื่อจริง"
                        className="input input-bordered w-full text-base bg-sub-brown border-main-green rounded-2xl"
                    />
                </div>

                {/* นามสกุล */}
                <div className="form-control mb-5">
                    <label className="label">
                        <span className="label-text font-medium text-main-green">นามสกุล</span>
                    </label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="กรอกนามสกุล"
                        className="input input-bordered w-full text-base bg-sub-brown border-main-green rounded-2xl"
                    />
                </div>

                {/* เบอร์โทร */}
                <div className="form-control mb-5">
                    <label className="label">
                        <span className="label-text font-medium text-main-green">
                            เบอร์โทร
                        </span>
                    </label>
                    <input
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                            const val = e.target.value;
                            // กรองเฉพาะตัวเลข
                            if (/^\d*$/.test(val)) {
                                setFormData({ ...formData, phoneNumber: val });
                            }
                        }}
                        placeholder="กรอกเบอร์โทร 10 หลัก"
                        className="input input-bordered w-full text-base bg-sub-brown border-main-green rounded-2xl"
                        maxLength={10}
                        inputMode="numeric"
                    />
                </div>

                {/* วันเกิด */}
                <div className="form-control mb-5 w-full flex flex-col">
                    <span className="label-text font-medium text-main-green text-center">
                        วันเกิด
                    </span>
                    <DatePicker
                        selected={birthDateValue}
                        onChange={(date) =>
                            setFormData({
                                ...formData,
                                birthDate: date ? format(date, "yyyy-MM-dd") : "",
                            })
                        }
                        maxDate={new Date()}
                        placeholderText="เลือกวันเกิด"
                        className="input input-bordered w-full text-base border-main-green text-main-green bg-sub-brown rounded-2xl"
                        dateFormat="dd/MM/yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                    />
                </div>

                {/* เพศ */}
                <div className="mb-6">
                    <label className="label">
                        <span className="label-text font-medium text-main-green text-center">
                            เพศ
                        </span>
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        {genderOptions.map(({ label, value }) => {
                            const isSelected = formData.gender === value;
                            return (
                                <motion.button
                                    key={value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: value })}
                                    whileTap={{ scale: 0.95 }}
                                    className={`btn btn-outline text-lg font-itim border-2 transition-all duration-150 rounded-2xl
                                                ${isSelected
                                            ? "bg-main-green text-sub-brown border-main-green"
                                            : "bg-transparent text-main-green border-main-green"
                                        }`}
                                >
                                    {label}
                                </motion.button>
                            );
                        })}
                    </div>

                </div>
                {/* Checkbox ยินยอมให้ทำการตลาด */}
                <div className="form-control mb-5">
                    <label className="cursor-pointer flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={formData.allowMarketing}
                            onChange={(e) =>
                                setFormData({ ...formData, allowMarketing: e.target.checked })
                            }
                            className="checkbox checkbox-neutral"
                        />
                        <span className="label-text text-main-green font-medium">
                            ยินยอมให้ใช้ข้อมูลเพื่อการตลาด
                        </span>
                    </label>
                </div>
                <span className="">{error}</span>
                {/* ปุ่มบันทึก */}
                <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`btn w-full text-xl font-itim border-none text-sub-brown
        ${!formData.phoneNumber ||
                            !formData.birthDate ||
                            !formData.gender ||
                            !formData.allowMarketing
                            ? "bg-main-green cursor-not-allowed opacity-50"
                            : "bg-main-green cursor-pointer"
                        }
    `}
                >
                    {isSubmitting
                        ? "กำลังส่ง..."
                        : cooldown > 0
                            ? `กรุณารออีก ${cooldown} วินาที`
                            : "ยืนยัน"}
                </motion.button>
                <div className="text-xs text-gray-700 space-x-4 mt-5">
                    โปรดอ่านนโยบายความเป็นส่วนตัวของเรา เพื่อรับทราบและทำความเข้าใจ ก่อนส่งข้อมูลทุกครั้ง <br></br><br></br>

                    <a
                        href="https://drive.google.com/file/d/1ezRmP3v6whAutaL8mj1XkUTWUDMj18Wh/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600 transition"
                    >
                        Terms & Conditions
                    </a>

                    <a
                        href="https://drive.google.com/file/d/18qHSoPQ-zvDn8VbkonAv0K5ct0qYmlbL/view?pli=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600 transition"
                    >
                        Privacy Policy
                    </a>
                </div>
            </motion.div>

        </div>
    );
}
