import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavbarHelpdesk from "../Components/NavbarHelpdesk";
import SidebarHelpdesk from "../Components/SidebarHelpdesk";
import StatsRow from "../Components/StatsrowHelpdesk";
import AppointmentList from "../Components/AppointmentHelpdesk";
import HelpdeskBooking from "../Components/HelpdeskBooking";
import HelpdeskAllAppointments from "../Components/HelpdeskAllAppointments";
import "../css/HelpdeskDashboard.css";

const HelpdeskDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showAppointmentList, setShowAppointmentList] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    today: 0,
    completed: 0,
    pending: 0,
    rescheduled: 0,
    reassigned: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const helpdeskId = localStorage.getItem("helpdesk_id");
  const username = localStorage.getItem("helpdesk_username");
  const locationId = localStorage.getItem("helpdesk_location");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/helpdesk/${helpdeskId}/dashboard?location_id=${locationId}`
      );
      const data = await res.json();

      if (res.ok) {
        // Calculate stats from appointments
        const allAppointments = [
          ...(data.today_appointments || []).map((a) => ({
            ...a,
            status: "today",
          })),
          ...(data.completed_appointments || []).map((a) => ({
            ...a,
            status: "completed",
          })),
          ...(data.pending_appointments || []).map((a) => ({
            ...a,
            status: "pending",
          })),
          ...(data.rescheduled_appointments || []).map((a) => ({
            ...a,
            status: "rescheduled",
          })),
          ...(data.reassigned_appointments || []).map((a) => ({
            ...a,
            status: "reassigned",
          })),
        ];

        setAppointments(allAppointments);
        setStats({
          today: data.today_appointments?.length || 0,
          completed: data.completed_appointments?.length || 0,
          pending: data.pending_appointments?.length || 0,
          rescheduled: data.rescheduled_appointments?.length || 0,
          reassigned: data.reassigned_appointments?.length || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [helpdeskId, locationId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCircleClick = (type) => {
    const filtered = appointments.filter((app) => app.status === type);
    setFilteredAppointments(
      filtered.map((app) => ({
        id: app.appointment_id || app.id,
        name: app.visitor_name || app.name,
        department: app.service_name || app.department,
        date: app.appointment_date
          ? new Date(app.appointment_date).toLocaleDateString()
          : app.date,
        status: app.status,
        reassignedTo: app.reassigned_to,
      }))
    );
    setFilterType(type);
    setShowAppointmentList(true);
  };

  const handleBackToDashboard = () => {
    setShowAppointmentList(false);
    setShowBooking(false);
    setShowAllAppointments(false);
    setFilterType("");
    setActiveMenu("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("helpdesk_id");
    localStorage.removeItem("helpdesk_username");
    localStorage.removeItem("helpdesk_role");
    localStorage.removeItem("helpdesk_location");
    navigate("/login");
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setShowAppointmentList(false);
    setShowBooking(false);
    setShowAllAppointments(false);
    
    if (menu === "booking") {
      setShowBooking(true);
    } else if (menu === "all-appointments") {
      setShowAllAppointments(true);
    }
  };

  if (loading) {
    return (
      <div className="helpdesk-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="helpdesk-layout">
      <SidebarHelpdesk activeMenu={activeMenu} onMenuClick={handleMenuClick} />

      <div className="helpdesk-main">
        <NavbarHelpdesk username={username} onLogout={handleLogout} />

        <div className="helpdesk-content">
          {showBooking ? (
            <HelpdeskBooking onBack={handleBackToDashboard} />
          ) : showAllAppointments ? (
            <HelpdeskAllAppointments onBack={handleBackToDashboard} />
          ) : showAppointmentList ? (
            <AppointmentList
              filteredAppointments={filteredAppointments}
              handleBackToDashboard={handleBackToDashboard}
              filterType={filterType}
            />
          ) : (
            <>
              <div className="dashboard-header">
                <h1>Welcome, {username || "Helpdesk"}</h1>
                <p>Here's an overview of today's activities</p>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => {
                    setShowBooking(true);
                    setActiveMenu("booking");
                  }}
                >
                  📝 Book Walk-in Appointment
                </button>
              </div>

              <StatsRow stats={stats} onCircleClick={handleCircleClick} />

              <div className="recent-section">
                <h2>Recent Appointments</h2>
                <div className="recent-list">
                  {appointments.slice(0, 5).map((app, idx) => (
                    <div key={idx} className={`recent-item ${app.status}`}>
                      <div className="recent-info">
                        <span className="recent-name">
                          {app.visitor_name || app.name}
                        </span>
                        <span className="recent-service">
                          {app.service_name || app.department}
                        </span>
                      </div>
                      <span className={`recent-status ${app.status}`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                  {appointments.length === 0 && (
                    <p className="no-recent">No recent appointments</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpdeskDashboard;
