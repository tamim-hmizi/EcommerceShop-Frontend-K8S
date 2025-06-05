import { useState, useRef, useEffect } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthIllustration from "./AuthIllustration";
import "../../styles/auth.css";
import { FiMail, FiLock, FiUser, FiUserPlus, FiCheckCircle, FiLogIn } from "react-icons/fi";

function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: { valid: null, touched: false },
    email: { valid: null, touched: false },
    password: { valid: null, touched: false },
    confirmPassword: { valid: null, touched: false }
  });

  const formRef = useRef(null);

  // Removed 3D tilt effect

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setFormState(prev => ({
      ...prev,
      name: {
        valid: value.length >= 2,
        touched: true
      }
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setFormState(prev => ({
      ...prev,
      email: {
        valid: value ? validateEmail(value) : null,
        touched: true
      }
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const isValid = value.length >= 8;

    setFormState(prev => ({
      ...prev,
      password: {
        valid: isValid,
        touched: true
      },
      confirmPassword: {
        ...prev.confirmPassword,
        valid: confirmPassword ? confirmPassword === value && isValid : null
      }
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setFormState(prev => ({
      ...prev,
      confirmPassword: {
        valid: value === password && password.length >= 8,
        touched: true
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await register({ name, email, password });
      if (!response.success) {
        setError(response.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Show success animation before redirecting
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left side - Illustration */}
      <div className="hidden md:block bg-gradient-to-br from-success/10 to-primary/10 rounded-lg overflow-hidden shadow-lg">
        <div className="h-full flex items-center justify-center p-6">
          <AuthIllustration type="register" />
        </div>
      </div>

      {/* Right side - Form */}
      <div
        ref={formRef}
        className="bg-base-100 rounded-2xl shadow-lg p-8 md:p-10 border border-base-300"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-base-content">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="alert alert-error mb-4 animate-[error-shake_0.5s_ease-in-out]">
              {error}
            </div>
          )}

          <div className="form-control">
            <label htmlFor="name" className="label">
              <span className="label-text flex items-center gap-2 text-base-content font-medium">
                <FiUser className="text-primary" />
                Full Name
              </span>
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                className={`input input-bordered w-full ${
                  formState.name.touched
                    ? formState.name.valid
                      ? 'input-success'
                      : formState.name.valid === false
                        ? 'input-error'
                        : ''
                    : ''
                }`}
                value={name}
                onChange={handleNameChange}
                placeholder="John Doe"
              />
              {formState.name.touched && formState.name.valid === false && (
                <p className="text-xs text-error mt-1">Name must be at least 2 characters</p>
              )}
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text flex items-center gap-2 text-base-content font-medium">
                <FiMail className="text-primary" />
                Email Address
              </span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className={`input input-bordered w-full ${
                  formState.email.touched
                    ? formState.email.valid
                      ? 'input-success'
                      : formState.email.valid === false
                        ? 'input-error'
                        : ''
                    : ''
                }`}
                value={email}
                onChange={handleEmailChange}
                placeholder="your@email.com"
              />
              {formState.email.touched && formState.email.valid === false && (
                <p className="text-xs text-error mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text flex items-center gap-2 text-base-content font-medium">
                <FiLock className="text-primary" />
                Password
              </span>
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className={`input input-bordered w-full ${
                  formState.password.touched
                    ? formState.password.valid
                      ? 'input-success'
                      : formState.password.valid === false
                        ? 'input-error'
                        : ''
                    : ''
                }`}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
              />
              {formState.password.touched && formState.password.valid === false && (
                <p className="text-xs text-error mt-1">Password must be at least 8 characters</p>
              )}
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="confirmPassword" className="label">
              <span className="label-text flex items-center gap-2 text-base-content font-medium">
                <FiCheckCircle className="text-primary" />
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                className={`input input-bordered w-full ${
                  formState.confirmPassword.touched
                    ? formState.confirmPassword.valid
                      ? 'input-success'
                      : formState.confirmPassword.valid === false
                        ? 'input-error'
                        : ''
                    : ''
                }`}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="••••••••"
              />
              {formState.confirmPassword.touched && formState.confirmPassword.valid === false && (
                <p className="text-xs text-error mt-1">Passwords must match</p>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="checkbox checkbox-primary"
                required
              />
              <span className="label-text text-base-content">
                I agree to the <a href="#" className="link link-primary">Terms of Service</a> and <a href="#" className="link link-primary">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating Account...
              </>
            ) : (
              <>
                <FiUserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="divider">Or</div>

        <div className="text-center">
          <p className="mb-4 text-base-content">
            Already have an account?
          </p>
          <Link
            to="/signin"
            className="btn btn-outline btn-primary w-full gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-semibold border-2 hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            <FiLogIn className="w-4 h-4" />
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
