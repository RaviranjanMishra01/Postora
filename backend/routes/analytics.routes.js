const express = require("express");
const router = express.Router();
const { recordPageView, getAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authmiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/view", recordPageView);
router.get("/", protect, authorize("admin", "superadmin"), getAnalytics);

module.exports = router;
