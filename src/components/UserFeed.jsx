import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function UserFeed({ feeds, loading, error, toggle }) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-black gap-6 bg-white">
                {feeds.map((feed) => (
                    <motion.div
                        key={feed.feedId}
                        className="card bg- p-4 flex flex-col border-t-4 border-gray-200"
                    >
                        {feed.imageUrls.length > 0 && (
                            <div className="my-4">
                                {feed.imageUrls.length > 1 ? (
                                    <Swiper
                                        modules={[Pagination]}
                                        pagination={{ clickable: true }}
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        className="rounded-lg mySwiper"
                                    >
                                        {feed.imageUrls.map((img) => (
                                            <SwiperSlide key={`${feed.feedId}-${img.id}`}>
                                                <motion.img
                                                    src={img.url}
                                                    alt="feed"
                                                    className="w-full h-[358px] object-cover rounded-lg"
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <motion.img
                                        src={feed.imageUrls[0].url}
                                        alt="feed"
                                        className="w-full h-[358px] object-cover rounded-lg"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => toggle(feed.feedId)}
                                className="flex items-center gap-1 focus:outline-none"
                                aria-label={feed.isLiked ? "Unlike" : "Like"}
                            >
                                <motion.div
                                    key={feed.isLiked ? "liked" : "unliked"}
                                    initial={{ scale: 0.8, opacity: 0.6 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="cursor-pointer"
                                >
                                    <Heart
                                        fill={feed.isLiked ? "red" : "none"}
                                        className={`transition-colors duration-300 ${feed.isLiked ? "text-red-600" : "text-gray-400"
                                            }`}
                                        size={24}
                                    />
                                </motion.div>
                                <span className="text-sm select-none">{feed.likeCount || "0"}</span>
                            </button>
                        </div>
                        <p className="text-gray-700 text-sm text-start mt-2 max-w-2xl whitespace-pre-line p-2 break-words">
                            {feed.content}
                        </p>
                    </motion.div>
                ))}
            </div>
        </>
    );
}
