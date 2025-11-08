import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  Mail,
  Lock,
  LogIn,
  Compass,
  Moon,
  Sun,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { getFirebaseErrorMessage } from "../utils/errorMessages.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { login, loginWithGoogle, resetPassword, currentUser } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetEmail);
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-lg bg-card hover:bg-card/80 transition-smooth shadow-soft border border-border"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="h-6 w-6 text-accent" />
        ) : (
          <Moon className="h-6 w-6 text-primary" />
        )}
      </button>

      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-card p-4 rounded-full shadow-soft">
              <img
                src="/logo.png"
                alt="FindItBack Logo"
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "block";
                }}
              />
              <Compass
                className="h-16 w-16 text-primary"
                style={{ display: "none" }}
              />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Welcome Back
          </h2>
          <p className="text-muted-foreground">
            Sign in to continue to FindItBack
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl shadow-medium p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth placeholder:text-muted-foreground"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth placeholder:text-muted-foreground"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary/80 transition-smooth font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground rounded-lg py-3 px-4 font-medium hover:opacity-90 transition-smooth shadow-soft flex items-center justify-center space-x-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm rounded-lg">
                  <div className="spinner-small" />
                </div>
              )}
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-border bg-card hover:bg-muted rounded-lg py-3 px-4 font-medium transition-smooth shadow-soft flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm rounded-lg">
                <div className="spinner-small" />
              </div>
            )}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary/80 transition-smooth"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-card rounded-2xl shadow-strong p-8 border border-border max-w-md w-full">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Reset Password
            </h3>
            <p className="text-muted-foreground mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="resetEmail"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth placeholder:text-muted-foreground"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-smooth font-medium text-foreground"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-smooth font-medium relative"
                >
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-accent/20 backdrop-blur-sm rounded-lg">
                      <div className="spinner-small border-accent-foreground" />
                    </div>
                  )}
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
