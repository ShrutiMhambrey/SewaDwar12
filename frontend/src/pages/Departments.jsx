import React, { useState, useEffect, useRef } from "react";
import { FaBuilding, FaUser, FaEdit, FaTrash } from "react-icons/fa";
import "../css/departments.css";
import { useNavigate } from "react-router-dom";

const Departments = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "IT", officers: 3, status: "Active" },
    { id: 2, name: "HR", officers: 2, status: "Inactive" },
  ]);

  const [officers, setOfficers] = useState([
    { id: 1, departmentId: 1, name: "John Doe", role: "Manager", email: "john@example.com", status: "Active" },
    { id: 2, departmentId: 1, name: "Jane Smith", role: "Developer", email: "jane@example.com", status: "Active" },
    { id: 3, departmentId: 2, name: "Alice Brown", role: "HR Executive", email: "alice@example.com", status: "Inactive" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const navigate = useNavigate();
  const firstTypeRef = useRef(null);

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstTypeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
  }, [showAddModal]);

  const openType = (type) => {
    setShowAddModal(false);
    navigate(`/add/${type}`);
  };

  const handleAddType = () => {
    setShowAddModal(true);
  };

  return (
    <div className="departments-page">

      {/* Header */}
      <div className="departments-header">
        <h1><FaBuilding /> Departments & Officers</h1>
        <div>
          {/* OPEN MODAL HERE */}
          <button className="add-department" onClick={handleAddType}>
             Onboard Entity
          </button>

          <button className="add-officer" onClick={() => navigate("/register-officer")}>
            Add Officer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stats-card">
          <h2>{departments.length}</h2>
          <p>Total Departments</p>
        </div>

        <div className="stats-card">
          <h2>{officers.length}</h2>
          <p>Total Officers</p>
        </div>
      </div>

      {/* Department Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Officers</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.name}</td>
                <td>{officers.filter(o => o.departmentId === dept.id).length}</td>
                <td>{dept.status}</td>
                <td className="actions">
                  <button className="edit"><FaEdit /></button>
                  <button className="delete"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TYPE ONBOARDING MODAL */}
      {showAddModal && (
        <div className="role-modal" role="dialog" aria-modal="true">
          <div className="role-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="role-heading">Select Onboarding Type</h2>

            <div className="role-grid">
              <button
                ref={firstTypeRef}
                className="role-btn"
                onClick={() => openType("organization")}
              >
                Organization
                <span className="role-desc">Onboard new organization</span>
              </button>

              <button
                className="role-btn"
                onClick={() => openType("department")}
              >
                Department
                <span className="role-desc">Register new department</span>
              </button>

              <button
                className="role-btn"
                onClick={() => openType("services")}
              >
                Services
                <span className="role-desc">Add government services</span>
              </button>
            </div>

            <div className="role-actions">
              <button className="role-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Departments;
