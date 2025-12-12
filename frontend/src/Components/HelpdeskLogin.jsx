import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/OfficerLogin.css"; // Reuse officer login styles

const HelpdeskLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/helpdesk/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("helpdesk_id", data.helpdesk_id);
        localStorage.setItem("helpdesk_username", data.username);
        localStorage.setItem("helpdesk_role", data.role_code || "helpdesk");
        localStorage.setItem("helpdesk_location", data.location_id || "");
        toast.success("Login successful!");
        navigate("/helpdesk/dashboard");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="officer-login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Helpdesk Login</h2>
          <p>Access the helpdesk portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button" 
            className="back-link"
            onClick={() => navigate("/login")}
          >
            ← Back to Login Options
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpdeskLogin;
