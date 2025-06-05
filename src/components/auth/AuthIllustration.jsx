import React from "react";
import {
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiShield,
  FiCreditCard
} from "react-icons/fi";

// Static illustration component that replaces the animated canvas version
const AuthIllustration = ({ type = "signin" }) => {
  // Colors based on auth type - using DaisyUI theme colors
  const primaryColor = type === "signin" ? "text-primary" : "text-success";
  const secondaryColor = type === "signin" ? "text-secondary" : "text-primary";

  return (
    <div className="w-full h-full rounded-lg bg-base-200/50 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold ${primaryColor} mb-2`}>
          {type === "signin" ? "Welcome Back" : "Join Our Community"}
        </h3>
        <p className="text-base-content/70">
          {type === "signin"
            ? "Sign in to access your account and continue shopping"
            : "Create an account to start shopping and track your orders"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <div className="flex flex-col items-center p-4 bg-base-100 rounded-lg shadow-sm border border-base-300">
          <FiShoppingCart className={`w-8 h-8 ${primaryColor} mb-2`} />
          <span className="text-sm text-base-content/70">Shop Products</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-base-100 rounded-lg shadow-sm border border-base-300">
          <FiUser className={`w-8 h-8 ${secondaryColor} mb-2`} />
          <span className="text-sm text-base-content/70">Manage Profile</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-base-100 rounded-lg shadow-sm border border-base-300">
          <FiPackage className={`w-8 h-8 ${primaryColor} mb-2`} />
          <span className="text-sm text-base-content/70">Track Orders</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-base-100 rounded-lg shadow-sm border border-base-300">
          <FiShield className={`w-8 h-8 ${secondaryColor} mb-2`} />
          <span className="text-sm text-base-content/70">Secure Checkout</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className={`${primaryColor} font-medium`}>
          {type === "signin"
            ? "Secure login with encrypted connection"
            : "Fast and secure registration process"}
        </p>
      </div>
    </div>
  );
};

export default AuthIllustration;
