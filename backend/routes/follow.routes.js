const express = require("express");
const router = express.Router();
const { toggleFollow, getAuthorFeed, getFollowersList, getFollowingList } = require("../controllers/followController");
const { protect } = require("../middleware/authmiddleware");

router.post("/:authorId", protect, toggleFollow);
router.get("/feed", protect, getAuthorFeed);
router.get("/followers", protect, getFollowersList);
router.get("/followers/:userId", protect, getFollowersList);
router.get("/following", protect, getFollowingList);
router.get("/following/:userId", protect, getFollowingList);

module.exports = router;
