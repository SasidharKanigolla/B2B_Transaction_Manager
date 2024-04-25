import { useState, useEffect, useContext } from "react";
import { URL } from "../utils/Constants";
import { Link, useParams } from "react-router-dom";
import UserContext from "../utils/UserContext";
import LoginShow from "./LoginShow";
import NotOwner from "../utils/NotOwner";
import Loading from "../utils/Loading";
import Cookies from "js-cookie";
import TransactionSaved from "../utils/TransactionSaved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

// console.log(user);

const EditParty = () => {
  const { id } = useParams();
  const { loggedInUserId } = useContext(UserContext);
  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [requiredCustomer, setRequiredCustomer] = useState({
    name: "",
    mobile: "",
    gst: "",
    bankName: "",
    bankAccountNumber: 0,
    bankIfsc: "",
    address: "",
  });
  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, [loggedInUserId]);

  const fetchData = async () => {
    setIsLoading(true);
    // setPrevPageUrl(window.location.href);
    const jsonData = await fetch(URL + "/customer", { credentials: "include" });
    const data = await jsonData.json();
    const cust = data[0].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    const requiredcust = cust.find((data) => data._id === id);
    setRequiredCustomer(requiredcust);
    const anothercust = cust.filter((data) => data._id !== id);
    // console.log(!requiredcust);
    setCustomersData(anothercust);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequiredCustomer({
      ...requiredCustomer,
      [name]: value,
    });
  };

  const addCustomer = (e) => {
    // const user = Cookies.get("userData");
    // if (user._id === loggedInUserId._id) {
    e.preventDefault();
    setIsLoading(true);
    // Access form fields directly

    const customerExists = customersData.some((customer) => {
      const nameMatch =
        customer.name.trim().replace(/\s+/g, " ").toLowerCase() ===
        requiredCustomer.name.trim().replace(/\s+/g, " ").toLowerCase();
      return nameMatch;
    });

    if (customerExists) {
      setIsLoading(false);
      alert("Party name already exists");
      return; // Prevent form submission
    }

    fetch(URL + "/customer/editcustomer/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requiredCustomer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setIsLoading(false);
        setShowRedirectMessage(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);

        return response.json();
      })
      .then((data) => {
        // console.log("Success:", data);
        // Reset form fields after successful submission
        e.target.reset();
        // console.log(e.target.name);
      })
      .catch((error) => {
        setIsLoading(false);

        console.error("Error:", error);
      });
    // } else {
    //   window.location.href = "/";
    //   // <LoginShow />;
    // }
  };

  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {!showRedirectMessage ? (
            <div>
              {requiredCustomer ? (
                <div className="flex flex-col items-center">
                  <h1 className="text-3xl font-bold mb-10 text-center">
                    Edit Party Details
                  </h1>
                  <div className="w-[70%] flex flex-col justify-center items-center">
                    <form action="" className="w-full " onSubmit={addCustomer}>
                      <div className="mb-5">
                        <label
                          htmlFor="name"
                          className="flex font-semibold text-xl"
                        >
                          Name
                          <p className="text-red-600">*</p>
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={requiredCustomer?.name}
                          onChange={handleInputChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="number"
                          className="flex font-semibold text-xl"
                        >
                          Mobile Number
                          <p className="text-red-600">*</p>
                        </label>
                        <input
                          type="number"
                          name="mobile"
                          id="mobile"
                          value={requiredCustomer?.mobile}
                          onChange={handleInputChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="gst"
                          className="block font-semibold text-xl"
                        >
                          GSTIN
                        </label>
                        <input
                          type="text"
                          name="gst"
                          id="gst"
                          value={requiredCustomer?.gst}
                          onChange={handleInputChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      {/* Changed Here */}
                      <div className="mb-5">
                        <label
                          htmlFor="bankName"
                          className="flex font-semibold text-xl "
                        >
                          Bank Name
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          id="bankName"
                          value={requiredCustomer?.bankName}
                          onChange={handleInputChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                          // required
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="mb-5 w-[70%] mr-5">
                          <label
                            htmlFor="bankAccountNumber"
                            className="flex font-semibold text-xl "
                          >
                            Bank Account Number
                          </label>
                          <input
                            type="number"
                            name="bankAccountNumber"
                            id="bankAccountNumber"
                            value={requiredCustomer?.bankAccountNumber}
                            onChange={handleInputChange}
                            className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                            // required
                          />
                        </div>
                        <div className="mb-5 w-[30%]">
                          <label
                            htmlFor="bankIfsc"
                            className="flex font-semibold text-xl "
                          >
                            IFSC CODE
                          </label>
                          <input
                            type="text"
                            name="bankIfsc"
                            id="bankIfsc"
                            value={requiredCustomer?.bankIfsc}
                            onChange={handleInputChange}
                            className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                            // required
                          />
                        </div>
                      </div>
                      {/* Changed Here */}
                      <div className="mb-4">
                        <label
                          htmlFor="address"
                          className="block font-semibold text-xl"
                        >
                          Address
                        </label>
                        <textarea
                          name="address"
                          id="address"
                          cols="30"
                          rows="3"
                          value={requiredCustomer?.address}
                          onChange={handleInputChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                        ></textarea>
                      </div>
                      {requiredCustomer ? (
                        <div className="flex justify-center mb-40">
                          <button className="bg-red-600 text-white p-4 rounded-xl">
                            Submit{" "}
                            <FontAwesomeIcon icon={faArrowRightToBracket} />
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </form>
                  </div>
                </div>
              ) : (
                <NotOwner />
              )}
            </div>
          ) : (
            <div>
              <TransactionSaved />
              <h1 className="text-center font-bold text-2xl">
                Party Edited Successfully
              </h1>
              <h3 className="text-center">
                Page will be redirected automatically in 1 second
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditParty;
