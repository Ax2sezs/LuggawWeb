import { useState, useEffect } from "react";
import Barcode from "react-barcode";
import { Pencil } from "lucide-react";
import { getFullImageUrl } from "../../utils/getFullImageUrl";

export default function RewardForm({ initialData, onCancel, onSave }) {
    const [form, setForm] = useState({
        name: "",
        coin: 0,
        description: "",
        couponCode: "",
        startDate: "",
        endDate: "",
        imageFile: null,
        imagePreview: "",
        rewardType: "",
        discountMax: "",
        discountMin: "",
        discountPercent: "",
        discountType: "",
        rewardCode: ""

    });

    useEffect(() => {
            console.log("initialData:", initialData);

        if (initialData) {
            setForm({
                name: initialData.name || "",
                coin: initialData.coin || 0,
                description: initialData.description || "",
                couponCode: initialData.couponCode || "",
                startDate: initialData.startDate ? initialData.startDate.slice(0, 16) : "", // ตัด 16 ตัว = YYYY-MM-DDTHH:mm
                endDate: initialData.endDate ? initialData.endDate.slice(0, 16) : "",
                imageFile: null,
                imagePreview: initialData.imageUrl || "",
                rewardType: initialData.rewardType || "",
                discountMin: initialData.discountMin || "",
                discountMax: initialData.discountMax || "",
                discountPercent: initialData.discountPercent || "",
                discountType: initialData.discountType || "",
                rewardCode: initialData.rewardCode || ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({
                ...prev,
                imageFile: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div className="flex justify-between w-full">
                <div className="relative w-52 h-52 bg-red-500">
                    {form.imagePreview && (
                        <img
                            src={getFullImageUrl(form.imagePreview)}
                            alt="Preview"
                            className="w-full h-full object-cover rounded"
                        />
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Barcode</label>
                        <Barcode value={form.couponCode} />
                    </div>
                )}
            </div>
            <div className="flex w-full gap-5">
                <div className="flex flex-col w-2/3">
                    <span className="">Coupon Name</span>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Reward Name"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex flex-col w-1/3">
                    <span className="">Points</span>
                    <input
                        type="number"
                        name="coin"
                        value={form.coin}
                        onChange={handleChange}
                        placeholder="Coin"
                        className="w-full p-2 border rounded"
                    />
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
                <div className="flex flex-col w-1/3">
                    <span className="">Coupon Code</span>
                    <input
                        type="text"
                        name="couponCode"
                        value={form.couponCode}
                        onChange={handleChange}
                        placeholder="Coupon Code"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex flex-col w-1/3">
                    <label htmlFor="rewardCode">Channel Code</label>
                    <input
                        type="text"
                        name="rewardCode"
                        value={form.rewardCode}
                        onChange={handleChange}
                        placeholder="Channel Code"
                        className="w-full p-2 border rounded"

                    />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="">Description</span>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded h-40"
                />
            </div>

            <div className="flex justify-between gap-5">
                <div className="flex flex-col w-1/2">
                    <span className="">StartDate</span>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-[linear-gradient(to_left,_#194829_10%,_white_10%)]"
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <span className="">EndDate</span>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-[linear-gradient(to_left,_#194829_10%,_white_10%)]"
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
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-sm btn-error"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-sm btn-success"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
