const express = require("express");
const router = express.Router();
const { submitReport, getReports, resolveReport } = require("../controllers/reportController");
const { protect } = require("../middleware/authmiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/", protect, submitReport);
router.get("/", protect, authorize("admin", "superadmin"), getReports);
router.put("/:id/resolve", protect, authorize("admin", "superadmin"), resolveReport);

module.exports = router;
