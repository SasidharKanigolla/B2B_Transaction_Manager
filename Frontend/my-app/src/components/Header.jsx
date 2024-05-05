import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import Cookies from "js-cookie";

const Header = () => {
  // const [showLogout, setShowLogout] = useState(false);

  const { loggedInUserId, setUserInfo } = useContext(UserContext);
  // State for tracking network status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Event handler for network status changes
  const updateNetworkStatus = () => {
    setIsOnline(navigator.onLine);
  };

  // Add event listeners for online and offline events
  useEffect(() => {
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("userData");
    window.location.href = "/login";
    alert("Signed Out Successfully");
    setUserInfo(null);
  };

  return (
    <div className="w-[100%] h-16 bg-blue-100 flex justify-between mb-8">
      {loggedInUserId ? (
        <div className="flex items-center ml-2">
          <Link to="/" className="text-xl font-bold">
            Home
          </Link>
        </div>
      ) : (
        ""
      )}

      <div className="flex items-center w-full mx-4">
        <div className="mr-4 text-xl font-bold">{isOnline ? "🟢" : "🔴"}</div>
        {loggedInUserId ? (
          <div className="flex w-full justify-end ">
            <Link to="/ViewOrders" className="mx-2 text-xl font-bold">
              Orders
            </Link>
            <Link to="/search" className="mx-2 text-xl font-bold">
              Search
            </Link>
            <Link to="/viewStocks" className="mx-2 text-xl font-bold">
              Stocks
            </Link>
            <Link to="/AllParty" className="mx-2 text-xl font-bold">
              All Parties
            </Link>
            <Link to="/supplierHome" className="mx-2 text-xl font-bold">
              Purchases
            </Link>
            <Link to="/CustomerHome" className="mx-2 text-xl font-bold">
              Sales
            </Link>
            <button className="mx-2 text-xl font-bold" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex w-full justify-end ">
            <Link to="/signup" className="mx-2 text-xl font-bold">
              Sign Up
            </Link>
            <Link to="/login" className="mx-2 text-xl font-bold">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
