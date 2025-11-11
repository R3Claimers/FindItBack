/**
 * Convert Firebase error codes to user-friendly messages
 */
export const getFirebaseErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred. Please try again.";

  const errorCode = error.code || "";
  const errorMessage = error.message || "";

  // Firebase Auth Error Codes
  const errorMessages = {
    // Login/Signin errors
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled":
      "This account has been disabled. Please contact support.",
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential":
      "Invalid email or password. Please check your credentials and try again.",
    "auth/invalid-login-credentials":
      "Invalid email or password. Please try again.",
    "auth/too-many-requests":
      "Too many failed login attempts. Please try again later or reset your password.",

    // Signup errors
    "auth/email-already-in-use":
      "An account with this email already exists. Please login instead.",
    "auth/weak-password":
      "Password is too weak. Please use at least 6 characters with a mix of letters and numbers.",
    "auth/operation-not-allowed":
      "Email/password accounts are not enabled. Please contact support.",

    // Password reset errors
    "auth/expired-action-code":
      "This password reset link has expired. Please request a new one.",
    "auth/invalid-action-code":
      "This password reset link is invalid. Please request a new one.",
    "auth/user-not-found": "No account found with this email address.",

    // Google Sign-in errors
    "auth/popup-closed-by-user": "Sign-in cancelled. Please try again.",
    "auth/popup-blocked":
      "Pop-up blocked by browser. Please allow pop-ups for this site.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using a different sign-in method.",
    "auth/cancelled-popup-request": "Sign-in cancelled. Please try again.",

    // Network errors
    "auth/network-request-failed":
      "Network error. Please check your internet connection and try again.",
    "auth/timeout":
      "Request timed out. Please check your connection and try again.",

    // Generic errors
    "auth/internal-error": "Something went wrong. Please try again later.",
    "auth/app-deleted": "Application error. Please refresh the page.",
    "auth/app-not-authorized":
      "Application not authorized. Please contact support.",
  };

  // Check if we have a specific message for this error code
  if (errorMessages[errorCode]) {
    return errorMessages[errorCode];
  }

  // If error message contains Firebase error patterns, clean them up
  if (errorMessage.includes("Firebase:")) {
    // Extract the readable part after "Firebase: Error"
    const cleanMessage = errorMessage
      .replace(/Firebase:\s*Error\s*\([^)]+\):\s*/gi, "")
      .replace(/auth\//g, "")
      .replace(/-/g, " ")
      .trim();

    // Capitalize first letter
    return cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1) + ".";
  }

  // If it's a readable message already, return it
  if (!errorMessage.includes("auth/") && !errorMessage.includes("Firebase")) {
    return errorMessage;
  }

  // Default fallback message
  return "An error occurred. Please try again.";
};
