// pages/admin/FeedForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";
import { XCircle } from "lucide-react";
import toast from "react-hot-toast";


export default function CreateFeedForm() {
    const { feedId } = useParams(); // ถ้ามีแสดงว่าเป็น Edit
    const navigate = useNavigate();
    const { createFeed, updateFeed, fetchFeedById, deleteFeedImage, loading } = useAdmin();

    const isEdit = !!feedId;

    const [form, setForm] = useState({
        title: "",
        content: "",
        imageFiles: [],
        imagePreviews: [],
        imageUrls: []

    });

    // ดึงข้อมูลเดิมมาใส่ตอนแก้ไข
    useEffect(() => {
        if (isEdit) {
            const load = async () => {
                try {
                    const data = await fetchFeedById(feedId);
                    setForm({
                        title: data.title || "",
                        content: data.content || "",
                        imageFiles: [],
                        imagePreviews: data.imageUrls?.map(i => i.url) || [],
                        imageUrls: data.imageUrls || [], // ถ้าใช้แยก list เก็บของเดิม
                    });
                } catch (err) {
                    alert("โหลดข้อมูล feed ไม่สำเร็จ");
                }
            };
            load();
        }
    }, [feedId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const remainingSlots = 6 - form.imagePreviews.length;

        if (remainingSlots <= 0) {
            alert("คุณอัปโหลดครบ 6 รูปแล้ว");
            e.target.value = null;
            return;
        }

        const limitedFiles = newFiles.slice(0, remainingSlots);

        setForm((prev) => ({
            ...prev,
            imageFiles: [...prev.imageFiles, ...limitedFiles],
            imagePreviews: [
                ...prev.imagePreviews,
                ...limitedFiles.map((file) => URL.createObjectURL(file)),
            ],
        }));

        e.target.value = null;
    };

    const handleRemoveImage = async (index) => {
        // ถ้าเป็นรูปเก่า (index น้อยกว่า imageUrls.length)
        if (index < form.imageUrls.length) {
            const imageToDelete = form.imageUrls[index];
            // สมมติ imageToDelete มี id หรือ url ที่ต้องส่งลบ
            try {
                await deleteFeedImage(imageToDelete.id); // หรือใช้ฟิลด์ id จริงที่มี
                toast.success("ลบรูปจากฐานข้อมูลสำเร็จ");
            } catch (error) {
                alert("ลบรูปจากฐานข้อมูลไม่สำเร็จ");
                return; // ถ้าลบไม่สำเร็จให้หยุด ไม่ลบจาก state
            }
        }

        // ลบรูปออกจาก state
        setForm((prev) => {
            const newPreviews = [...prev.imagePreviews];
            const newUrls = [...prev.imageUrls];
            const newFiles = [...prev.imageFiles];

            newPreviews.splice(index, 1);
            if (index < newUrls.length) {
                newUrls.splice(index, 1);
            } else {
                // รูปใหม่ index ใน imageFiles ต้องลบ index ลบที่หักด้วย offset
                const newFileIndex = index - newUrls.length;
                newFiles.splice(newFileIndex, 1);
            }

            return {
                ...prev,
                imagePreviews: newPreviews,
                imageUrls: newUrls,
                imageFiles: newFiles,
            };
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Title", form.title);
        formData.append("Content", form.content);
        form.imageFiles.forEach((file) => {
            formData.append("Images", file);
        });

        try {
            if (isEdit) {
                await updateFeed(feedId, formData);
                toast.success("แก้ไข Feed สำเร็จ");
            } else {
                await createFeed(formData);
                toast.success("สร้าง Feed สำเร็จ");
            }
            navigate("/admin/feed");
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดขณะบันทึก");
        }
    };

    return (
        <div className="flex justify-center ">
            <form onSubmit={handleSubmit} className="space-y-4 text-black mx-auto">
                <h1 className="text-xl font-bold">{isEdit ? "Edit Feed" : "Create Feed"}</h1>

                <div className="flex flex-col">
                    <label>Feed Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        rows={4}
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label>Images (Max 6)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="file-input bg-white mb-2 border border-black"
                    />
                    <div className="grid grid-cols-3 gap-4 w-full mt-5">
                        {form.imagePreviews.map((previewUrl, index) => (
                            <div key={index} className="relative w-64 h-64 border rounded overflow-hidden">
                                <img src={previewUrl} alt={`preview-${index}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="rounded-full bg-white absolute top-1 right-1 cursor-pointer hover:scale-105"
                                >
                                    <XCircle color="red" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/feed")}
                        className="btn btn-sm btn-error"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-success">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
