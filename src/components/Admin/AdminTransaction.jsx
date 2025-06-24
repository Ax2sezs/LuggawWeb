// AdminTransaction.jsx
import { useEffect, useMemo, useState } from "react";
import useAdmin from "../../hooks/useAdmin";
import Pagination from "../Pagination";
import Loading from "../Loading";
import AdminTable from "./AdminTable";

export default function AdminTransaction() {
    const {
        transaction,
        transactionPage,
        transactionTotalPage,
        setTransactionPage,
        transactionFilter,
        setTransactionFilter,
        fetchTransaction,
        pageSize,
        loading,
    } = useAdmin();

    const [sortConfig, setSortConfig] = useState({ key: "transactionDate", direction: "desc" });

    useEffect(() => {
        fetchTransaction();
    }, [transactionPage, transactionFilter]);

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
        if (!transaction) return [];
        const sorted = [...transaction];
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
    }, [transaction, sortConfig]);

    const handleInputChange = (field, value) => {
        setTransactionPage(1);
        setTransactionFilter((prev) => ({ ...prev, [field]: value }));
    };

    const columns = [
        {
            header: "#",
            key: "index",
            render: (_, i) => i + 1 + (transactionPage - 1) * pageSize,
        },
        {
            header: "วันที่",
            key: "transactionDate",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
            render: (tx) => new Date(tx.transactionDate).toLocaleString("th-TH"),
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
            header: "Points",
            key: "points",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
            render: (tx) => (
                <span className={tx.points < 0 ? "text-red-600" : "text-green-600"}>{tx.points}</span>
            ),
        },
        {
            header: "ประเภท",
            key: "transactionType",
            render: (tx) => {
                const isRedeem = tx.transactionType?.toLowerCase() === "redeem";
                const color = isRedeem ? "badge-error" : "badge-success";
                const label = isRedeem ? "Redeem" : "Earn";

                return <span className={`badge ${color} w-2/3 text-white`}>{label}</span>;
            },
        },

        {
            header: "คำอธิบาย",
            key: "description",
        },
    ];

    return (
        <div className="overflow-x-auto rounded-box">
            {/* 🔍 Transaction Filter */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4 text-black">
                <h1 className="text-2xl font-bold">Transaction Management</h1>
                <button className="btn" onClick={fetchTransaction}>Fetch</button>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
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
                        value={transactionFilter.transactionType || ""}
                        onChange={(e) => handleInputChange("transactionType", e.target.value)}
                        className="select border-black bg-white w-full"
                    >
                        <option value="">ประเภททั้งหมด</option>
                        <option value="Earn">🟢 Earn</option>
                        <option value="Redeem">🔴 Redeem</option>
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
                </div>
            </div>

            <div className="border border-gray-300 my-2" />

            {loading ? (
                <Loading />
            ) : (
                <AdminTable columns={columns} data={sortedTransactions} />
            )}

            <Pagination
                currentPage={transactionPage}
                totalPages={transactionTotalPage}
                onPageChange={setTransactionPage}
                loading={loading}
            />
        </div>
    );
}
