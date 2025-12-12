import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getOrganization,
  getDepartment,
  getServices,
} from "../services/api";
import "../css/HelpdeskBooking.css";

const HelpdeskBooking = ({ onBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Visitor details
  const [visitorData, setVisitorData] = useState({
    name: "",
    phone: "",
    email: "",
    aadhar: "",
    address: "",
  });

  // Appointment details
  const [formData, setFormData] = useState({
    org_id: "",
    dept_id: "",
    service_id: "",
    officer_id: "",
    appointment_date: "",
    slot_time: "",
    purpose: "",
    is_walkin: true,
  });

  // Dropdown data
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [officers, setOfficers] = useState([]);

  // Loading states
  const [loadingOrg, setLoadingOrg] = useState(false);
  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingOfficers, setLoadingOfficers] = useState(false);

  const slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

  // Fetch organizations on mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoadingOrg(true);
      const { data } = await getOrganization();
      setLoadingOrg(false);
      if (data) setOrganizations(data);
    };
    fetchOrganizations();
  }, []);

  // Fetch departments when org changes
  const fetchDepartments = useCallback(async (org_id) => {
    if (!org_id) return;
    setLoadingDept(true);
    const { data } = await getDepartment(org_id);
    setLoadingDept(false);
    if (data) setDepartments(data);
  }, []);

  // Fetch services when dept changes
  const fetchServices = useCallback(async (org_id, dept_id) => {
    if (!org_id || !dept_id) return;
    setLoadingServices(true);
    const { data } = await getServices(org_id, dept_id);
    setLoadingServices(false);
    if (data) setServices(data);
  }, []);

  // Fetch officers when org and dept are selected
  useEffect(() => {
    const fetchOfficers = async () => {
      if (!formData.org_id || !formData.dept_id) return;
      
      setLoadingOfficers(true);
      try {
        const response = await fetch("http://localhost:5000/api/helpdesk/get-officers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            organization_id: formData.org_id,
            department_id: formData.dept_id,
          }),
        });
        
        const data = await response.json();
        if (data?.success) {
          setOfficers(data.data);
        } else {
          setOfficers([]);
        }
      } catch (err) {
        console.error("Error fetching officers:", err);
        setOfficers([]);
      } finally {
        setLoadingOfficers(false);
      }
    };
    
    fetchOfficers();
  }, [formData.org_id, formData.dept_id]);

  const handleVisitorChange = (e) => {
    const { name, value } = e.target;
    setVisitorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "org_id") {
        updated.dept_id = "";
        updated.service_id = "";
        setDepartments([]);
        setServices([]);
        if (value) fetchDepartments(value);
      }

      if (name === "dept_id") {
        updated.service_id = "";
        setServices([]);
        if (value) fetchServices(prev.org_id, value);
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    // Validate visitor data
    if (!visitorData.name || !visitorData.phone) {
      toast.error("Please enter visitor name and phone number");
      return;
    }

    // Validate appointment data
    if (!formData.org_id || !formData.dept_id || !formData.service_id) {
      toast.error("Please select organization, department, and service");
      return;
    }

    if (!formData.officer_id || !formData.appointment_date || !formData.slot_time) {
      toast.error("Please select officer, date, and time slot");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        // Visitor info
        visitor_name: visitorData.name,
        visitor_phone: visitorData.phone,
        visitor_email: visitorData.email,
        visitor_aadhar: visitorData.aadhar,
        visitor_address: visitorData.address,
        // Appointment info
        organization_id: formData.org_id,
        department_id: formData.dept_id,
        service_id: formData.service_id,
        officer_id: formData.officer_id,
        appointment_date: formData.appointment_date,
        slot_time: formData.slot_time,
        purpose: formData.purpose,
        is_walkin: true,
        booked_by: localStorage.getItem("helpdesk_username") || "helpdesk",
        insert_by: localStorage.getItem("helpdesk_id") || "system",
      };

      const res = await fetch("http://localhost:5000/api/helpdesk/book-walkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Walk-in appointment booked successfully!");
        // Reset form
        setStep(1);
        setVisitorData({ name: "", phone: "", email: "", aadhar: "", address: "" });
        setFormData({
          org_id: "",
          dept_id: "",
          service_id: "",
          officer_id: "",
          appointment_date: "",
          slot_time: "",
          purpose: "",
          is_walkin: true,
        });
        if (onBack) onBack();
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="helpdesk-booking">
      <div className="booking-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Book Walk-in Appointment</h2>
      </div>

      <div className="booking-progress">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Visitor Details</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Select Service</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-label">Schedule</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 4 ? "active" : ""}`}>
          <span className="step-number">4</span>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      <div className="booking-content">
        {/* Step 1: Visitor Details */}
        {step === 1 && (
          <div className="booking-step">
            <h3>Enter Visitor Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={visitorData.name}
                  onChange={handleVisitorChange}
                  placeholder="Enter visitor's full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={visitorData.phone}
                  onChange={handleVisitorChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={visitorData.email}
                  onChange={handleVisitorChange}
                  placeholder="Enter email (optional)"
                />
              </div>
              <div className="form-group">
                <label>Aadhar Number</label>
                <input
                  type="text"
                  name="aadhar"
                  value={visitorData.aadhar}
                  onChange={handleVisitorChange}
                  placeholder="Enter Aadhar number (optional)"
                />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={visitorData.address}
                  onChange={handleVisitorChange}
                  placeholder="Enter address (optional)"
                  rows={2}
                />
              </div>
            </div>
            <div className="step-actions">
              <button
                className="next-btn"
                onClick={() => {
                  if (!visitorData.name || !visitorData.phone) {
                    toast.error("Please enter name and phone number");
                    return;
                  }
                  setStep(2);
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Service */}
        {step === 2 && (
          <div className="booking-step">
            <h3>Select Service</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Organization *</label>
                <select
                  name="org_id"
                  value={formData.org_id}
                  onChange={handleFormChange}
                  disabled={loadingOrg}
                >
                  <option value="">
                    {loadingOrg ? "Loading..." : "Select Organization"}
                  </option>
                  {organizations.map((org) => (
                    <option key={org.organization_id} value={org.organization_id}>
                      {org.organization_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select
                  name="dept_id"
                  value={formData.dept_id}
                  onChange={handleFormChange}
                  disabled={!formData.org_id || loadingDept}
                >
                  <option value="">
                    {loadingDept ? "Loading..." : "Select Department"}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Service *</label>
                <select
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleFormChange}
                  disabled={!formData.dept_id || loadingServices}
                >
                  <option value="">
                    {loadingServices ? "Loading..." : "Select Service"}
                  </option>
                  {services.map((svc) => (
                    <option key={svc.service_id} value={svc.service_id}>
                      {svc.service_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="step-actions">
              <button className="back-btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="next-btn"
                onClick={() => {
                  if (!formData.org_id || !formData.dept_id || !formData.service_id) {
                    toast.error("Please select all fields");
                    return;
                  }
                  setStep(3);
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="booking-step">
            <h3>Schedule Appointment</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Select Officer *</label>
                <select
                  name="officer_id"
                  value={formData.officer_id}
                  onChange={handleFormChange}
                  disabled={loadingOfficers}
                >
                  <option value="">
                    {loadingOfficers ? "Loading..." : "Select Officer"}
                  </option>
                  {officers.map((officer) => (
                    <option key={officer.officer_id} value={officer.officer_id}>
                      {officer.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Appointment Date *</label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleFormChange}
                  min={getTodayDate()}
                />
              </div>
              <div className="form-group">
                <label>Time Slot *</label>
                <select
                  name="slot_time"
                  value={formData.slot_time}
                  onChange={handleFormChange}
                >
                  <option value="">Select Time Slot</option>
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Purpose of Visit</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleFormChange}
                  placeholder="Enter purpose of visit"
                  rows={3}
                />
              </div>
            </div>
            <div className="step-actions">
              <button className="back-btn" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className="next-btn"
                onClick={() => {
                  if (!formData.officer_id || !formData.appointment_date || !formData.slot_time) {
                    toast.error("Please fill all required fields");
                    return;
                  }
                  setStep(4);
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="booking-step">
            <h3>Confirm Appointment</h3>
            <div className="confirmation-card">
              <div className="confirm-section">
                <h4>Visitor Information</h4>
                <div className="confirm-grid">
                  <div><strong>Name:</strong> {visitorData.name}</div>
                  <div><strong>Phone:</strong> {visitorData.phone}</div>
                  {visitorData.email && <div><strong>Email:</strong> {visitorData.email}</div>}
                  {visitorData.aadhar && <div><strong>Aadhar:</strong> {visitorData.aadhar}</div>}
                </div>
              </div>
              <div className="confirm-section">
                <h4>Appointment Details</h4>
                <div className="confirm-grid">
                  <div><strong>Organization:</strong> {organizations.find(o => o.organization_id === formData.org_id)?.organization_name}</div>
                  <div><strong>Department:</strong> {departments.find(d => d.department_id === formData.dept_id)?.department_name}</div>
                  <div><strong>Service:</strong> {services.find(s => s.service_id === formData.service_id)?.service_name}</div>
                  <div><strong>Officer:</strong> {officers.find(o => o.officer_id === formData.officer_id)?.full_name}</div>
                  <div><strong>Date:</strong> {formData.appointment_date}</div>
                  <div><strong>Time:</strong> {formData.slot_time}</div>
                </div>
              </div>
              {formData.purpose && (
                <div className="confirm-section">
                  <h4>Purpose</h4>
                  <p>{formData.purpose}</p>
                </div>
              )}
            </div>
            <div className="step-actions">
              <button className="back-btn" onClick={() => setStep(3)}>
                ← Back
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpdeskBooking;
