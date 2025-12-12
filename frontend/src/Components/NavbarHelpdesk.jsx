import React from "react";
import { FiUser, FiBell, FiLogOut } from "react-icons/fi";
import "../css/Navbar.css";

const Navbar = ({ username, onLogout }) => {
  return (
    <header className="helpdesk-navbar">
      <div className="navbar-left">
        <div className="navbar-title">Helpdesk Portal</div>
      </div>
      <div className="navbar-right">
        <button className="navbar-icon-btn" title="Notifications">
          <FiBell size={20} />
        </button>
        <div className="navbar-user">
          <FiUser size={18} />
          <span>{username || "Helpdesk User"}</span>
        </div>
        <button 
          className="navbar-icon-btn logout-btn" 
          onClick={onLogout}
          title="Logout"
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
