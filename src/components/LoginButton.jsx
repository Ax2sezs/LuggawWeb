import React, { useState } from "react";

export default function LoginButton({ loginUrl }) {
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setDisabled(true);
    // สามารถเพิ่ม logic อื่น ๆ ได้ถ้าต้องการ
  };

  return (
    <a
      href={loginUrl}
      onClick={handleClick}
      className={`${
        disabled ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
      } text-white px-6 py-3 rounded text-lg inline-block`}
      aria-disabled={disabled}
    >
      {disabled ? "Logging in..." : "Login with LINE"}
    </a>
  );
}
