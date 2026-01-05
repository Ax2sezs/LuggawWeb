// AdminRewardUsers.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import AdminTable from "./AdminTable";
import Loading from "../Loading";
import useAdmin from "../../hooks/useAdmin";
import Pagination from "../Pagination";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminRewardUsers() {
    const { rewardId } = useParams();
    const location = useLocation();
    const rewardName = location.state?.rewardName || "Loading...";
    const {
        fetchUserReward,
        userReward,
        userRewardTotalPages,
        userRewardPage,
        userRewardFilter,
        setUserRewardFilter,
        pageSize,
        loading,
        usedCount,
        total,
        setUserRewardPage,
        setIsUsed,
        isUsed,
        couponCode,
        setCouponCode,
        revertStatus,
    } = useAdmin();

    const [sortConfig, setSortConfig] = useState({
        key: "redeemedDate",
        direction: "desc",
    });
    // console.log("Count", usedCount)
    useEffect(() => {
        if (!rewardId) return;
        fetchUserReward(rewardId, userRewardPage, pageSize, userRewardFilter, isUsed, couponCode);
    }, [rewardId, userRewardPage, pageSize, userRewardFilter, userRewardFilter, isUsed, couponCode]);

    const handlePhoneFilterChange = (e) => {
        setUserRewardFilter(e.target.value);
        setUserRewardPage(1);
    };

    const handleCouponCodeChange = (e) => {
        setCouponCode(e.target.value);
        setUserRewardPage(1);
    };


    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedUsers = useMemo(() => {
        if (!userReward) return [];
        const sorted = [...userReward];
        sorted.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (sortConfig.key.toLowerCase().includes("date")) {
                aVal = aVal ? new Date(aVal).getTime() : 0;
                bVal = bVal ? new Date(bVal).getTime() : 0;
            }

            if (aVal === undefined || aVal === null) return 1;
            if (bVal === undefined || bVal === null) return -1;

            if (typeof aVal === "string") {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [userReward, sortConfig]);
    // state สำหรับ modal
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        couponCode: null
    });

    const handleConfirmRevert = (couponCode) => {
        setConfirmDialog({ open: true, couponCode });
    };

    const handleDialogClose = () => {
        setConfirmDialog({ open: false, couponCode: null });
    };

    const handleDialogConfirm = async () => {
        await revertStatus(confirmDialog.couponCode);
        toast.success("เปลี่ยน Status สำเร็จ")
        handleDialogClose();
    };



    const columns = [
        {
            header: "#",
            key: "index",
            render: (_, i) => i + 1 + (userRewardPage - 1) * pageSize,
        },
        {
            header: "First Name",
            key: "firstName",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
        },
        {
            header: "Last Name",
            key: "lastName",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
        },
        {
            header: "Phone Number",
            key: "phoneNumber",
        },
        {
            header: "Redeemed Date",
            key: "redeemedDate",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
            render: (row) =>
                row.redeemedDate
                    ? new Date(row.redeemedDate).toLocaleString("th-TH")
                    : "-",
        },
        {
            header: "Status",
            key: "isUsed",
            render: (row) => {
                if (row.isUsed) {
                    return (
                        <button
                            onClick={() => handleConfirmRevert(row.couponCode)}
                            className="badge badge-error w-2/3 text-white cursor-pointer hover:opacity-80"
                            title="Mark as Not Used"
                        >
                            Used
                        </button>
                    );
                }
                return (
                    <span
                        className="badge badge-success w-2/3 text-white opacity-70 cursor-not-allowed"
                        title="ยังไม่ถูกใช้"
                    >
                        Not Used
                    </span>
                );
            }

        },
        {
            header: "Used Date",
            key: "usedDate",
            render: (row) =>
                row.usedDate ? new Date(row.usedDate).toLocaleString("th-TH") : "-",
        },
        {
            header: "Coupon Code",
            key: "couponCode",
        },
        {
            header: "BranchCode",
            key: "usedAt"
        }
    ];

    return (
        <div className="overflow-x-auto rounded-box border">
            <div className='flex justify-between w-full mb-4'>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-black">Reward : {rewardName}</h2>
                    <div className="flex gap-3">
                        <div className="badge bg-blue-500 border-hidden">Total Redeemed : {total}</div>
                        <div className="badge bg-red-400 border-hidden ">Used : {usedCount}</div>
                        <div className="badge bg-green-500 border-hidden ">Not Used : {total - usedCount}</div>
                    </div>
                </div>
                <div className="flex w-1/2 gap-5">
                    <select
                        value={isUsed === null ? "all" : isUsed ? "used" : "notUsed"}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "all") {
                                setIsUsed(null);
                            } else if (value === "used") {
                                setIsUsed(true);
                            } else {
                                setIsUsed(false);
                            }
                            setUserRewardPage(1);
                        }}
                        className="select border border-black bg-white text-black"
                    >
                        <option value="all">All</option>
                        <option value="used">Used</option>
                        <option value="notUsed">Not Used</option>
                    </select>
                    <input
                        type="text"
                        placeholder="ค้นหาเบอร์โทร..."
                        value={userRewardFilter}
                        onChange={handlePhoneFilterChange}
                        className="input bg-white border border-black p-2 w-2/3 rounded mb-4 text-black"
                    />

                    <input
                        type="text"
                        placeholder="ค้นหาคูปอง..."
                        value={couponCode}
                        onChange={handleCouponCodeChange}
                        className="input bg-white border border-black p-2 w-2/3 rounded mb-4 text-black"
                    />

                </div>
            </div>
            <div className="border border-gray-300 my-2" />

            {loading ? (
                <Loading />
            ) : (
                <AdminTable columns={columns} data={sortedUsers} />
            )}

            <Pagination
                currentPage={userRewardPage}
                totalPages={userRewardTotalPages}
                onPageChange={setUserRewardPage}
                loading={loading}
            />
            {/* Dialog */}
            <dialog id="confirmModal" className="modal" open={confirmDialog.open}>
                <div className="modal-box bg-bg text-black rounded-xl">
                    <h3 className="font-bold text-xl mb-4">ยืนยันการเปลี่ยนสถานะ</h3>
                    <p className="mb-6">
                        คุณต้องการเปลี่ยนคูปอง{" "}
                        <span className="font-mono text-green-600">{confirmDialog.couponCode}</span>
                        {" "}ให้เป็น{" "}
                        <span className="font-bold text-green-600">Not Used</span> ใช่หรือไม่?
                    </p>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-3">
                            <button
                                type="button"
                                className="btn opacity-40"
                                onClick={handleDialogClose}
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="button"
                                className="btn btn-error text-white"
                                onClick={handleDialogConfirm}
                            >
                                ยืนยัน
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>


        </div>
    );
}
