const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, markResolved, deleteMessage } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/", sendMessage);
router.get("/", protect, authorize("admin", "superadmin"), getMessages);
router.put("/:id/resolve", protect, authorize("admin", "superadmin"), markResolved);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteMessage);

module.exports = router;
