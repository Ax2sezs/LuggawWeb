// pages/EditReward.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import RewardForm from "./RewardForm";
import toast from "react-hot-toast";


export default function RewardManagement() {
    const { rewardId } = useParams();
    const navigate = useNavigate();
    const { fetchRewardById, updateReward } = useAdmin();
    const [rewardData, setRewardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReward = async () => {
            try {
                console.log("Fetching reward:", rewardId); // ✅ debug ดู
                const data = await fetchRewardById(rewardId);
                console.log("Fetched reward data:", data); // ✅ debug ดู
                setRewardData({
                    name: data.rewardName || "",
                    coin: data.pointsRequired || "",
                    description: data.description || "",
                    couponCode: data.couponCode || "",
                    startDate: data.startDate ? data.startDate.slice(0, 16) : "",   // แปลงตัดมาแค่ 16 ตัวแรก "YYYY-MM-DDTHH:mm"
                    endDate: data.endDate ? data.endDate.slice(0, 16) : "",
                    imageUrl: data.imageUrl,
                });

            } catch (err) {
                console.error("Error loading reward:", err);
            } finally {
                setLoading(false);
            }
        };
        loadReward();
    }, [rewardId]);


    const handleSave = async (formData) => {
        const data = new FormData();
        data.append("rewardName", formData.name);
        data.append("pointsRequired", formData.coin);
        data.append("description", formData.description);
        data.append("couponCode", formData.couponCode);
        if (formData.startDate) data.append("startDate", formData.startDate);
        if (formData.endDate) data.append("endDate", formData.endDate);
        if (formData.imageFile) data.append("imageFile", formData.imageFile);
        toast.success('แก้ไข Reward สำเร็จ')
        await updateReward(rewardId, data);
        navigate("/admin/reward");
    };




    return (
        <div className="p-6 text-black">
            <h1 className="text-2xl font-bold mb-4">
                Detail: {rewardData?.name || "Reward"}
            </h1>
            {loading ? (
                <p>กำลังโหลดข้อมูล...</p>
            ) : (
                <RewardForm
                    initialData={rewardData}
                    onSave={handleSave}
                    onCancel={() => navigate("/admin/reward")}
                />
            )}
        </div>
    );
}
