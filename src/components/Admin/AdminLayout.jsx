import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <AdminNavbar />
      </header>
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
