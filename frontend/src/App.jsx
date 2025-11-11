import React, { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LoadingProvider } from "./context/LoadingContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

// Pages
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import PostItem from "./pages/PostItem.jsx";
import LostItemDetail from "./pages/LostItemDetail.jsx";
import FoundItemDetail from "./pages/FoundItemDetail.jsx";
import Profile from "./pages/Profile.jsx";
import Matches from "./pages/Matches.jsx";
import EditPost from "./pages/EditPost.jsx";

function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/signup"].includes(location.pathname);
  const scrollPositions = useRef({});
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    // Save scroll position when leaving a page
    scrollPositions.current[previousPath.current] = window.scrollY;

    // Restore scroll position if returning to a page, otherwise scroll to top
    const savedPosition = scrollPositions.current[location.pathname];
    if (savedPosition !== undefined) {
      // Small delay to ensure content is rendered
      setTimeout(() => window.scrollTo(0, savedPosition), 0);
    } else {
      window.scrollTo(0, 0);
    }

    previousPath.current = location.pathname;
  }, [location.pathname]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          // Default duration based on message length
          duration: 4000,

          // Success messages - shorter duration
          success: {
            duration: 3000,
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--primary))",
            },
            iconTheme: {
              primary: "hsl(var(--primary))",
              secondary: "hsl(var(--card))",
            },
          },

          // Error messages - longer duration so users can read them
          error: {
            duration: 5000,
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--destructive))",
            },
            iconTheme: {
              primary: "hsl(var(--destructive))",
              secondary: "hsl(var(--card))",
            },
          },

          // Default style
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: "1px solid hsl(var(--border))",
            padding: "16px",
            fontSize: "14px",
          },
        }}
      />
      <div className="min-h-screen bg-background">
        {!isAuthPage && <Navbar />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <PostItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lost/:id"
            element={
              <ProtectedRoute>
                <LostItemDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/found/:id"
            element={
              <ProtectedRoute>
                <FoundItemDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:type/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing or home based on auth */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LoadingProvider>
            <AppContent />
          </LoadingProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
