import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [visitorData, setVisitorData] = useState({
    visitorId: "VIS2025-1034",
    name: "Ravi Tambe",
    email: "ravi.tambe@example.com",
    phone: "+91 9876543210",
    gender: "Male",
    dob: "1992-07-15",
    address: "Flat No. 204, Pristine Residency, Pune, Maharashtra, 411001",
    state: "Maharashtra",
    division: "Pune Division",
    district: "Pune",
    taluka: "Haveli",
    pincode: "411001",
    idProofType: "Aadhaar Card",
    idProofNo: "XXXX-XXXX-4567",
    purpose: "Meeting with Regional Officer for Project Clearance",
    visitDate: "2025-10-08",
    timeSlot: "10:30 AM – 11:15 AM",
    department: "Urban Development Department",
    organization: "Government of Maharashtra",
    status: "Verified",
    joinedDate: "2025-01-15",
    profilePic: "https://i.pravatar.cc/150?img=12",
    lastLogin: null,
  });

  // Load updated profile data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("visitorData"); // <- matches EditProfile
    if (savedData) {
      setVisitorData(JSON.parse(savedData));
    }

    // Update last login timestamp
    const lastLogin = localStorage.getItem("visitorLastLogin") || new Date().toLocaleString();
    setVisitorData((prev) => ({ ...prev, lastLogin }));
    localStorage.setItem("visitorLastLogin", new Date().toLocaleString());
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile", { state: visitorData });
  };

  return (
    <div className="profile-page">
      <div className="profile-header-banner">
        <h1>Visitor Profile</h1>
        <p>Government of India — Digital Visitor Management System (DVMS)</p>
      </div>

      <div className="profile-card">
        <div className="profile-left">
          <img src={visitorData.profilePic} alt="Profile" className="profile-pic" />
          <h2 className="profile-name">{visitorData.name}</h2>
          <p className="profile-role">Visitor ID: {visitorData.visitorId}</p>
          <p className={`status-tag ${visitorData.status.toLowerCase()}`}>{visitorData.status}</p>
          <p className="last-login">Last Login: {visitorData.lastLogin || "N/A"}</p>

          <div className="profile-actions">
            <button className="btn primary" onClick={handleEditProfile}>Edit Profile</button>
            <button className="btn secondary" onClick={() => navigate("/change-password")}>Change Password</button>
          </div>
        </div>

        <div className="profile-right">
          <h3 className="section-title">Personal Information</h3>
          <div className="info-grid">
            {[
              ["Full Name", "name"],
              ["Gender", "gender"],
              ["Date of Birth", "dob"],
              ["Mobile No", "phone"],
              ["Email ID", "email"],
              ["Address", "address"],
              ["State", "state"],
              ["Division", "division"],
              ["District", "district"],
              ["Taluka", "taluka"],
              ["Pincode", "pincode"],
            ].map(([label, key]) => (
              <div className="info-box" key={key}>
                <strong>{label}</strong>
                <p>{visitorData[key]}</p>
              </div>
            ))}
          </div>

          <h3 className="section-title">Visit Information</h3>
          <div className="info-grid">
            {[
              ["Purpose of Visit", "purpose"],
              ["Visit Date", "visitDate"],
              ["Time Slot", "timeSlot"],
              ["Joined Date", "joinedDate"],
              ["Department", "department"],
              ["Organization", "organization"],
            ].map(([label, key]) => (
              <div className="info-box" key={key}>
                <strong>{label}</strong>
                <p>{visitorData[key]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
