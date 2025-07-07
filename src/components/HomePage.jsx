import React, { useEffect, useRef, useCallback } from "react";
import UserFeed from "./UserFeed";
import useUserFeeds from "../hooks/useUserFeeds";
import { motion } from "framer-motion";

export default function HomePage() {
  const { feeds, loading, error, setPage, toggle, hasMore } = useUserFeeds();

  const loadMoreRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, setPage, hasMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver]);

  if (loading && feeds.length === 0)
    return (
      <motion.div
        className="text-center text-main-green mt-8 font-semibold"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div>
          <img src="./loading.gif" alt="loading" />
        </div>
        Loading ...
      </motion.div>
    );

  return (
    <>
      <div className="font-[Itim] min-h-screen flex flex-col gap-8">
        <section
          id="feed"
          className="bg-white md:px-20 py-5 md:py-16 md:mx-20 shadow-lg mx-auto"
        >
          <div className="w-full -mt-8">
            <UserFeed feeds={feeds} loading={loading} error={error} toggle={toggle} />
          </div>

          {/* Trigger ที่สังเกตดูว่าเลื่อนถึงหรือยัง */}
          <div ref={loadMoreRef} style={{ height: "20px" }} />

          {loading && feeds.length > 0 && (
            <div className="text-center mt-4">
              <img src="./loading.gif" alt="loading" className="mx-auto" />
              กำลังโหลดเพิ่มเติม...
            </div>
          )}

          {!hasMore && (
            <div className="">
              <img src="act luggaw.png"/>
            </div>
          )}
        </section>
      </div>

      {error && (
        <div className="text-center text-red-600 font-semibold mt-8">
          Error: {error.message || "เกิดข้อผิดพลาด"}
        </div>
      )}

      {/* <footer id="contact" className="rounded-t-4xl">
        <img src="./footer.png" />
      </footer> */}
    </>
  );
}
