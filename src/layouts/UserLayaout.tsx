import { ReactNode, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserSidebar from "../components/UserSidebar";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
      <UserSidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />
      <div className="admin-main">
        <UserHeader />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
