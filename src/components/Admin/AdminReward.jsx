// AdminReward.jsx
import { useState, useMemo, useEffect } from "react";
import useAdmin from "../../hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { Download, FileUp, Pencil } from "lucide-react";
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
        openExportModal={openExportModal}
        onCreate={() => navigate("/admin/reward/create")}
        btnName={"+ Add Reward"}
        exportBtn={true}

      />

      <div className="border border-gray-300 my-2" />

      {loading ? <Loading /> : <AdminTable columns={columns} data={sortedRewards} />}

      <Pagination
        currentPage={rewardPage}
        totalPages={rewardTotalPages}
        onPageChange={setRewardPage}
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
