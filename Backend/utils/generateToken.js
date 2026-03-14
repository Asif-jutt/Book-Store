const jwt = require("jsonwebtoken");

/**
 * Generate short-lived access token (15 minutes)
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Set refresh token as httpOnly secure cookie
 */
const setRefreshTokenCookie = (res, token, expiresAt) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    expires: expiresAt,
    path: "/api/auth",
  });
};

/**
 * Clear refresh token cookie
 */
const clearRefreshTokenCookie = (res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    expires: new Date(0),
    path: "/api/auth",
  });
};

module.exports = {
  generateAccessToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
