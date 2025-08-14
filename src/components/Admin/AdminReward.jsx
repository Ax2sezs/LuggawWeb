// AdminReward.jsx
import { useState, useMemo, useEffect } from "react";
import useAdmin from "../../hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import FilterBar from "../FilterBar";
import Pagination from "../Pagination";
import Loading from "../Loading";
import AdminTable from "./AdminTable";
import { getFullImageUrl } from "../../utils/getFullImageUrl";

export default function AdminReward() {
  const {
    rewards,
    loading,
    createReward,
    toggleRewardStatus,
    rewardFilter,
    setRewardPage,
    setRewardFilter,
    setIsActive,
    isActive,
    rewardPage,
    rewardTotalPages,
    pageSize,
    fetchRewards,
    fetchCategory,
    fetchUserReward,
    cate,
  } = useAdmin();

  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    fetchRewards();
  }, [rewardPage, pageSize, rewardFilter, isActive]);

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

  const sortedRewards = useMemo(() => {
    if (!rewards) return [];
    const sorted = [...rewards];
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
  }, [rewards, sortConfig]);

  const columns = [
    {
      header: "#",
      key: "index",
      render: (_, i) => i + 1 + (rewardPage - 1) * pageSize,
    },
    {
      header: "Image",
      key: "image",
      render: (reward) => (
        <img
          src={getFullImageUrl(reward.imageUrl)}
          alt={reward.rewardName}
          className="h-24 w-24 object-cover rounded"
        />
      ),
    },
    {
      header: "Reward Name",
      key: "rewardName",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
    },
    {
      header: "Coin",
      key: "pointsRequired",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
    },
    {
      header: "Create At",
      key: "createdAt",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
      render: (reward) => new Date(reward.createdAt).toLocaleDateString("th-TH"),
    },
    {
      header: "Start Date",
      key: "startDate",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
      render: (reward) => new Date(reward.startDate).toLocaleDateString("th-TH"),
    },
    {
      header: "End Date",
      key: "endDate",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
      render: (reward) => new Date(reward.endDate).toLocaleDateString("th-TH"),
    },
    {
      header: "Status",
      key: "isActive",
      render: (reward) => (
        <label className="flex flex-col items-center justify-center cursor-pointer space-x-2">
          <input
            type="checkbox"
            className="toggle toggle-lg bg-gray-400 checked:bg-green-300"
            checked={reward.isActive}
            onChange={() => toggleRewardStatus(reward.rewardId, reward.isActive)}
          />
          <span>{reward.isActive ? "Active" : "Inactive"}</span>
        </label>
      ),
    },
    {
      header: "Edit",
      key: "edit",
      render: (reward) => (
        <button
          onClick={() => navigate(`/admin/reward/edit/${reward.rewardId}`)}
          className="btn btn-sm btn-outline btn-base flex items-center gap-1"
        >
          <Pencil size={16} />
          Edit
        </button>
      ),
    },
    {
      header: "Users",
      key: "users",
      render: (reward) => (
        <button
          onClick={() => navigate(`/admin/reward/${reward.rewardId}/users`, {
            state: { rewardName: reward.rewardName }
          })}
          className="btn btn-sm btn-outline"
        >
          Details
        </button>
      ),
    }

  ];

  return (
    <div className="overflow-x-auto rounded-box border">
      <FilterBar
        label={"Reward Management"}
        filter={rewardFilter}
        setFilter={setRewardFilter}
        setPage={setRewardPage}
        setIsActive={setIsActive}
        onCreate={() => navigate("/admin/reward/create")}
        btnName={"+ Add Reward"}
      />

      <div className="border border-gray-300 my-2" />

      {loading ? <Loading /> : <AdminTable columns={columns} data={sortedRewards} />}

      <Pagination
        currentPage={rewardPage}
        totalPages={rewardTotalPages}
        onPageChange={setRewardPage}
        loading={loading}
      />
    </div>
  );
}
