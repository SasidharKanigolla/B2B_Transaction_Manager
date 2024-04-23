import React, { useContext, useState } from "react";
import { URL } from "../utils/Constants";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import bcrypt from "bcryptjs";
import TransactionSaved from "../utils/TransactionSaved";
import LoginShow from "./LoginShow";

const ChangePass = () => {
  const { loggedInUserId } = useContext(UserContext);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [formData, setFormData] = useState({
    username: loggedInUserId.username,
    email: "",
    mob: null,
    currPassword: "",
    NewPassword: "",
    confirmNewPassword: "",
  });
  const [errmsg, setErrmsg] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (loggedInUserId.email !== formData.email) {
      return setErrmsg("Email Id is wrong,Check Your Email");
    }
    if (Number(loggedInUserId.mob) !== Number(formData.mob)) {
      console.log(typeof(loggedInUserId.mob));
      console.log(typeof(formData.mob));
      return setErrmsg("Mobile Number is wrong,Check Your Mobile Number");
    }
    // Check if passwords match
    if (formData.NewPassword !== formData.confirmNewPassword) {
      setPasswordMismatch(true);
      return;
    } else {
      setPasswordMismatch(false);
    }
    // Reset error message
    setErrmsg("");

    try {
      // Send password reset request
      const response = await fetch(URL + "/changePassword", {
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
        username: loggedInUserId.username,
        email: "",
        mob: 0,
        currPassword: "",
        NewPassword: "",
        confirmNewPassword: "",
      });

      // Display success message
      console.log("Password reset is successful");
      setShowRedirectMessage(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      // Redirect user to login page or display success message
    } catch (error) {
      // Handle error
      console.error("Error resetting password:", error);
      setErrmsg("" + error);
    }
  };

  // Render component
  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div className="flex flex-col items-center w-full">
      {!showRedirectMessage ? (
        <div className="flex flex-col items-center w-[70%]">
          {/* Form header */}
          <div className="flex-col flex items-center">
            <div className="w-full">
              <h1 className="font-bold text-3xl text-center mb-5">
                Change Password
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
              <label htmlFor="username" className="flex font-semibold text-xl">
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
                readOnly
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
                type="number"
                id="mob"
                name="mob"
                value={formData.mob}
                onChange={handleChange}
                className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-5 w-full">
              <label
                htmlFor="currPassword"
                className="flex font-semibold text-xl"
              >
                Current Password<p className="text-red-600">*</p>:
              </label>
              <input
                type="password"
                id="currPassword"
                name="currPassword"
                value={formData.currPassword}
                onChange={handleChange}
                className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            {/* Password field */}
            <div className="mb-5 w-full">
              <label
                htmlFor="NewPassword"
                className="flex font-semibold text-xl"
              >
                New Password<p className="text-red-600">*</p>:
              </label>
              <input
                type="password"
                id="NewPassword"
                name="NewPassword"
                value={formData.NewPassword}
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
                Confirm New Password<p className="text-red-600">*</p>:
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            {/* Password mismatch message */}
            {passwordMismatch && (
              <p className="text-red-600 mb-3">
                New Password and Confirm New Password does not match
              </p>
            )}
            {/* Submit button */}
            <div className="flex justify-center">
              <button className="bg-red-600 p-4 rounded-xl text-white font-bold">
                Change Password
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <TransactionSaved />
          <h1 className="text-center font-bold text-2xl">
            Password Changed Successfully
          </h1>
          <h3 className="text-center">
            Page will be redirected automatically in 1 seconds
          </h3>
        </div>
      )}
    </div>
  );
};

export default ChangePass;
