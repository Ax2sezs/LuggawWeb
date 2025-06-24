import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function CallbackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      // เรียกฟังก์ชัน handleLineCallback หรือ set state ที่จำเป็น
      // หลังจากนั้น redirect ไปหน้าอื่น
      // ตัวอย่าง:
      navigate("/", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return <div>
    <Loading/>
  </div>;
}

export default CallbackHandler;
