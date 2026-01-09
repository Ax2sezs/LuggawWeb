import React, { useEffect, useState, useMemo } from 'react';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../../hooks/useAdmin';
import Pagination from '../Pagination';
import Loading from '../Loading';
import AdminTable from './AdminTable';

function AdminUsers() {
  const {
    users,
    loading,
    userPage,
    pageSize,
    userTotalPages,
    isActive,
    setUserPage,
    setSearchTerm,
    setIsActive,
    searchTerm,
    toggleUserStatus,
    toggleUserPolicy,
    fetchUsers
  } = useAdmin();

  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: "userId", direction: "asc" });

  useEffect(() => {
    fetchUsers();
  }, [userPage, pageSize, searchTerm, isActive]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  const sortedUsers = useMemo(() => {
    if (!users) return [];
    const sorted = [...users];
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
  }, [users, sortConfig]);

  const columns = [
    {
      header: "#",
      key: "index",
      render: (_, i) => i + 1 + (userPage - 1) * pageSize,
    },
    {
      header: "Phone",
      key: "phoneNumber",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
    },
    {
      header: "Firstname",
      key: "firstName",
    },
    {
      header: "Lastname",
      key: "lastName",
    },
    {
      header: "Age",
      key: "age",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
    },
    {
      header: "Birth Date",
      key: "birthDate",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
      render: (user) => user.birthDate ? new Date(user.birthDate).toLocaleDateString("th-TH") : "-",
    },
    {
      header: "Gender",
      key: "gender",
    },
    // {
    //   header: "Points",
    //   key: "point",
    //   sortable: true,
    //   onSort: handleSort,
    //   sortState: sortConfig,
    // },
    {
      header: "Created At",
      key: "createdAt",
      sortable: true,
      onSort: handleSort,
      sortState: sortConfig,
      render: (user) => user.createdAt ? new Date(user.createdAt).toLocaleDateString("th-TH") : "-",
    },
    {
      header: "Member Duration",
      key: "memberDuration",
      render: (user) => {
        const createdAtDate = user.createdAt ? new Date(user.createdAt) : null;
        if (!createdAtDate) return "-";

        const now = new Date();
        const years = differenceInYears(now, createdAtDate);
        const months = differenceInMonths(now, createdAtDate) % 12;
        const days = differenceInDays(now, createdAtDate) % 30;

        const parts = [];
        if (years > 0) parts.push(`${years} ปี`);
        if (months > 0) parts.push(`${months} เดือน`);
        if (days > 0) parts.push(`${days} วัน`);
        if (parts.length === 0) parts.push("วันนี้");

        return parts.join(" ");
      },
    },
    {
      header: "Accept Policy",
      key: "policy",
      render: (user) => (
        <label className="flex flex-col justify-center cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-lg bg-gray-400 checked:bg-green-300"
            checked={user.isAllow}
            onChange={() =>
              toggleUserPolicy(user.userId, user.isAllow)
            }
          />
          <span className="mt-1 text-sm">
            {user.isAllow ? "Accepted" : "Not Accepted"}
          </span>
        </label>
      ),
    },




  ];

  return (
    <div className='overflow-x-auto rounded-box text-black'>
      <div className='flex justify-between w-full mb-4'>
        <h1 className="text-2xl font-bold">User List</h1>
        <input
          type="text"
          placeholder="ค้นหาเบอร์โทร..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setUserPage(1);
          }}
          className="input bg-white border border-black p-2 w-2/3 rounded"
        />
      </div>
      <div className="border border-gray-300 my-2" />

      {loading ? (
        <Loading />
      ) : (
        <AdminTable columns={columns} data={sortedUsers} />
      )}

      <Pagination
        currentPage={userPage}
        totalPages={userTotalPages}
        onPageChange={setUserPage}
        loading={loading}
      />
    </div>
  );
}

export default AdminUsers;
