const express = require("express");
const router = express.Router();
const { subscribe, unsubscribe, getSubscribers } = require("../controllers/newsletterController");
const { protect } = require("../middleware/authmiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/", protect, authorize("admin", "superadmin"), getSubscribers);

module.exports = router;
