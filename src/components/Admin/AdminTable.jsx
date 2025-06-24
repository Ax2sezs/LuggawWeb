import React from "react";

export default function AdminTable({ columns, data }) {
    return (
        <table className="table w-full text-black">
            <thead className="text-black text-lg font-bold">
                <tr>
                    {columns.map((col, i) => (
                        <th
                            key={i}
                            className={col.sortable ? "cursor-pointer" : ""}
                            onClick={col.sortable ? () => col.onSort(col.key) : undefined}
                        >
                            {col.header}
                            {col.sortable && col.sortState?.key === col.key && (
                                <> {col.sortState.direction === "asc" ? "↑" : "↓"}</>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex} className="border-t border-gray-400 hover:bg-gray-100 text-lg">
                        {columns.map((col, colIndex) => (
                            <td key={colIndex}>
                                {col.render ? col.render(row, rowIndex) : row[col.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
