import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = ({ activeMenu, onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: "🏠", to: "/helpdesk/dashboard", internal: true },
    { key: "all-appointments", label: "All Appointments", icon: "📋", to: "/helpdesk/dashboard", internal: true },
    { key: "online", label: "Online Appointments", icon: "💻", to: "/helpdesk/appointments" },
    { key: "booking", label: "Appointment Booking", icon: "📝", to: "/helpdesk/dashboard", internal: true },
    { key: "walkin", label: "Walk-In", icon: "🚶‍♂️", to: "/helpdesk/walkin" },
    { key: "notifications", label: "Notifications", icon: "🔔", to: "/helpdesk/notifications" },
  ];

  const isActive = (key) => activeMenu === key || location.pathname === menu.find(m => m.key === key)?.to;

  const handleClick = (item) => {
    if (onMenuClick) {
      onMenuClick(item.key);
    }
    // Only navigate if not an internal menu item (handled within dashboard)
    if (!item.internal) {
      navigate(item.to);
    }
  };

  return (
    <aside className="helpdesk-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">🎫</span>
        <span className="sidebar-title">SewaDwaar</span>
      </div>
      <nav className="sidebar-menu">
        {menu.map((m) => (
          <div
            key={m.key}
            className={`sidebar-item ${isActive(m.key) ? "active" : ""}`}
            onClick={() => handleClick(m)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick(m)}
          >
            <span className="icon">{m.icon}</span>
            <span className="label">{m.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-separator" />
      <div className="sidebar-footer">
        <div
          className="sidebar-item footer-item"
          onClick={() => navigate("/help")}
          role="button"
          tabIndex={0}
        >
          <span className="icon">❓</span>
          <span className="label">Help</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

