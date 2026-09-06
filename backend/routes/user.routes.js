const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changeAvatar,
  changeEmail,
  changeUsername,
  deleteAccount,
  getPublicAuthorProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/avatar", protect, upload.single("avatar"), changeAvatar);
router.put("/change-email", protect, changeEmail);
router.put("/change-username", protect, changeUsername);
router.delete("/delete-account", protect, deleteAccount);
router.get("/author/:username", getPublicAuthorProfile);

module.exports = router;
