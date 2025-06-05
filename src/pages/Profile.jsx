import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiAlertCircle,
  FiEdit3,
  FiCamera,
  FiShield
} from "react-icons/fi";
import { updateUserProfile } from "../redux/slices/authSlice";
import Loading from "../components/Loading";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import Avatar from "../components/Avatar";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: ""
  });

  const [activeTab, setActiveTab] = useState("profile");

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(
    () => {
      if (!user) {
        navigate("/signin");
        return;
      }

      if (user.isAdmin) {
        navigate("/admin");
        return;
      }

      // Initialize form with user data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        bio: user.bio || ""
      });
    },
    [user, navigate]
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (formData.bio && formData.bio.length > 500) {
      errors.bio = "Bio cannot exceed 500 characters";
    }

    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Only include password if it was provided
      const updateData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        ...(formData.password ? { password: formData.password } : {})
      };

      await dispatch(updateUserProfile(updateData)).unwrap();
      setSuccessMessage("Profile updated successfully");

      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    } catch (err) {
      setFormErrors({
        submit: err.message || "Failed to update profile. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="admin-header p-6 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={user?.profilePicture}
              alt={user?.name || "Profile"}
              size="xl"
              fallbackText={user?.name}
              className="border-4 border-primary/20"
            />
            <div>
              <h1 className="text-3xl font-bold text-base-content">{user?.name}</h1>
              <p className="text-base-content/70 mt-1">{user?.email}</p>
              {user?.bio && (
                <p className="text-base-content/60 mt-2 max-w-md">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200 mb-6 p-1">
        <button
          className={`tab tab-lg ${activeTab === "profile" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <FiUser className="w-4 h-4 mr-2" />
          Profile Info
        </button>
        <button
          className={`tab tab-lg ${activeTab === "picture" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("picture")}
        >
          <FiCamera className="w-4 h-4 mr-2" />
          Profile Picture
        </button>
        <button
          className={`tab tab-lg ${activeTab === "security" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <FiShield className="w-4 h-4 mr-2" />
          Security
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-card p-6 rounded-lg">{activeTab === "profile" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FiEdit3 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-base-content">Profile Information</h2>
          </div>

          {error &&
            <div className="alert alert-error mb-6 flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5" />
              <span>
                {error}
              </span>
            </div>}

          {formErrors.submit &&
            <div className="alert alert-error mb-6 flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5" />
              <span>
                {formErrors.submit}
              </span>
            </div>}

          {successMessage &&
            <div className="alert alert-success mb-6">
              {successMessage}
            </div>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-base-content">
                    <FiUser className="w-4 h-4 text-primary" />
                    Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input input-bordered w-full text-base-content ${formErrors.name
                    ? "input-error"
                    : ""}`}
                  placeholder="Your name"
                />
                {formErrors.name &&
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.name}
                    </span>
                  </label>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-base-content">
                    <FiMail className="w-4 h-4 text-primary" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input input-bordered w-full text-base-content ${formErrors.email
                    ? "input-error"
                    : ""}`}
                  placeholder="Your email"
                />
                {formErrors.email &&
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.email}
                    </span>
                  </label>}
              </div>

              {/* Bio Field - Full Width */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-base-content">
                    <FiEdit3 className="w-4 h-4 text-primary" />
                    Bio
                  </span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className={`textarea textarea-bordered w-full text-base-content ${formErrors.bio
                    ? "textarea-error"
                    : ""}`}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  maxLength="500"
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.bio ? (
                    <span className="label-text-alt text-error">
                      {formErrors.bio}
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <span className="label-text-alt text-base-content/50">
                    {formData.bio.length}/500
                  </span>
                </div>
              </div>

              <div className="form-control md:col-span-2">
                <button
                  type="submit"
                  className="btn btn-primary gap-2 w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  <FiSave className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === "picture" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FiCamera className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-base-content">Profile Picture</h2>
          </div>
          <ProfilePictureUpload />
        </div>
      )}

      {activeTab === "security" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <FiShield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-base-content">Security Settings</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-base-content">
                    <FiLock className="w-4 h-4 text-primary" />
                    New Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input input-bordered w-full text-base-content ${formErrors.password
                    ? "input-error"
                    : ""}`}
                  placeholder="Enter new password"
                />
                {formErrors.password &&
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.password}
                    </span>
                  </label>}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-base-content">
                    <FiLock className="w-4 h-4 text-primary" />
                    Confirm New Password
                  </span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input input-bordered w-full text-base-content ${formErrors.confirmPassword
                    ? "input-error"
                    : ""}`}
                  placeholder="Confirm new password"
                />
                {formErrors.confirmPassword &&
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {formErrors.confirmPassword}
                    </span>
                  </label>}
              </div>

              <div className="form-control md:col-span-2">
                <button
                  type="submit"
                  className="btn btn-primary gap-2 w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  <FiSave className="w-4 h-4" />
                  {isSubmitting ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}

export default Profile;
