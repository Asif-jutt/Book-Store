const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  googleLogin,
  facebookLogin,
  githubLogin,
  refreshAccessToken,
  logout,
  getMe,
  checkEmail,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validateSignup, validateLogin } = require("../middleware/validate");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/google", googleLogin);
router.post("/facebook", facebookLogin);
router.post("/github", githubLogin);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.post("/check-email", checkEmail);
router.get("/me", protect, getMe);

module.exports = router;
