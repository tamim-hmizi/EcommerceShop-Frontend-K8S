import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetError } from "../../redux/slices/authSlice";
import { Link } from "react-router-dom";
import AuthIllustration from "./AuthIllustration";
import "../../styles/auth.css";
import { FiMail, FiLock, FiLogIn, FiUser, FiUserPlus } from "react-icons/fi";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [formState, setFormState] = useState({
    email: { valid: null, touched: false },
    password: { valid: null, touched: false }
  });

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  // Removed 3D tilt effect

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
    setFormState(prev => ({
      ...prev,
      password: {
        valid: value.length >= 6,
        touched: true
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    setLocalError("");
    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left side - Form */}
      <div
        ref={formRef}
        className="bg-base-100 rounded-2xl shadow-lg p-8 md:p-10 border border-base-300"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-base-content">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(localError || error) && (
            <div className="alert alert-error mb-4 animate-[error-shake_0.5s_ease-in-out]">
              {localError || error}
            </div>
          )}

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
                <p className="text-xs text-error mt-1">Password must be at least 6 characters</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span className="label-text text-base-content">Remember me</span>
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="link link-primary font-medium">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary hover:border-primary-focus hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
                <span className="ml-2">Signing In...</span>
              </>
            ) : (
              <>
                <FiLogIn className="w-5 h-5" />
                <span className="ml-2">Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="divider">Or</div>

        <div className="text-center">
          <p className="mb-4 text-base-content">
            Don't have an account?
          </p>
          <Link
            to="/register"
            className="btn btn-outline btn-secondary w-full gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-semibold border-2 hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2"
          >
            <FiUserPlus className="w-4 h-4" />
            Register Here
          </Link>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden md:block bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden shadow-lg">
        <div className="h-full flex items-center justify-center p-6">
          <AuthIllustration type="signin" />
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
