import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 735;
      setCollapsed(isMobile);
    };

    handleResize(); // Inicial
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed(!collapsed)}
      />
      <div className="admin-main">
        <Header />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
