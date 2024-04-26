import React, { useContext, useState } from "react";
import UserContext from "../utils/UserContext";
import CryptoJS from "crypto-js";
import { URL } from "../utils/Constants";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import TransactionSaved from "../utils/TransactionSaved";

const secretKey = "your-secret-key"; // Replace with your actual secret key
function encryptData(data) {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

function decryptData(encryptedData) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    // Convert the bytes to a UTF-8 encoded string
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Return null or handle error as needed
  }
}

const Login = () => {
  const { setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState("/");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errmsg, seterrmsg] = useState("");
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const lowercasedValue = name === "username" ? value.toLowerCase() : value;
    setFormData({ ...formData, [name]: lowercasedValue });
  };

  const login = async (e) => {
    e.preventDefault();
    const data = await fetch(URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // const expires = new Date(Date.now() + 30 * 60 * 1000);
        // Cookies.set("userData", JSON.stringify(data.user), {
        //   expires,
        // });
        // setUserInfo(data.user);
        const encryptedUserData = encryptData(JSON.stringify(data.user));
        const expires = new Date(Date.now() + 30 * 60 * 1000);
        Cookies.set("userData", encryptedUserData, { expires });

        // Update state with user data
        setUserInfo(data.user);
        setShowRedirectMessage(true);
        setTimeout(() => {
          window.location.href = redirect;
        }, 1000);
      })
      .catch((error) => {
        console.error("Login error:", error);
        // Check if the error status is 401 (Unauthorized)
        seterrmsg("Incorrect username or password");
      });
  };

  return (
    <div>
      {!showRedirectMessage ? (
        <div className="flex flex-col items-center">
          <h1 className="text-center text-3xl font-bold mb-6">
            Welcome to B2B Transaction Manager
          </h1>
          <img src="./B2B.png" alt="" className="w-28 mb-3 rounded-xl " />
          <div className="w-[60%]">
            <h1 className="font-bold text-3xl text-center mb-5">Sign In</h1>

            <h1 className="font-bold text-xl text-red-600 text-center mb-5">
              {errmsg}
            </h1>
            <form onSubmit={login}>
              <div className="mb-5 w-full">
                <label
                  htmlFor="username"
                  className="block font-semibold text-xl"
                >
                  Username:
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
                  htmlFor="password"
                  className="block font-semibold text-xl"
                >
                  Password:
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
                  htmlFor="rediret"
                  className="block font-semibold text-xl"
                >
                  Redirect To{" "}
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </label>
                <select
                  name="rediret"
                  id="rediret"
                  defaultValue={redirect}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setRedirect(e.target.value);
                  }}
                  className="w-[40%] border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                >
                  <option value="/">Home</option>
                  <option value="/CustomerHome">Sales</option>
                  <option value="/SupplierHome">Purchases</option>
                  <option value="/viewStocks">Stock</option>
                </select>
              </div>
              <div className="flex justify-between">
                <p className="font-bold my-5 underline hover:opacity-70">
                  <Link to={"/reset"}>Forgot Password? Reset Password</Link>
                </p>
                <button className="bg-red-600 p-4 rounded-xl text-white font-bold">
                  Login
                </button>
                <p className="font-bold my-5 underline hover:opacity-70">
                  <Link to={"/signup"}>Not Registered? Signup</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <TransactionSaved />
          <h1 className="text-center font-bold text-2xl">
            Logged In Successfully
          </h1>
          <h3 className="text-center">
            Page will be redirected automatically in 1 second
          </h3>
        </div>
      )}
    </div>
  );
};

export default Login;
