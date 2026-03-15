const jwt = require("jsonwebtoken");
const config = require("../config/environment");
const logger = require("./logger");

class TokenService {
  static generateAccessToken(userId, email, role) {
    try {
      return jwt.sign({ id: userId, email, role }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE,
      });
    } catch (error) {
      logger.error(`Error generating access token: ${error.message}`);
      throw error;
    }
  }

  static generateRefreshToken(userId) {
    try {
      return jwt.sign(
        { id: userId, type: "refresh" },
        config.JWT_REFRESH_SECRET,
        { expiresIn: config.JWT_REFRESH_EXPIRE },
      );
    } catch (error) {
      logger.error(`Error generating refresh token: ${error.message}`);
      throw error;
    }
  }

  static generateTokenPair(userId, email, role) {
    const accessToken = this.generateAccessToken(userId, email, role);
    const refreshToken = this.generateRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
      logger.warn(`Access token verification failed: ${error.message}`);
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET);
    } catch (error) {
      logger.warn(`Refresh token verification failed: ${error.message}`);
      return null;
    }
  }

  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = TokenService;
