const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  authMiddleware,
  restrictTo,
} = require("../controllers/authController");
const {
  getUserDetails,
  getAllUsers,
} = require("../controllers/userControllers");
router.post("/login", login);
router.post("/signup", signup);
router.get("/", authMiddleware, restrictTo("admin"), getAllUsers);

router.get("/user-details", authMiddleware, getUserDetails);

module.exports = router;
