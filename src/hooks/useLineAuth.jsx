import { useState, useEffect, useRef } from "react";
import {
  handleLineCallback,
  getUserPoints,
  updatePhoneNumber,
  checkPhone,
} from "../api/lineLoginAPI";
import {
  getStoredUser,
  saveUserData,
  saveToken,
  clearAuthData,
} from "../utils/auth";
import toast from "react-hot-toast";

export default function useLineAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState();
  const [isProfileCompleted, setIsProfileCompleted] = useState(null);
  const [active, setActive] = useState(false);
  const [points, setPoints] = useState();
  const [expire, setExpire] = useState('')
  const [expireLastYear, setExpireLastYear] = useState('')
  const [pointLastYear, setPointLastYear] = useState()
  const [isChecking, setIsChecking] = useState(false);
  const [isUsed, setIsUsed] = useState(null); // true, false, หรือ null
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("")
  const hasRequested = useRef(false);


  // 🚀 โหลด user จาก localStorage ตอนโหลดหน้า
  useEffect(() => {
    const init = async () => {
      try {
        const userData = await getStoredUser();
        if (userData) {
          setUser(userData);
          setIsProfileCompleted(userData.isCompleted);
          setActive(!userData.isActive);
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // 🚀 Handle LINE login callback
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    const usedCode = sessionStorage.getItem("line_code_used");
    if (usedCode === code || hasRequested.current) {
      window.history.replaceState({}, document.title, "/");
      return;
    }

    hasRequested.current = true;

    handleLineCallback(code)
      .then((res) => {
        setIsLoading(true)

        const newUser = res.data;
        console.log("[Callback] isCompleted =", newUser.isCompleted);
        setUser(newUser);
        saveUserData(newUser);
        if (newUser.token) saveToken(newUser.token);
        sessionStorage.setItem("line_code_used", code);
        window.history.replaceState({}, document.title, "/");

        setIsProfileCompleted(newUser.isCompleted);
        setActive(!newUser.isActive);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
        setIsLoading(false); // ✅ เพิ่มตรงนี้เพื่อให้หลุดจาก loading
      }).finally(() => {
        setIsLoading(false)
      })
  }, []);

  // 🚀 ดึงแต้มเมื่อมี user
  useEffect(() => {
    if (user?.token) {
      fetchPoints();
    }
  }, [user]);

  // ✅ ฟังก์ชันดึงแต้มคะแนน
  const fetchPoints = async () => {
    setLoadingPoints(true);
    try {
      const res = await getUserPoints();
      setPoints(res.data.userTotalPoint);
      setExpire(res.data.expirePoint)
      setPointLastYear(res.data.userPointLastYear)
      setExpireLastYear(res.data.expirePointLastYear)
      console.log("Set Points done :", res.data.userTotalPoint)
    } catch (err) {
      // setError(err.message); // optional
    } finally {
      setLoadingPoints(false);
    }
  };

  const fetchUpdatePhoneNumber = async (oldPhone, newPhone) => {
    setIsLoading(true);
    try {
      const data = await updatePhoneNumber({
        oldPhone: oldPhone,
        newPhone: newPhone
      });
      toast.success("อัปเดตเบอร์โทรเรียบร้อยแล้ว");

      const updatedUser = { ...user, newPhone: newPhone };
      setUser(updatedUser);
      saveUserData(updatedUser);
      fetchPoints(); // อัปเดตแต้มและ expire ใหม่
      setTimeout(() => [
        logout()
      ])
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPhoneNumber = async (phone) => {
    setIsChecking(true);
    setError(null);
    try {
      const res = await checkPhone({ phone });
      setIsUsed(res.data.isUsed);
      return res?.data.isUsed ?? false;
    } catch (err) {
      console.error("Error checking phone:", err);
      setError("ไม่สามารถตรวจสอบเบอร์ได้");
      setIsUsed(null);
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  // ✅ ฟังก์ชัน logout
  const logout = () => {
    setUser(null);
    clearAuthData();
    window.location.href = "/";
  };

  return {
    user,
    active,
    setUser,
    error,
    setError,
    isProfileCompleted,
    setIsProfileCompleted,
    logout,
    points,
    expire,
    pointLastYear,
    expireLastYear,
    loadingPoints,
    isLoading,
    fetchPoints,
    fetchUpdatePhoneNumber,
    checkPhoneNumber, // fn ที่เอาไปใช้ตอนกดตรวจสอบ
    isChecking,
    isUsed,
  };
}
