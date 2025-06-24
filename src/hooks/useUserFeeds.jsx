import { useEffect, useState } from "react";
import { getUserFeed, toggleLike } from "../api/feedAPI";

const useUserFeeds = (pageSize = 5) => {
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      if (!hasMore && page !== 1) return; // ถ้าหมดข้อมูลแล้ว ไม่ต้องโหลดเพิ่ม

      setLoading(true);
      setError(null);
      try {
        const res = await getUserFeed(page, pageSize);
        const newFeeds = res.data.items || [];

        setFeeds((prev) => {
          if (page === 1) {
            return newFeeds; // โหลดใหม่ทั้งหมด
          } else {
            return [...prev, ...newFeeds];
          }
        });

        // ถ้าของใหม่ที่ได้ น้อยกว่า pageSize แสดงว่าหมดแล้ว
        setHasMore(newFeeds.length === pageSize);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, [page, pageSize, hasMore]);

  const toggle = async (feedId) => {
    // อัปเดต UI ก่อน
    setFeeds((prevFeeds) =>
      prevFeeds.map((feed) =>
        feed.feedId === feedId
          ? {
              ...feed,
              isLiked: !feed.isLiked,
              likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
            }
          : feed
      )
    );

    try {
      await toggleLike(feedId);
    } catch (err) {
      // rollback
      setFeeds((prevFeeds) =>
        prevFeeds.map((feed) =>
          feed.feedId === feedId
            ? {
                ...feed,
                isLiked: !feed.isLiked,
                likeCount: feed.isLiked ? feed.likeCount - 1 : feed.likeCount + 1,
              }
            : feed
        )
      );
      setError(err);
    }
  };

  // รีเซ็ตหน้า (ถ้าอยากใช้กับ filter หรือ reload)
  const reset = () => {
    setPage(1);
    setHasMore(true);
  };

  return {
    feeds,
    loading,
    error,
    hasMore,
    setPage,
    toggle,
    reset,
  };
};

export default useUserFeeds;
