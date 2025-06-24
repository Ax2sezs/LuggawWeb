import { useEffect, useState, useCallback } from "react";
import { getRedeemedRewardByUserId } from "../api/rewardAPI";

export function useRedeemedRewards(userId, status = "all", pageSize = 5) {
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedUserId, setResolvedUserId] = useState(userId || null);
  const [totalItem, setTotalItem] = useState('');
  const [page, setPage] = useState(1)
  // ดึง userId จาก localStorage ถ้าไม่ได้ส่งมา
  useEffect(() => {
    if (!userId) {
      const storedUser = localStorage.getItem("lineUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user?.userId) {
            setResolvedUserId(user.userId);
          } else {
            setError("ไม่พบ userId ใน localStorage");
            setLoading(false);
          }
        } catch {
          setError("อ่านข้อมูล user จาก localStorage ไม่สำเร็จ");
          setLoading(false);
        }
      } else {
        setError("ไม่มีข้อมูลผู้ใช้ใน localStorage");
        setLoading(false);
      }
    } else {
      setResolvedUserId(userId);
    }
  }, [userId]);

  // ฟังก์ชันเรียกข้อมูล
  const fetchRewards = useCallback(() => {

    setLoading(true);
    return getRedeemedRewardByUserId(status, page, pageSize)
      .then((res) => {
        const data = res.data;
        setRedeemedRewards(data.items || []);
        setTotalItem(Math.ceil(res.data.totalItems / pageSize));
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
        setRedeemedRewards([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [status, page, pageSize]);

  useEffect(() => {
    if (resolvedUserId) {
      fetchRewards();
    }
  }, [resolvedUserId, status, page, pageSize, fetchRewards]);

  return {
    redeemedRewards,
    loading,
    error,
    totalItem,
    page,
    setPage,
    refetch: fetchRewards,
  };
}
