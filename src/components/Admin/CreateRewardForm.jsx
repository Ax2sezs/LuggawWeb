import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import { Dices, Pencil } from "lucide-react";
import useAdmin from "../../hooks/useAdmin";
import toast from "react-hot-toast";


export default function CreateRewardForm({ initialData, onCancel, onSave }) {
    const navigate = useNavigate();
    const { createReward, fetchCategory, cate, fetchCategoryCode, loading } = useAdmin();

    const [form, setForm] = useState({
        rewardName: "",
        coin: 0,
        description: "",
        couponCode: "",
        startDate: "",
        endDate: "",
        imageFile: null,
        imagePreview: "",
        categoryId: "",
        rewardType: "0"
    });

    useEffect(() => {
        fetchCategory(); // 👈 โหลด categories
    }, []);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                coin: initialData.coin || 0,
                description: initialData.description || "",
                couponCode: initialData.couponCode || "",
                startDate: initialData.startDate
                    ? initialData.startDate.slice(0, 16)
                    : "",
                endDate: initialData.endDate ? initialData.endDate.slice(0, 16) : "",
                imageFile: null,
                imagePreview: initialData.imageUrl || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerateCode = async () => {
        if (!form.categoryId) {
            toast.error("กรุณาเลือกหมวดหมู่ก่อน", {
                position: "top-center"
            });
            return;
        }

        const selectedCategory = cate.find(c => c.id === Number(form.categoryId));
        if (!selectedCategory) {
            alert("หมวดหมู่ไม่ถูกต้อง");
            return;
        }

        try {
            const code = await fetchCategoryCode(selectedCategory.code);
            setForm(prev => ({ ...prev, couponCode: code }));
        } catch {
            alert("เกิดข้อผิดพลาดในการสุ่มรหัส");
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("RewardName", form.rewardName);
        formData.append("PointsRequired", form.coin);
        formData.append("Description", form.description);
        formData.append("StartDate", form.startDate);
        formData.append("EndDate", form.endDate);
        formData.append("IsActive", true);
        formData.append("CategoryId", form.categoryId);
        formData.append("RewardType", form.rewardType);
        formData.append("DiscountMin", form.discountMin || 0);
        formData.append("DiscountMax", form.discountMax || 0);
        formData.append("DiscountPercent", form.discountPercent || 0);
        formData.append("DiscountType", form.discountType || 1);
        formData.append("CouponCode", form.couponCode);

        if (form.imageFile) {
            formData.append("Image", form.imageFile);
        }

        try {
            await createReward(formData);
            toast.success("สร้างรางวัลสำเร็จ");
            navigate("/admin/reward");

        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด");
        }
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-black max-w-3xl mx-auto">
            <div className="flex justify-between w-full">
                <div className="relative w-52 h-52 bg-gray-200 rounded overflow-hidden">
                    {form.imagePreview ? (
                        <img
                            src={form.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                            No Image
                        </div>
                    )}
                    {/* ปุ่มแก้ไขรูป */}
                    <label className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-200 transition">
                        <Pencil size={20} className="text-gray-600" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
                {form.couponCode && (
                    <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Coupon Barcode
                        </label>
                        <Barcode value={form.couponCode} />
                    </div>
                )}
            </div>
            <div className="flex flex-row gap-5">
                <div className="w-1/3">
                    <label htmlFor="categoryId">Category</label>
                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">-- เลือกประเภท --</option>
                        {cate.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.code})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col w-1/3">
                    <span>Code</span>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="rewardName"
                            value={form.couponCode}
                            onChange={handleChange}
                            placeholder="Code"
                            className="w-full p-2 border rounded"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleGenerateCode}
                            className="btn btn-outline"
                        >
                            <Dices />
                            Generate Code
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-1/3">
                    <label htmlFor="rewardType">Reward Type</label>
                    <select
                        name="rewardType"
                        value={form.rewardType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="0">General</option>
                        <option value="1">BirthDay</option>
                        <option value="2">Exclusive</option>
                    </select>
                </div>



            </div>

            <div className="flex w-full gap-5">
                <div className="flex flex-col w-2/3">
                    <span>Coupon Name</span>
                    <input
                        type="text"
                        name="rewardName"
                        value={form.rewardName}
                        onChange={handleChange}
                        placeholder="Reward Name"
                        className="w-full p-2 border rounded"
                        required
                    />

                </div>
                <div className="flex flex-col w-1/3">
                    <span>Points</span>
                    <input
                        type="number"
                        name="coin"
                        value={form.coin}
                        onChange={handleChange}
                        placeholder="Coin"
                        className="w-full p-2 border rounded"
                        min={0}
                        required
                    />
                </div>

            </div>
            <div className="flex flex-col">
                <span>Description</span>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    rows={4}
                />
            </div>

            <div className="flex justify-between gap-5">
                <div className="flex flex-col w-1/2">
                    <span>Start Date</span>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-[linear-gradient(to_left,_#194829_10%,_white_10%)]"
                        required
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <span>End Date</span>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-[linear-gradient(to_left,_#194829_10%,_white_10%)]"
                        required
                    />
                </div>
            </div>
            <div className="flex gap-5">
                <div className="flex flex-col">
                    <span className="">Discount Min</span>
                    <input
                        className="input border border-black bg-white"
                        type="number"
                        name="discountMin"
                        value={form.discountMin}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="">Discount Max</span>
                    <input
                        className="input border border-black bg-white"
                        type="number"
                        name="discountMax"
                        value={form.discountMax}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="">Discount Percent %</span>
                    <input
                        className="input border border-black bg-white"
                        type="number"
                        name="discountPercent"
                        value={form.discountPercent}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="">Discount Type</span>
                    <select
                        className="select border border-black bg-white"
                        name="discountType"
                        value={form.discountType}
                        onChange={handleChange}
                    >
                        <option value={1}>ลดทั้งบิล</option>
                        <option value={0}>ลดชิ้นเดียว</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => navigate("/admin/reward")}
                    className="btn btn-sm btn-error">
                    Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-success">
                    Save
                </button>
            </div>
        </form>
    );
}
