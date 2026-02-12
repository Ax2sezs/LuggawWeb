import { createContext, useContext } from "react";
import useAdminLogin from "../hooks/useAdminLogin";
const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
    const auth = useAdminLogin();
    return (
        <AdminAuthContext.Provider value={auth}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
