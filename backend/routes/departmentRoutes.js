const express = require("express");
const router = express.Router();
const { addBulkDepartments } = require("../controllers/departmentController");

router.post("/bulk", addBulkDepartments);

module.exports = router;
