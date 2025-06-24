// AdminFeedManage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import useAdmin from "../../hooks/useAdmin";
import FilterBar from "../FilterBar";
import Pagination from "../Pagination";
import AdminTable from "./AdminTable";
import Loading from "../Loading";

export default function AdminFeedManage() {
    const {
        feeds,
        pageSize,
        feedPage,
        toggleFeedStatus,
        fetchFeeds,
        feedTotalPages,
        setFeedPage,
        loading,
        feedFilter,
        setFeedFilter,
        setIsActive,
        isActive,
    } = useAdmin();

    const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeeds();
    }, [feedPage, pageSize, feedFilter, isActive]);

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            } else {
                return {
                    key,
                    direction: "asc",
                };
            }
        });
    };

    const sortedFeeds = useMemo(() => {
        if (!feeds) return [];
        const sorted = [...feeds];
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
    }, [feeds, sortConfig]);

    const filteredFeeds = useMemo(() => {
        return sortedFeeds.filter((item) => {
            const matchSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === null ? true : item.isActive === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [sortedFeeds, searchTerm, statusFilter]);

    const columns = [
        {
            header: "#",
            key: "index",
            render: (_, i) => i + 1 + (feedPage - 1) * pageSize,
        },
        {
            header: "Image",
            key: "image",
            render: (feed) =>
                feed.imageUrls?.[0]?.url ? (
                    <img src={feed.imageUrls[0].url} className="h-24 w-24 object-cover rounded" />
                ) : (
                    <div className="h-24 w-24 bg-gray-200 flex items-center justify-center rounded text-gray-400">No Image</div>
                ),
        },
        {
            header: "Title",
            key: "title",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
        },
        {
            header: "Created At",
            key: "createdAt",
            sortable: true,
            onSort: handleSort,
            sortState: sortConfig,
            render: (feed) => new Date(feed.createdAt).toLocaleDateString("th-TH"),
        },
        {
            header: "Status",
            key: "isActive",
            render: (feed) => (
                <label className="flex flex-col items-center justify-center cursor-pointer space-x-2">
                    <input
                        type="checkbox"
                        className="toggle toggle-lg bg-gray-400 checked:bg-green-300"
                        checked={feed.isActive}
                        onChange={() => toggleFeedStatus(feed.feedId, feed.isActive)}
                    />
                    <span>{feed.isActive ? "Active" : "Inactive"}</span>
                </label>
            ),
        },
        {
            header: "Edit",
            key: "edit",
            render: (feed) => (
                <button
                    onClick={() => navigate(`/admin/feed/edit/${feed.feedId}`)}
                    className="btn btn-sm btn-outline btn-base flex items-center gap-1"
                >
                    <Pencil size={16} /> Edit
                </button>
            ),
        },
    ];

    return (
        <div className="overflow-x-auto rounded-box border">
            <div className="w-full">
                <FilterBar
                    label={'Feed Management'}
                    filter={feedFilter}
                    setFilter={setFeedFilter}
                    setPage={setFeedPage}
                    setIsActive={setIsActive}
                    onCreate={() => navigate("/admin/feed/create")}
                    btnName={'+ Add Feed'}
                />
            </div>

            <div className="border border-gray-300 my-2"></div>

            {loading ? <Loading /> : <AdminTable columns={columns} data={filteredFeeds} />}

            <Pagination
                currentPage={feedPage}
                totalPages={feedTotalPages}
                onPageChange={setFeedPage}
                loading={loading}
            />
        </div>
    );
}
