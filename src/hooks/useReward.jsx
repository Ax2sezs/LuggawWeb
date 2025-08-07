// // src/hooks/useReward.jsx
// import { useEffect, useState } from "react";
// import {
//   getAvailableRewards,
//   redeemReward,
// } from "../api/rewardAPI";

// export function useReward(onRedeemSuccess) {
//   const [rewards, setRewards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [resolvedUserId, setResolvedUserId] = useState(null);

//   // ดึง userId จาก localStorage ถ้าไม่ส่งมา
//   // useEffect(() => {
//   //   if (!userId) {
//   //     const storedUser = localStorage.getItem("lineUser");
//   //     if (storedUser) {
//   //       try {
//   //         const user = JSON.parse(storedUser);
//   //         if (user?.userId) {
//   //           setResolvedUserId(user.userId);
//   //         } else {
//   //           setError("User ID not found in localStorage");
//   //           setLoading(false);
//   //         }
//   //       } catch {
//   //         setError("Failed to parse user data");
//   //         setLoading(false);
//   //       }
//   //     } else {
//   //       setError("No user data in localStorage");
//   //       setLoading(false);
//   //     }
//   //   }
//   // }, [userId]);

//   // โหลด rewards เมื่อ resolvedUserId พร้อม
//   useEffect(() => {
//     if (resolvedUserId) {
//       fetchRewards(resolvedUserId);
//     }
//   }, [resolvedUserId]);

//   const fetchRewards = async (uid) => {
//     try {
//       const res = await getAvailableRewards(uid);
//       setRewards(res.data);
//     } catch (err) {
//       setError(err.message || "Error fetching available rewards");
//     } finally {
//       setLoading(false);
//     }
//   };

//    const handleRedeem = async (rewardId) => {
//     if (!resolvedUserId) {
//       throw new Error("No user ID available");
//     }
  
//     try {
//       await redeemReward({ rewardId });
//       await fetchRewards(resolvedUserId);
      
//       if (onRedeemSuccess) {
//         onRedeemSuccess();  // แจ้ง callback ว่าแลกสำเร็จ
//       }
//     } catch (err) {
//       throw new Error(err.response?.data?.message || err.message || "Redeem failed");
//     }
//   };

//   return { rewards, loading, error, handleRedeem };
// }


// src/hooks/useReward.jsx
import { useEffect, useState } from "react";
import {
  getAvailableRewards,
  redeemReward,
} from "../api/rewardAPI";

export function useReward(onRedeemSuccess) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await getAvailableRewards();
      setRewards(res.data);
    } catch (err) {
      setError(err.message || "Error fetching available rewards");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId) => {
    try {
      await redeemReward({ rewardId });
      await fetchRewards();

      if (onRedeemSuccess) {
        onRedeemSuccess();
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.message || "Redeem failed"
      );
    }
  };

  return { rewards, loading, error, handleRedeem };
}
