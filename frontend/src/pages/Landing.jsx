import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { ArrowRight, Moon, Sun } from "lucide-react";

const Landing = () => {
  const { currentUser } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  // If user is logged in, redirect to home
  React.useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden flex-1 flex flex-col">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>

        {/* Animated Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Header */}
        <header className="relative z-10 container mx-auto px-4 py-4 sm:py-6">
          <nav className="flex items-center justify-between gap-2">
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0"
            >
              <img
                src="/logo.png"
                alt="FindItBack Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="hidden sm:block text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wider">
                FindItBack
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2 rounded-lg bg-muted hover:bg-muted/70 transition-all duration-300 flex-shrink-0"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 sm:h-5 sm:w-5 text-accent" />
                ) : (
                  <Moon className="h-5 w-5 sm:h-5 sm:w-5 text-primary" />
                )}
              </button>

              <Link
                to="/login"
                className="px-4 py-2 sm:px-5 sm:py-2 md:px-6 text-base sm:text-base text-foreground hover:text-primary transition-colors flex-shrink-0"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 sm:px-5 sm:py-2 md:px-6 text-base sm:text-base bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex-shrink-0 whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Lost Something?
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                We'll Help You Find It Back
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connect with people who found what you lost. Post, search, and
              reunite with your belongings.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-card border-2 border-border text-foreground rounded-xl font-semibold hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-8">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground text-sm">
              © 2025 FindItBack by{" "}
              <span className="text-primary font-semibold">R3Claimers</span>.
              All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
