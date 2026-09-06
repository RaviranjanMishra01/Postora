const express = require("express");
const router = express.Router();
const { toggleFollow, getAuthorFeed } = require("../controllers/followController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:authorId", protect, toggleFollow);
router.get("/feed", protect, getAuthorFeed);

module.exports = router;
