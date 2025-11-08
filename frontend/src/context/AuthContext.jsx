import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase.js";
import { authService } from "../services/authService.jsx";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      // Create user profile in database
      await authService.createOrUpdateProfile({
        uid: userCredential.user.uid,
        name,
        email,
      });

      toast.success("Account created successfully!");
      return userCredential.user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success("Welcome back!");
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Create or update user profile in database
      await authService.createOrUpdateProfile({
        uid: userCredential.user.uid,
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        profilePic: userCredential.user.photoURL,
      });

      toast.success("Welcome!");
      return userCredential.user;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.", {
        duration: 4500, // Longer duration for important message
      });
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUserProfile(response.data);
      toast.success("Profile updated successfully");
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  // Fetch user profile from database
  const fetchUserProfile = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUserProfile(response.data);
    } catch (error) {
      console.error("Fetch profile error:", error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user profile from database
        await fetchUserProfile();
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
