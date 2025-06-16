import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <div className="user-layout">
      <header className="user-header">
        <h1>Bienvenido, {user?.name}</h1>
        <button onClick={logout}>Salir</button>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default UserLayout;
