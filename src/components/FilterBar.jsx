// components/RewardFilterBar.jsx
import React from "react";

export default function RewardFilterBar({ filter, setFilter, setPage, setIsActive, onCreate, btnName,label }) {
    return (
        <div className="flex justify-between items-center mb-4 text-black gap-5 w-full">
            <h1 className="text-2xl font-bold">{label}</h1>

            <div className="flex gap-5 justify-end w-1/2">
                <input
                    type="text"
                    placeholder="ค้นหา"
                    value={filter.searchTerm}
                    onChange={(e) => {
                        setPage(1);
                        setFilter(e.target.value);
                    }}
                    className="input border-black bg-white rounded px-3 py-2 w-2/3"
                />

                <select
                    value={filter.isActive === null ? "" : filter.isActive}
                    onChange={(e) => {
                        setPage(1);
                        setIsActive(e.target.value === "" ? null : e.target.value === "true");
                    }}
                    className="select select-neutral bg-white w-1/3"
                >
                    <option value="">ทั้งหมด</option>
                    <option value="true">🟢 Active</option>
                    <option value="false">🔴 Inactive</option>
                </select>
            </div>

            <button onClick={onCreate} className="btn btn-success">
                {btnName}
            </button>
        </div>
    );
}
