// components/Pagination.jsx
import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange, loading }) {
  if (loading || totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4 space-x-2 text-black">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-3 py-1 border rounded">
        Page {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
