const { getFirebaseAdmin } = require("../config/firebase");
const userRepository = require("../repositories/userRepository");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message:
          "No token provided. Authorization header must be in format: Bearer <token>",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token format",
      });
    }

    const admin = getFirebaseAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await userRepository.findByUid(decodedToken.uid);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found. Please complete your profile.",
      });
    }

    req.user = user;
    req.uid = decodedToken.uid;
    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        status: "error",
        message: "Token expired. Please login again.",
      });
    }

    if (error.code === "auth/argument-error") {
      return res.status(401).json({
        status: "error",
        message: "Invalid token format",
      });
    }

    return res.status(401).json({
      status: "error",
      message: "Authentication failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = authenticateUser;
