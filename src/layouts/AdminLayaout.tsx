import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Panel Admin</h2>
        <p>{user?.name}</p>
        <button onClick={logout}>Cerrar sesión</button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;