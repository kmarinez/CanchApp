import UserInfo from "./UserInfo";

const Header = () => {

  return (
    <header className="admin-header">
      <input className="search-input" placeholder="Buscar..." />
      <div className="user-info">
        <UserInfo />
      </div>
    </header>
  );
};

export default Header;