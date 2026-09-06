const express = require("express");
const router = express.Router();
const { searchAll, getSuggestions } = require("../controllers/searchController");

router.get("/", searchAll);
router.get("/suggestions", getSuggestions);

module.exports = router;
