import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

// Login & Signup pages
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import LoginEntry from "./Components/LoginEntry";
import OfficerForm from "./Components/OfficerForm";
import OfficerLogin from "./Components/OfficerLogin";
import AdminLogin from "./Components/AdminLogin";
// Visitor pages
import VisitorDashboard from "./pages/VisitorDashboard";
import AppointmentWizard from "./pages/AppointmentWizard";
import AppointmentPass from "./pages/AppointmentPass";
import AppointmentList from "./pages/AppointmentList";
import Notifications from "./pages/Notifications";
import AppointmentDetails from "./pages/AppointmentDetails";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";

// Password flow
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Main & general pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MainPage from "./pages/MainPage";
import ChangePassword from "./pages/ChangePassword";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Help from "./pages/Help";

// Admin pages
import AdminDashboard from "./pages/AdminDash";
import ApprovalList from "./pages/ApprovalList";
import Dashboard1 from "./pages/admin";

// Officer pages
import TodayAppointments from "./pages/TodayAppointments";
import AppointmentAction from "./pages/AppointmentAction";
import History from "./pages/History";
import OfficerNotifications from "./pages/OfficerNotifications";
import OfficerReports from "./pages/OfficerReports";

import AddTypeEntry from "./Components/AddTypeEntry";
import AddOrganization from "./pages/AddOrganization";
import AddDepartment from "./pages/AddDepartment";
import AddServices from "./pages/AddServices";
import OfficerProtectedRoute from "./Components/OfficerProtectedRoute";

// Helpdesk
import HelpdeskLogin from "./Components/HelpdeskLogin";
import HelpdeskDashboard from "./pages/HelpdeskDashboard";
import HelpdeskProtectedRoute from "./Components/HelpdeskProtectedRoute";

function App() {
  const loggedIn = !!localStorage.getItem("token");

  const PrivateRoute = ({ children }) => {
    const location = useLocation();
    if (!loggedIn) {
      toast.error("You must be logged in to access this page");
      return <Navigate to="/LoginEntry" state={{ from: location }} replace />;
    }
    return children;
  };

  const protectedRoutes = [
    { path: "change-password", element: <ChangePassword /> },
    { path: "admindash", element: <AdminDashboard /> },
    { path: "approval", element: <ApprovalList /> },
    { path: "officer/dashboard", element: <Dashboard /> },
  ];

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login/visitorlogin" element={<Login />} />
        <Route path="/register-officer" element={<OfficerForm />} />
        <Route path="/login" element={<LoginEntry />} />

        {/* Officer login */}
        <Route path="/login/officerlogin" element={<OfficerLogin />} />

        {/* Admin login */}
        <Route path="/login/adminlogin" element={<AdminLogin />} />

        {/* Helpdesk login */}
        <Route path="/login/helpdeslogin" element={<HelpdeskLogin />} />

        {/* Forgot Password Flow */}
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* Visitor Routes */}
        <Route path="/dashboard1" element={<VisitorDashboard />} />
        <Route path="/appointment-wizard" element={<AppointmentWizard />} />
        <Route path="/appointment-pass/:id" element={<AppointmentPass />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/appointment/:id" element={<AppointmentDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin Dashboard (nested) */}
        <Route path="/admin/*" element={<Dashboard1 />} />

        {/* Add Type Modal */}
        <Route path="/addtype" element={<AddTypeEntry />} />

        {/* Add Organization / Department / Services */}
        <Route path="/add/organization" element={<AddOrganization />} />
        <Route path="/add/department" element={<AddDepartment />} />
        <Route path="/add/services" element={<AddServices />} />

        {/* Officer Routes - Protected */}
        <Route path="/dashboard" element={<OfficerProtectedRoute><Dashboard /></OfficerProtectedRoute>} />
        <Route path="/officer/today" element={<OfficerProtectedRoute><TodayAppointments /></OfficerProtectedRoute>} />
        <Route path="/officer/action/:id" element={<OfficerProtectedRoute><AppointmentAction /></OfficerProtectedRoute>} />
        <Route path="/officer/notifications" element={<OfficerProtectedRoute><OfficerNotifications /></OfficerProtectedRoute>} />
        <Route path="/officer/history" element={<OfficerProtectedRoute><History /></OfficerProtectedRoute>} />
        <Route path="/officer/reports" element={<OfficerProtectedRoute><OfficerReports /></OfficerProtectedRoute>} />

        {/* Helpdesk Routes - Protected */}
        <Route path="/helpdesk/dashboard" element={<HelpdeskProtectedRoute><HelpdeskDashboard /></HelpdeskProtectedRoute>} />

        {/* Main Layout */}
        <Route path="/" element={<MainPage />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="help" element={<Help />} />
          <Route
            path="/dashboard"
            element={loggedIn ? <Navigate to="/admindash" replace /> : <Dashboard />}
          />
          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{element}</PrivateRoute>}
            />
          ))}
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
