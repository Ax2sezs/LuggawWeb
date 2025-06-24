import React, { useState ,useEffect} from "react";
import ProfileForm from "../components/ProfileForm";
import { submitUserProfile, checkUserProfile } from "../api/lineLoginAPI";

export default function ProfileFormScreen({ user, setUser }) {
  const [profileForm, setProfileForm] = useState({
    phoneNumber: "",
    birthDate: "",
    gender: "",
    isCompleted:true,
    allowMarketing: false,
  });

  useEffect(() => {
  console.log("เข้าหน้า ProfileFormScreen แล้ว");
}, []);


  const isValidPhoneNumber = (phone) => /^[0-9]{9,10}$/.test(phone);

  const handleProfileSubmit = async () => {
    if (!profileForm.phoneNumber || !profileForm.birthDate || !profileForm.gender) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      return;
    }
    if (!isValidPhoneNumber(profileForm.phoneNumber)) {
      alert("กรุณากรอกเบอร์โทรให้ถูกต้อง (9-10 ตัวเลข)", "error");
      return;
    }

    try {
      await submitUserProfile({ ...profileForm });
      const updatedUser = { ...user, ...profileForm };
      setUser(updatedUser);
      localStorage.setItem("lineUser", JSON.stringify(updatedUser));

      const res = await checkUserProfile(user.lineUserId);
      if (res.data?.hasProfile) {
        window.location.href = "/home";
      } else {
        alert("กรอกข้อมูลไม่ครบ กรุณาตรวจสอบอีกครั้ง", "error");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data || err.message), "error");
    }
  };

  return (
    <div className="bg-sub-brown shadow-lg w-full text-center bg-grid-pattern min-h-screen flex">
      <ProfileForm
        formData={profileForm}
        setFormData={setProfileForm}
        onSubmit={handleProfileSubmit}
      />
    </div>
  );
}
