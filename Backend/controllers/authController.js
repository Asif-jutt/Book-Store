const User = require("../models/User");
const {
  generateAccessToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require("../utils/generateToken");

// ─── Helper: issue tokens and respond ───────────────────────────────
const issueTokensAndRespond = async (
  res,
  user,
  statusCode = 200,
  message = "Login successful",
) => {
  user.cleanExpiredTokens();
  const { token: refreshToken, expiresAt } = user.generateRefreshToken();
  await user.save();

  const accessToken = generateAccessToken(user._id);
  setRefreshTokenCookie(res, refreshToken, expiresAt);

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      ...user.toPublicJSON(),
      token: accessToken,
    },
  });
};

// ─── Helper: process OAuth login (unified for all providers) ─────────
const processOAuthLogin = async (
  res,
  { provider, providerId, email, name, picture },
) => {
  if (!email) {
    return res.status(400).json({
      success: false,
      message: `Could not retrieve email from ${provider}. Please ensure your ${provider} account has a public email.`,
    });
  }

  const providerIdField = `${provider}Id`;
  let user = await User.findOne({ email });

  if (user) {
    // Account exists — link this provider if not already linked
    if (!user[providerIdField]) {
      user[providerIdField] = providerId;
    }
    if (!user.authProviders.includes(provider)) {
      user.authProviders.push(provider);
    }
    if (!user.profilePicture && picture) {
      user.profilePicture = picture;
    }
  } else {
    // New user — create account
    user = new User({
      fullName: name,
      email,
      profilePicture: picture || "",
      [providerIdField]: providerId,
      authProviders: [provider],
    });
  }

  return issueTokensAndRespond(
    res,
    user,
    200,
    `${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful`,
  );
};

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/signup
// ═══════════════════════════════════════════════════════════════════════
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const providers = existingUser.authProviders;
      if (providers.length > 0 && !providers.includes("local")) {
        return res.status(409).json({
          success: false,
          message: `An account with this email already exists via ${providers.join(", ")}. Please log in with ${providers[0]} or use a different email.`,
          existingProviders: providers,
        });
      }
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists. Please log in instead.",
      });
    }

    const user = new User({
      fullName,
      email,
      password,
      authProviders: ["local"],
    });

    return issueTokensAndRespond(
      res,
      user,
      201,
      "Account created successfully",
    );
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
  }
};

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ═══════════════════════════════════════════════════════════════════════
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // If user has no password (social-only account)
    if (!user.password) {
      const providers = user.authProviders.filter((p) => p !== "local");
      return res.status(401).json({
        success: false,
        message: `This account was created with ${providers.join(", ")}. Please log in with ${providers[0]} instead, or set a password first.`,
        existingProviders: providers,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Ensure 'local' is listed in authProviders
    if (!user.authProviders.includes("local")) {
      user.authProviders.push("local");
    }

    return issueTokensAndRespond(res, user, 200, "Login successful");
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
  }
};

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/google
// ═══════════════════════════════════════════════════════════════════════
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${credential}` } },
    );

    if (!response.ok) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Google token" });
    }

    const payload = await response.json();
    return processOAuthLogin(res, {
      provider: "google",
      providerId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });
  } catch (error) {
    res
      .status(401)
      .json({
        success: false,
        message: "Google authentication failed. Please try again.",
      });
  }
};

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/facebook
// ═══════════════════════════════════════════════════════════════════════
const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res
        .status(400)
        .json({ success: false, message: "Facebook access token is required" });
    }

    const fbRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.width(200)&access_token=${encodeURIComponent(accessToken)}`,
    );

    if (!fbRes.ok) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Facebook token" });
    }

    const fbData = await fbRes.json();
    return processOAuthLogin(res, {
      provider: "facebook",
      providerId: fbData.id,
      email: fbData.email,
      name: fbData.name,
      picture: fbData.picture?.data?.url || "",
    });
  } catch (error) {
    res
      .status(401)
      .json({
        success: false,
        message: "Facebook authentication failed. Please try again.",
      });
  }
};

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/github
// ═══════════════════════════════════════════════════════════════════════
const githubLogin = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({
          success: false,
          message: "GitHub authorization code is required",
        });
    }

    // Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return res
        .status(401)
        .json({ success: false, message: "GitHub authorization failed" });
    }

    // Fetch user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const ghUser = await userRes.json();

    // Fetch primary email if not public
    let email = ghUser.email;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const emails = await emailRes.json();
      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || null;
    }

    return processOAuthLogin(res, {
      provider: "github",
      providerId: String(ghUser.id),
      email,
      name: ghUser.name || ghUser.login,
      picture: ghUser.avatar_url || "",
    });
  } catch (error) {
    res
      .status(401)
      .json({
        success: false,
        message: "GitHub authentication failed. Please try again.",
      });
  }
};

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/refresh
// ═══════════════════════════════════════════════════════════════════════
const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }

    const user = await User.findOne({
      "refreshTokens.token": token,
      "refreshTokens.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      clearRefreshTokenCookie(res);
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid or expired refresh token. Please log in again.",
        });
    }

    // Rotate: remove old, issue new
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== token);
    user.cleanExpiredTokens();
    const { token: newRefreshToken, expiresAt } = user.generateRefreshToken();
    await user.save();

    const accessToken = generateAccessToken(user._id);
    setRefreshTokenCookie(res, newRefreshToken, expiresAt);

    res.status(200).json({
      success: true,
      data: {
        ...user.toPublicJSON(),
        token: accessToken,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Could not refresh token" });
  }
};

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// ═══════════════════════════════════════════════════════════════════════
const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const user = await User.findOne({ "refreshTokens.token": token });
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (rt) => rt.token !== token,
        );
        await user.save();
      }
    }
    clearRefreshTokenCookie(res);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    clearRefreshTokenCookie(res);
    res.status(200).json({ success: true, message: "Logged out" });
  }
};

// ═══════════════════════════════════════════════════════════════════════
// GET /api/auth/me
// ═══════════════════════════════════════════════════════════════════════
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// ═══════════════════════════════════════════════════════════════════════
// POST /api/auth/check-email
// ═══════════════════════════════════════════════════════════════════════
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: "An account with this email already exists. Please log in.",
        providers: user.authProviders,
      });
    }

    res.status(200).json({
      success: true,
      exists: false,
      message: "Email is available",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not check email" });
  }
};

module.exports = {
  signup,
  login,
  googleLogin,
  facebookLogin,
  githubLogin,
  refreshAccessToken,
  logout,
  getMe,
  checkEmail,
};
