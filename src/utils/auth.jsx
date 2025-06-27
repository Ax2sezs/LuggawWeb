// src/utils/auth.js

export function getStoredUser() {
  try {
    const data = localStorage.getItem("lineUser");
    if (!data) return null;

    const user = JSON.parse(data);
    if (!user.userId || !user.phoneNumber) return null;

    return user;
  } catch (err) {
    console.error("Failed to parse lineUser from localStorage", err);
    return null;
  }
}

export function getUserId() {
  const user = getStoredUser();
  return user?.userId || null;
}

export function getPhoneNumber() {
  const user = getStoredUser();
  return user?.phoneNumber || null;
}

export function getToken() {
  return localStorage.getItem("jwtToken") || null;
}
// บันทึกข้อมูล user ลง localStorage
export function saveUserData(user) {
  if (user && typeof user === "object") {
    localStorage.setItem("lineUser", JSON.stringify(user));
  }
}


export function saveToken(token) {
  localStorage.setItem("jwtToken", token);
}

export function clearAuthData() {
  localStorage.removeItem("lineUser");
  localStorage.removeItem("jwtToken");
  sessionStorage.removeItem("line_code_used");
}

