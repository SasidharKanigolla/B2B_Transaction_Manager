import React, { useState } from "react";
import { URL } from "../utils/Constants";
import { Link } from "react-router-dom";
import Loading from "../utils/Loading";
import TransactionSaved from "../utils/TransactionSaved";

const Signup = () => {
  const [errmsg, seterrmsg] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    buss_name: "",
    trans_pass: "",
    mob: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const lowercasedValue = name === "username" ? value.toLowerCase() : value;
    // console.log(formData.mob.length);
    setFormData({
      ...formData,
      [name]: lowercasedValue,
    });
  };

  const signup = (e) => {
    setIsLoading(true);
    console.log(formData);
    formData.email = formData.email.trim()?.replace(/\s+/g, " ");
    e.preventDefault();
    if (formData.mob.length !== 10) {
      setIsLoading(false);
      return alert("Enter Mobile number Correctly");
    }
    const data = fetch(URL + "/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false);
          throw new Error("User Already Exists");
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        console.log("Success:", data);
        // window.location.href = "/login";
        setShowRedirectMessage(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        // Handle successful signup, e.g., redirect to another page
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Signup error:", error);
        // Handle error response from the server
        seterrmsg(error.message); // Set error message directly from the error object
      });
  };

  return (
    <div>
      {!showRedirectMessage ? (
        <div>
          {!isLoading ? (
            <div className="flex flex-col items-center">
              <h1 className="text-center text-3xl font-bold mb-3">
                Welcome to B2B Transaction Manager
              </h1>
              <div className="w-[60%] flex flex-col items-center">
                <img src="./B2B.png" alt="" className="w-28 my-3" />
                <h1 className="font-bold text-3xl text-center mb-3">Sign Up</h1>
                <h1 className="font-bold text-xl text-center mb-5 text-red-600">
                  {errmsg}
                </h1>
                <form onSubmit={signup} className="w-full">
                  <div className="mb-5 w-full">
                    <label
                      htmlFor="buss_name"
                      className="flex font-semibold text-xl"
                    >
                      Name of the Bussiness <p className="text-red-600">*</p>:
                    </label>
                    <input
                      type="text"
                      id="buss_name"
                      name="buss_name"
                      value={formData.buss_name}
                      onChange={handleChange}
                      className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-5 w-full">
                    <label
                      htmlFor="username"
                      className="flex font-semibold text-xl"
                    >
                      Username<p className="text-red-600">*</p>:
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
                  <div className="mb-5 w-full">
                    <label
                      htmlFor="email"
                      className="flex font-semibold text-xl"
                    >
                      Email Id<p className="text-red-600">*</p>:
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
                  <div className="mb-5 w-full">
                    <label htmlFor="mob" className="flex font-semibold text-xl">
                      Mobile<p className="text-red-600">*</p>:
                    </label>
                    <input
                      type="Number"
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
                  <div className="mb-5 w-full">
                    <label
                      htmlFor="trans_pass"
                      className="flex font-semibold text-xl"
                    >
                      Transaction Password
                      <p className="font-bold text-red-600">
                        (CANNOT BE CHANGED LATER)
                      </p>
                      <p className="text-red-600">*</p>:
                    </label>
                    <input
                      type="password"
                      id="trans_pass"
                      name="trans_pass"
                      value={formData.trans_pass}
                      onChange={handleChange}
                      className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <button className="bg-red-600 p-4 rounded-xl text-white font-bold">
                      Sign Up
                    </button>
                    <p className="font-bold my-5 underline hover:opacity-70">
                      <Link to={"/login"}>Already Registered? Signin </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      ) : (
        <div>
          <TransactionSaved />
          <h1 className="text-center font-bold text-2xl">
            Signed Up Successfully
          </h1>
          <h3 className="text-center">
            Page will be redirected automatically in 1 second
          </h3>
        </div>
      )}
    </div>
  );
};

export default Signup;
