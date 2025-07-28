import { ReactNode, useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserSidebar from "../components/UserSidebar";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 735;
      setCollapsed(isMobile);
    };

    handleResize(); // Inicial
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
      <UserSidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />
      <div className="admin-main">
        <UserHeader />
        <main className="user-content">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
