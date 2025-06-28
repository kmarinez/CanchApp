import UserInfo from "./UserInfo";

const UserHeader = () => {

  return (
    <header className="admin-header">
    <div className="page-path">
        <span className="parent">Inicio</span>
    </div>
      <div className="user-info">
        <UserInfo />
      </div>
    </header>
  );
};

export default UserHeader;