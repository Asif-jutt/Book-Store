import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";

function Profile() {
  const { user, updateUser } = useAuth();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      bio: user?.bio || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onProfileSubmit = async (data) => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await userAPI.updateProfile(data);
      updateUser(response.data.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await userAPI.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      resetPassword();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await userAPI.uploadProfilePicture(formData);
      updateUser({ profilePicture: response.data.data.profilePicture });
      setMessage({
        type: "success",
        text: "Profile picture updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to upload image",
      });
    } finally {
      setIsUploadLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Profile</h1>

      {message.text && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}
        >
          <span>{message.text}</span>
        </div>
      )}

      <div className="card bg-base-100 dark:bg-slate-800 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                {previewImage || user?.profilePicture ? (
                  <img
                    src={
                      previewImage ||
                      `http://localhost:5000${user.profilePicture}`
                    }
                    alt="Profile"
                  />
                ) : (
                  <div className="bg-secondary text-white flex items-center justify-center w-full h-full text-3xl font-bold">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageChange(e);
                  handleImageUpload(e);
                }}
                className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
                disabled={isUploadLoading}
              />
              <p className="text-sm opacity-70 mt-2">
                JPG, PNG or GIF. Max size 5MB.
              </p>
              {isUploadLoading && (
                <span className="loading loading-spinner loading-sm mt-2"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 dark:bg-slate-800 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Personal Information</h2>
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered dark:bg-slate-700"
                {...registerProfile("fullName", {
                  required: "Full name is required",
                })}
              />
              {profileErrors.fullName && (
                <span className="text-red-500 text-sm">
                  {profileErrors.fullName.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered dark:bg-slate-700"
                value={user?.email}
                disabled
              />
              <label className="label">
                <span className="label-text-alt opacity-70">
                  Email cannot be changed
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                className="textarea textarea-bordered dark:bg-slate-700"
                rows="3"
                placeholder="Tell us about yourself..."
                {...registerProfile("bio", {
                  maxLength: {
                    value: 200,
                    message: "Bio cannot exceed 200 characters",
                  },
                })}
              ></textarea>
              {profileErrors.bio && (
                <span className="text-red-500 text-sm">
                  {profileErrors.bio.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="card bg-base-100 dark:bg-slate-800 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Change Password</h2>
          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered dark:bg-slate-700"
                {...registerPassword("currentPassword", {
                  required: "Current password is required",
                })}
              />
              {passwordErrors.currentPassword && (
                <span className="text-red-500 text-sm">
                  {passwordErrors.currentPassword.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered dark:bg-slate-700"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {passwordErrors.newPassword && (
                <span className="text-red-500 text-sm">
                  {passwordErrors.newPassword.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered dark:bg-slate-700"
                {...registerPassword("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
              />
              {passwordErrors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {passwordErrors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-outline btn-secondary"
              disabled={isPasswordLoading}
            >
              {isPasswordLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
