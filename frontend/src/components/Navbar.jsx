import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  FileText,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Compass,
  Moon,
  Sun,
} from "lucide-react";
import { getInitials } from "../utils/helpers.js";

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center min-w-0">
            <Link
              to={currentUser ? "/home" : "/"}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <img
                src="/logo.png"
                alt="FindItBack Logo"
                className="h-10 w-10 sm:h-14 sm:w-14 object-contain transition-transform hover:scale-110 duration-300 flex-shrink-0"
                onError={(e) => {
                  // Fallback to icon if logo image not found
                  e.target.style.display = "none";
                  e.target.nextElementSibling.style.display = "block";
                }}
              />
              <Compass
                className="h-8 w-8 sm:h-12 sm:w-12 text-primary transition-transform hover:scale-110 duration-300 flex-shrink-0"
                style={{ display: "none" }}
              />
              <span className="text-lg sm:text-2xl font-bold text-primary dark:text-primary truncate">
                FindItBack
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          {currentUser && (
            <div className="hidden md:flex items-center justify-center flex-1 space-x-2">
              <Link
                to="/home"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-smooth ${
                  isActive("/home")
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                to="/search"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-smooth ${
                  isActive("/search")
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Posts</span>
              </Link>
            </div>
          )}

          {/* Right Side - Theme Toggle & Profile */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-muted hover:bg-muted/70 transition-smooth"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-accent" />
                ) : (
                  <Moon className="h-5 w-5 text-primary" />
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {userProfile?.profilePic || currentUser?.photoURL ? (
                    <img
                      src={userProfile?.profilePic || currentUser?.photoURL}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                      onError={(e) => {
                        // If image fails to load, hide it and show initials instead
                        e.target.style.display = "none";
                        const initialsDiv = e.target.nextElementSibling;
                        if (initialsDiv) initialsDiv.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold"
                    style={{
                      display:
                        userProfile?.profilePic || currentUser?.photoURL
                          ? "none"
                          : "flex",
                    }}
                  >
                    {getInitials(
                      userProfile?.name || currentUser?.displayName || "User"
                    )}
                  </div>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-medium py-2 animate-fadeIn">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-foreground hover:bg-muted transition-smooth"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-destructive hover:bg-destructive/10 w-full text-left transition-smooth"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {currentUser && (
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-muted hover:bg-muted/70 transition-smooth"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-accent" />
                ) : (
                  <Moon className="h-5 w-5 text-primary" />
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-foreground hover:bg-muted transition-smooth"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && currentUser && (
        <div className="md:hidden bg-card border-t border-border animate-fadeIn">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/home"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                isActive("/home")
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/search"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                isActive("/search")
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span>Posts</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-smooth"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 w-full transition-smooth"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
