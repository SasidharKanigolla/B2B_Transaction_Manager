// Import necessary modules
import React, { useState } from "react";
import { URL } from "../utils/Constants";
import { Link } from "react-router-dom";

import TransactionSaved from "../utils/TransactionSaved";
// Define Reset component
const Reset = () => {
  // State variables
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mob: "",
    password: "",
    confirmPassword: "",
  });
  const [errmsg, setErrmsg] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }

    // Reset error message
    setErrmsg("");

    try {
      // Send password reset request
      const response = await fetch(URL + "/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      // Check response status
      if (!response.ok) {
        const rr = await response.json();
        console.log(rr);
        throw new Error(rr.error);
      }

      // Reset form data
      setFormData({
        username: "",
        email: "",
        mob: "",
        password: "",
        confirmPassword: "",
      });

      // Display success message
      console.log("Password reset is successful");
      setShowRedirectMessage(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      // Redirect user to login page or display success message
    } catch (error) {
      // Handle error
      console.error("Error resetting password:", error);
      setErrmsg("" + error);
    }
  };

  // Render component
  return (
    <div>
      {!showRedirectMessage ? (
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-center w-[70%]">
            {/* Form header */}
            <div className="flex-col flex items-center">
              <h1 className="text-center text-3xl font-bold mb-6">
                Welcome to B2B Transaction Manager
              </h1>
              <img src="./B2B.png" alt="" className="w-28 mb-3 rounded-xl " />
              <div className="w-[60%]">
                <h1 className="font-bold text-3xl text-center mb-5">
                  Reset Password
                </h1>

                {/* Error message */}
                <h1 className="font-bold text-xl text-red-600 text-center mb-5">
                  {errmsg}
                </h1>
              </div>
            </div>
            {/* Reset password form */}
            <form onSubmit={handleSubmit} className="w-full">
              {/* Username field */}
              <div className="mb-5 w-full">
                <label
                  htmlFor="username"
                  className="flex font-semibold text-xl"
                >
                  User Name<p className="text-red-600">*</p>:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {/* Email field */}
              <div className="mb-5 w-full">
                <label htmlFor="email" className="flex font-semibold text-xl">
                  Email<p className="text-red-600">*</p>:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {/* Mobile number field */}
              <div className="mb-5 w-full">
                <label htmlFor="mob" className="flex font-semibold text-xl">
                  Mobile<p className="text-red-600">*</p>:
                </label>
                <input
                  type="tel"
                  id="mob"
                  name="mob"
                  value={formData.mob}
                  onChange={handleChange}
                  className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {/* Password field */}
              <div className="mb-5 w-full">
                <label
                  htmlFor="password"
                  className="flex font-semibold text-xl"
                >
                  Password<p className="text-red-600">*</p>:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {/* Confirm password field */}
              <div className="mb-5 w-full">
                <label
                  htmlFor="confirmPassword"
                  className="flex font-semibold text-xl"
                >
                  Confirm Password<p className="text-red-600">*</p>:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {/* Password mismatch message */}
              {passwordMismatch && (
                <p className="text-red-600 mb-3">Password does not match</p>
              )}
              {/* Submit button */}
              <div className="flex justify-between">
                <button className="bg-red-600 p-4 rounded-xl text-white font-bold">
                  Reset
                </button>
                <p className="font-bold my-5 underline hover:opacity-70">
                  <Link to={"/login"}>Know your password? Signin </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <TransactionSaved />
          <h1 className="text-center font-bold text-2xl">
            Password Resetted Successfully
          </h1>
          <h3 className="text-center">
            Page will be redirected automatically in 1 second
          </h3>
        </div>
      )}
    </div>
  );
};

// Export Reset component
export default Reset;
