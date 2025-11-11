const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authenticateUser = require("../middlewares/auth");

// All routes require authentication
router.use(authenticateUser);

// Create a report
router.post("/", reportController.createReport);

// Get reports by item (for reference, can be restricted to admins)
router.get("/:itemType/:itemId", reportController.getReportsByItem);

// Admin routes (would need admin middleware in production)
router.get("/", reportController.getAllReports);
router.patch("/:reportId/status", reportController.updateReportStatus);
router.delete("/:reportId", reportController.deleteReport);

module.exports = router;
