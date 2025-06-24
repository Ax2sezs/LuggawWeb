import { useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import useAdmin from "../../hooks/useAdmin";
import { User, Activity, Gift, Coins, Loader2, Heart, Mars, Venus, Transgender } from "lucide-react";

export default function AdminHome() {
    const { data, fetchDashboard, loading } = useAdmin();

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                กำลังโหลดข้อมูล...
            </div>
        );
    }
    console.log("Total Members", data.members.total);
    console.log("Gender Summary", data.genderSummary);


    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <main className="p-8 max-w-7xl mx-auto space-y-12">
                {/* สมาชิก */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <User className="w-6 h-6 text-gray-400" />,
                            label: "สมาชิกทั้งหมด",
                            value: data.members.total,
                            valueColor: "text-gray-900",
                        },
                        {
                            icon: <Activity className="w-6 h-6 text-green-500" />,
                            label: "Active (ภายใน 30 วัน)",
                            value: data.members.active,
                            valueColor: "text-green-600",
                        },
                        {
                            icon: <Activity className="w-6 h-6 text-red-500" />,
                            label: "Inactive",
                            value: data.members.inactive,
                            valueColor: "text-red-600",
                        },
                        {
                            icon: <Mars className="w-6 h-6 text-red-500" />,
                            label: "Male",
                            value: data.genderSummary.male,
                            percent: ((data.genderSummary.male / data.members.total) * 100).toFixed(2),
                            valueColor: "text-red-600",
                        },
                        {
                            icon: <Venus className="w-6 h-6 text-red-500" />,
                            label: "Female",
                            value: data.genderSummary.female,
                            percent: ((data.genderSummary.female / data.members.total) * 100).toFixed(2),
                            valueColor: "text-red-600",
                        },
                        {
                            icon: <Transgender className="w-6 h-6 text-red-500" />,
                            label: "Other",
                            value: data.genderSummary.other,
                            percent: ((data.genderSummary.other / data.members.total) * 100).toFixed(2),
                            valueColor: "text-red-600",
                        },


                    ].map((card, i) => (
                        <MotionSummaryCard
                            key={i}
                            icon={card.icon}
                            label={card.label}
                            value={card.value}
                            valueColor={card.valueColor}
                            percent={card.percent} // ✅ ใส่ตรงนี้
                            index={i}
                        />
                    ))}
                </section>

                {/* แต้ม */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            icon: <Coins className="w-6 h-6 text-blue-500" />,
                            label: "แต้มที่ได้รับทั้งหมด",
                            value: data.points.earned,
                            valueColor: "text-blue-600",
                        },
                        {
                            icon: <Gift className="w-6 h-6 text-orange-500" />,
                            label: "แต้มที่ถูกใช้แลกของรางวัล",
                            value: data.points.redeemed,
                            valueColor: "text-orange-600",
                        },
                    ].map((card, i) => (
                        <MotionSummaryCard
                            key={i}
                            icon={card.icon}
                            label={card.label}
                            value={card.value}
                            valueColor={card.valueColor}
                            index={i}
                        />
                    ))}
                </section>

                {/* ของรางวัล */}
                <section className="bg-white rounded shadow p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Gift className="w-7 h-7 text-purple-500" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Top 3 ของรางวัลที่ถูกแลก
                        </h2>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {data.rewards.top3Redeemed.map((reward, i) => (
                            <motion.li
                                key={reward.rewardId}
                                className="flex justify-between py-4 hover:bg-purple-50 transition-colors rounded-md cursor-pointer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                <span className="font-medium text-gray-700">{reward.rewardName}</span>
                                <span className="font-bold text-gray-800">
                                    <CountUp end={reward.count} duration={1.5} separator="," />
                                    {" "}ครั้ง
                                </span>
                            </motion.li>
                        ))}
                    </ul>
                </section>

                {/* Likes */}
                <section className="bg-white rounded shadow p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Heart className="w-7 h-7 text-pink-500" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Likes ทั้งหมด:{" "}
                            <span className="text-pink-600">
                                <CountUp end={data.likes.totalLikes} duration={1.5} separator="," />
                            </span>
                        </h2>
                    </div>
                    <div className="mb-4 text-lg font-semibold text-gray-700">
                        Top 3 Feeds ที่ถูกกดไลค์มากที่สุด
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {data.likes.top3LikedFeeds.map((feed, i) => (
                            <motion.li
                                key={feed.feedId}
                                className="flex justify-between py-4 hover:bg-pink-50 transition-colors rounded-md cursor-pointer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                <span className="font-medium text-gray-700">
                                    {feed.title || "ไม่มีชื่อ"}
                                </span>
                                <span className="font-bold text-pink-600">
                                    <CountUp end={feed.likeCount} duration={1.5} separator="," /> ไลค์
                                </span>
                            </motion.li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}

function MotionSummaryCard({ icon, label, value, valueColor = "text-gray-900", percent, index }) {
    return (
        <motion.div
            className="bg-white rounded shadow p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow cursor-default"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
        >
            <div className="flex items-center gap-3 text-sm text-gray-500">
                {icon}
                <span>{label}</span>
            </div>
            <div className={`flex items-end justify-between text-4xl font-extrabold ${valueColor}`}>
                <CountUp end={value} duration={1.8} separator="," />
                {percent !== undefined && (
                    <div className="text-lg text-gray-500">
                        {percent}%
                    </div>
                )}
            </div>

        </motion.div>
    );
}

