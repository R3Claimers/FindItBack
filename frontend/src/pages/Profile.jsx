import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Edit,
  Lock,
  FileText,
  LogOut,
  Loader2,
  Save,
  X,
  Trash2,
  Edit3,
} from "lucide-react";
import { authService } from "../services/authService.jsx";
import { lostItemService } from "../services/lostItemService.jsx";
import { foundItemService } from "../services/foundItemService.jsx";
import ItemCard from "../components/ItemCard.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import toast from "react-hot-toast";
import { formatDate, getInitials } from "../utils/helpers.js";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const Profile = () => {
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState({ lost: [], found: [] });
  const [postsLoading, setPostsLoading] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Profile edit form
  const [profileForm, setProfileForm] = useState({
    name: userProfile?.name || "",
    email: currentUser?.email || "",
    phone: userProfile?.phone || "",
    bio: userProfile?.bio || "",
  });

  // Change password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (activeTab === "posts") {
      fetchMyPosts();
    }
  }, [activeTab]);

  const fetchMyPosts = async () => {
    try {
      setPostsLoading(true);
      const [lostResponse, foundResponse] = await Promise.all([
        lostItemService.getMyLostItems(),
        foundItemService.getMyFoundItems(),
      ]);

      setMyPosts({
        lost: lostResponse.data || [],
        found: foundResponse.data || [],
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load your posts");
    } finally {
      setPostsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile(profileForm);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordForm.currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, passwordForm.newPassword);

      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak");
      } else {
        toast.error(error.message || "Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      const { id, type } = postToDelete;
      if (type === "lost") {
        await lostItemService.deleteLostItem(id);
      } else {
        await foundItemService.deleteFoundItem(id);
      }
      toast.success("Post deleted successfully!");
      fetchMyPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setPostToDelete(null);
    }
  };

  const openDeleteModal = (id, type) => {
    setPostToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const handleEditPost = (id, type) => {
    navigate(`/edit/${type}/${id}`);
  };

  const renderProfileView = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Profile Details</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        {userProfile?.profilePic || currentUser?.photoURL ? (
          <img
            src={userProfile?.profilePic || currentUser?.photoURL}
            alt={userProfile?.name || currentUser?.displayName || "Profile"}
            className="h-32 w-32 rounded-full object-cover border-4 border-primary"
            onError={(e) => {
              // If image fails to load, hide it and show initials
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="h-32 w-32 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold"
          style={{
            display:
              userProfile?.profilePic || currentUser?.photoURL
                ? "none"
                : "flex",
          }}
        >
          {getInitials(userProfile?.name || currentUser?.displayName || "User")}
        </div>
        <h3 className="mt-4 text-2xl font-bold text-foreground">
          {profileForm.name}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{profileForm.email}</p>
          </div>
        </div>

        {profileForm.phone && (
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{profileForm.phone}</p>
            </div>
          </div>
        )}

        {profileForm.bio && (
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="font-medium text-foreground">{profileForm.bio}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-medium text-foreground">
              {formatDate(currentUser?.metadata?.creationTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileEdit = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Edit Profile</h2>
        <button
          onClick={() => {
            setIsEditing(false);
            setProfileForm({
              name: userProfile?.name || "",
              email: currentUser?.email || "",
              phone: userProfile?.phone || "",
              bio: userProfile?.bio || "",
            });
          }}
          className="p-2 hover:bg-muted rounded-lg transition-smooth"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Name
          </label>
          <input
            type="text"
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, name: e.target.value })
            }
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            value={profileForm.email}
            disabled
            className="w-full px-4 py-2 bg-muted text-muted-foreground border border-input rounded-lg cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Email cannot be changed
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone (Optional)
          </label>
          <input
            type="tel"
            value={profileForm.phone}
            onChange={(e) =>
              setProfileForm({ ...profileForm, phone: e.target.value })
            }
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio (Optional)
          </label>
          <textarea
            value={profileForm.bio}
            onChange={(e) =>
              setProfileForm({ ...profileForm, bio: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-smooth"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderChangePassword = () => (
    <div className="card max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Change Password
      </h2>

      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            New Password
          </label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          Change Password
        </button>
      </form>
    </div>
  );

  const renderMyPosts = () => (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">My Posts</h2>

      {postsLoading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Lost Items */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Lost Items ({myPosts.lost.length})
            </h3>
            {myPosts.lost.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPosts.lost.map((item) => (
                  <div key={item._id} className="relative">
                    <ItemCard item={item} type="lost" hidePostedBy />
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={() => handleEditPost(item._id, "lost")}
                        className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-smooth"
                        title="Edit Post"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item._id, "lost")}
                        className="p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:opacity-90 transition-smooth"
                        title="Delete Post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No lost items posted yet</p>
            )}
          </div>

          {/* Found Items */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Found Items ({myPosts.found.length})
            </h3>
            {myPosts.found.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPosts.found.map((item) => (
                  <div key={item._id} className="relative">
                    <ItemCard item={item} type="found" hidePostedBy />
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={() => handleEditPost(item._id, "found")}
                        className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-smooth"
                        title="Edit Post"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item._id, "found")}
                        className="p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:opacity-90 transition-smooth"
                        title="Delete Post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No found items posted yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setActiveTab("profile");
              setIsEditing(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-cyan-500 text-white shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === "password"
                ? "bg-cyan-500 text-white shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <Lock className="h-4 w-4" />
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === "posts"
                ? "bg-cyan-500 text-white shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <FileText className="h-4 w-4" />
            My Posts
          </button>
        </div>

        {/* Content */}
        {activeTab === "profile" &&
          (isEditing ? renderProfileEdit() : renderProfileView())}
        {activeTab === "password" && renderChangePassword()}
        {activeTab === "posts" && renderMyPosts()}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPostToDelete(null);
        }}
        onConfirm={handleDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Profile;
