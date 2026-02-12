// AdminTransaction.jsx
import { useEffect, useMemo, useState } from "react";
import useAdmin from "../../hooks/useAdmin";
import Pagination from "../Pagination";
import Loading from "../Loading";
import AdminTable from "./AdminTable";
import { RefreshCcw,FileUp,Download } from "lucide-react";

export default function AdminRewardTransaction() {
    const {
        rewardTransaction,
        rwTransactionPage,
        rwTransactionTotalPage,
        setRwTransactionPage,
        transactionFilter,
        setTransactionFilter,
        fetchRewardTransaction,
        pageSize,
        loading,
        exportModalOpen,
        exportStartDate,
        exportEndDate,
        setExportStartDate,
        setExportEndDate,
        closeExportModal,
        openExportModal,
        exportRedeemed,
        exportLoading
    } = useAdmin();

    const [sortConfig, setSortConfig] = useState({ key: "transactionDate", direction: "desc" });

    useEffect(() => {
        fetchRewardTransaction();
    }, [rwTransactionPage, transactionFilter]);
    // ✅ กดเปลี่ยน Tab แล้ว set filter

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            } else {
                return { key, direction: "asc" };
            }
        });
    };

    const sortedTransactions = useMemo(() => {
        if (!rewardTransaction) return [];
        const sorted = [...rewardTransaction];
        sorted.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            if (sortConfig.key.toLowerCase().includes("date")) {
                aVal = aVal ? new Date(aVal).getTime() : 0;
                bVal = bVal ? new Date(bVal).getTime() : 0;
            }

            if (typeof aVal === "string") {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [rewardTransaction, sortConfig]);

    const handleInputChange = (field, value) => {
        setRwTransactionPage(1);
        setTransactionFilter((prev) => ({ ...prev, [field]: value }));
    };

    const columns = [
        {
            header: "#",
            key: "index",
            render: (_, i) => i + 1 + (rwTransactionPage - 1) * pageSize,
        },
        {
            header: "วันที่แลก",
            key: "redeemedDate",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
            render: (tx) => new Date(tx.redeemedDate).toLocaleString("th-TH"),
        },
        {
            header: "ชื่อ",
            key: "firstName",
        },
        {
            header: "นามสกุล",
            key: "lastName",
        },
        {
            header: "เบอร์โทร",
            key: "phoneNumber",
        },
        {
            header: "ชื่อรางวัล",
            key: "rewardName",
            render: (tx) => tx.rewardName || "-",
        },
        {
            header: "รหัสรีวอร์ด",
            key: "rewardCode",
            render: (tx) => tx.rewardCode || "-",
        },
        {
            header: "รหัสคูปอง",
            key: "couponCode",
            render: (tx) => tx.couponCode || "-",
        },
        {
            header: "Points",
            key: "pointUsed",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
            render: (tx) => (
                <span className={tx.pointUsed < 0 ? "text-red-600" : "text-green-600"}>{tx.pointUsed}</span>
            ),
        },
        {
            header: "Status",
            key: "status",
            render: (tx) => {
                const isRedeem = tx.status?.toLowerCase() === "used";
                const color = isRedeem ? "badge-error" : "badge-success";
                const label = isRedeem ? "Used" : "Not Used";

                return <span className={`badge ${color} w-2/3 text-white`}>{label}</span>;
            },
        },
        {
            header: "วันหมดอายุ",
            key: "expiredDate",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
            render: (tx) => new Date(tx.expiredDate).toLocaleString("th-TH"),
        },
        {
            header: "วันที่ใช้",
            key: "usedDate",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
            render: (tx) => new Date(tx.usedDate).toLocaleString("th-TH"),
        },
        {
            header: "OrderRef/Code",
            key: "usedAt",
            render: (tx) => {
                if (tx.transactionType?.toLowerCase() === "redeem") {
                    return tx.usedAt || "-";
                }
                return tx.usedAt || "-";
            }
        }

    ];

    return (
        <div className="overflow-x-auto rounded-box">
            {/* 🔍 Transaction Filter */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4 text-black">
                <h1 className="text-2xl font-bold">Transaction Management</h1>

                <div className="flex gap-2 w-full">
                    <input
                        type="text"
                        placeholder="ค้นหาเบอร์โทร"
                        value={transactionFilter.phoneNumber || ""}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        className="input border-black bg-white rounded px-3 py-2 w-full"
                    />

                    <input
                        type="text"
                        placeholder="ชื่อรางวัล"
                        value={transactionFilter.rewardName || ""}
                        onChange={(e) => handleInputChange("rewardName", e.target.value)}
                        className="input border-black bg-white rounded px-3 py-2 w-full"
                    />

                    <select
                        value={
                            transactionFilter.isUsed === true
                                ? "true"
                                : transactionFilter.isUsed === false
                                    ? "false"
                                    : ""
                        }
                        onChange={(e) => {
                            const value = e.target.value;

                            handleInputChange(
                                "isUsed",
                                value === ""
                                    ? undefined
                                    : value === "true"
                            );
                        }}
                        className="select border-black bg-white w-full"
                    >
                        <option value="">ทั้งหมด</option>
                        <option value="true">Used</option>
                        <option value="false">Not Used</option>
                    </select>



                    <input
                        type="date"
                        value={transactionFilter.startDate || ""}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        className="input border-black bg-white rounded px-3 py-2 w-full"
                    />

                    <input
                        type="date"
                        value={transactionFilter.endDate || ""}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        className="input border-black bg-white rounded px-3 py-2 w-full"
                    />
                    <div className="flex w-full gap-2 justify-end">
                        <button className="btn w-1/3 bg-main-orange border-hidden text-white" onClick={fetchRewardTransaction}><RefreshCcw /></button>
                        <button
                            className="btn w-1/3 bg-white border border-main-green text-main-green"
                            onClick={openExportModal}
                        >
                            Export
                        </button>
                    </div>
                </div>
            </div>



            <div className="border border-gray-300 my-2" />

            {loading ? (
                <Loading />
            ) : (
                <AdminTable columns={columns} data={sortedTransactions} />
            )}

            <Pagination
                currentPage={rwTransactionPage}
                totalPages={rwTransactionTotalPage}
                onPageChange={setRwTransactionPage}
                loading={loading}
            />
            {exportModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <h3 className="flex gap-3 text-lg text-main-green font-semibold mb-4">
                            <FileUp />Export Redeemed Rewards
                        </h3>

                        <div className="space-y-3">
                            <label className="text-main-brown">Start Date</label>
                            <input
                                type="date"
                                value={exportStartDate}
                                onChange={(e) => setExportStartDate(e.target.value)}
                                className="w-full border-2 text-main-green rounded-lg px-3 py-2 border-main-orange bg-[linear-gradient(to_left,_#194829_20%,_white_10%)]"
                            />
                            <label className="text-main-brown">End Date</label>

                            <input
                                type="date"
                                value={exportEndDate}
                                onChange={(e) => setExportEndDate(e.target.value)}
                                className="w-full border-2 text-main-green rounded-lg px-3 py-2 border-main-orange bg-[linear-gradient(to_left,_#194829_20%,_white_10%)]"
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={closeExportModal}
                                className="px-4 py-2 rounded-lg border border-main-green text-main-green"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={exportRedeemed}
                                disabled={!exportStartDate || !exportEndDate || exportLoading}
                                className="flex items-center justify-center gap-3 w-24 px-4 py-2 rounded-lg bg-main-green text-white disabled:opacity-50"
                            >
                                {exportLoading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>
                                        <Download size={24} />
                                        Download
                                    </>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
