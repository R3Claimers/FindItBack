import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!loading && !currentUser && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.error("Please login or register to access this page", {
        duration: 4000,
        id: "auth-required", // Prevent duplicate toasts with same ID
      });
    }
  }, [loading, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
