const express = require("express");
const router = express.Router();
const {
  loginHelpdesk,
  getHelpdeskDashboard,
  registerHelpdesk,
  bookWalkinAppointment,
  getOfficersForBooking,
  getAllAppointmentsByDepartment,
} = require("../controllers/helpdeskController");

// Login route
router.post("/login", loginHelpdesk);

// Register route
router.post("/register", registerHelpdesk);

// Book walk-in appointment
router.post("/book-walkin", bookWalkinAppointment);

// Get officers for booking
router.post("/get-officers", getOfficersForBooking);

// Dashboard route
router.get("/:helpdesk_id/dashboard", getHelpdeskDashboard);

// Get all appointments by department (read-only view)
router.get("/:helpdesk_id/appointments-by-department", getAllAppointmentsByDepartment);

module.exports = router;
