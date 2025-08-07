import React, { useState, useEffect } from "react";
import ProfileForm from "../components/ProfileForm";
import { submitUserProfile, checkUserProfile } from "../api/lineLoginAPI";
import toast from "react-hot-toast";
import OtpScreen from "./OtpScreen";

export default function ProfileFormScreen({ user, setUser, error, fetchSendOtp, fetchVerifyOtp, verified, loading, refCode, token, otperror }) {
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "",
    gender: "",
    isCompleted: true,
    allowMarketing: false,
  });
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpSentData, setOtpSentData] = useState(null); // เก็บ refCode, token หลังส่ง OTP
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    console.log("เข้าหน้า ProfileFormScreen แล้ว");
  }, []);


  const isValidPhoneNumber = (phone) => /^[0-9]{9,10}$/.test(phone);

  const handleProfileSubmit = async () => {
    if (!profileForm.phoneNumber || !profileForm.birthDate || !profileForm.gender) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (!isValidPhoneNumber(profileForm.phoneNumber)) {
      toast.error("กรุณากรอกเบอร์โทรให้ถูกต้อง (9-10 ตัวเลข)");
      return;
    }

    try {
      const res = await fetchSendOtp(profileForm.phoneNumber);
      if (!res) {
        toast.error("ส่ง OTP ไม่สำเร็จ");
        return;
      }
      setOtpSentData({ refCode: res.refCode, token: res.token });
      setIsOtpOpen(true); // เปิด modal OTP
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการส่ง OTP");
    }
  };

  // ฟังก์ชันที่เรียกเมื่อ OTP ถูกยืนยันสำเร็จจาก modal
  const onOtpVerified = async () => {
    try {
      // บันทึกข้อมูลโปรไฟล์จริง
      await submitUserProfile(profileForm);
      const updatedUser = { ...user, ...profileForm };
      setUser(updatedUser);
      localStorage.setItem("lineUser", JSON.stringify(updatedUser));
      setOtpVerified(true);

      toast.success("ยืนยัน OTP สำเร็จและบันทึกข้อมูลเรียบร้อย");

      // ปิด modalหลังจากแสดงผลสำเร็จประมาณ 2 วิ
      setTimeout(() => {
        setIsOtpOpen(false);
        window.location.href = "/home";
      }, 2000);
    } catch (err) {
      toast.error("บันทึกข้อมูลไม่สำเร็จ: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="bg-sub-brown shadow-lg w-full text-center bg-grid-pattern min-h-screen flex">
      <ProfileForm
        formData={profileForm}
        setFormData={setProfileForm}
        onSubmit={handleProfileSubmit}
        error={error}
      />
      {isOtpOpen && otpSentData && (
        <OtpScreen
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          profileForm={profileForm}
          fetchVerifyOtp={fetchVerifyOtp}
          refCode={otpSentData.refCode}
          token={otpSentData.token}
          onOtpVerified={onOtpVerified}
          otpVerified={otpVerified}
        />
      )}
    </div>
  );
}
