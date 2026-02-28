const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// GET /api/coding-profile/leetcode/:username
router.get("/leetcode/:username", profileController.getLeetCodeStats);

// GET /api/coding-profile/github/:username
router.get("/github/:username", profileController.getGitHubStats);

module.exports = router;
