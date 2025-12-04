import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/EditProfile.css";
import { toast } from "react-toastify";

function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const visitorData = location.state || JSON.parse(localStorage.getItem("visitorData"));

  const [formData, setFormData] = useState(visitorData || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save updated data to localStorage
    localStorage.setItem("visitorData", JSON.stringify(formData));

    // Show success message
    toast.success("Profile updated successfully!", {
      position: "top-center",
      autoClose: 2000,
    });

    // Redirect back to Profile page after 2.5 seconds
    setTimeout(() => {
      navigate("/profile");
    }, 2500);
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-card">
        <h2>Edit Profile</h2>
        <p className="subtitle">Update your personal information below.</p>

        <form className="edit-form" onSubmit={handleSubmit}>
          <h3 className="section-title">Personal Information</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mobile No</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Taluka</label>
              <input
                type="text"
                name="taluka"
                value={formData.taluka || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              Save Changes
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
