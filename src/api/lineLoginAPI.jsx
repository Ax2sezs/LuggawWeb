import api from "./api";

// export const getProfileFromToken = () => {
//   return api.get("LineLogin/me");
// };

export const checkUserProfile = () => {
  return api.get("LineLogin/check-profile"); // ไม่ต้องส่ง param แล้ว
};


export const submitUserProfile = (data) => {
  return api.post("LineLogin/complete-profile", data);
};

export const handleLineCallback = (code) => {
  return api.get("LineLogin/callback", {
    params: { code },
  });
};

// export const getUserPoints = (userId) => {
//   return api.get(`LineLogin/users/${userId}/points`);
// };
export const getUserPoints = () => {
  return api.get("Points/points") 
}

export const updatePhoneNumber = (data) => {
  return api.post("LineLogin/edit-phone",data)
}
