import { useState, useEffect, useContext } from "react";
import { URL } from "../utils/Constants";
import UserContext from "../utils/UserContext";
import { Link } from "react-router-dom";
import LoginShow from "./LoginShow";
import Loading from "../utils/Loading";
import TransactionSaved from "../utils/TransactionSaved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

const NewParty = () => {
  const { loggedInUserId } = useContext(UserContext);
  const [customersData, setCustomersData] = useState([]);
  const [errmsg, seterrmsg] = useState("");
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    // setPrevPageUrl(window.location.href);
    // console.log(prevPageUrl);
    const jsonData = await fetch(URL + "/customer", { credentials: "include" });
    const data = await jsonData.json();
    const cust = data[0]?.filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    console.log(cust);
    setCustomersData(cust);
    setIsLoading(false);
  };

  const addCustomer = (e) => {
    e.preventDefault();
    seterrmsg("");
    // Access form fields directly
    const formData = {
      name: e.target.name.value.substring(0, 40),
      mobile: e.target.mobile.value,
      gst: e.target.gst.value,
      address: e.target.address.value,
      bankName: e?.target?.bankName?.value,
      bankAccountNumber: e?.target?.bankAccountNumber?.value,
      bankIfsc: e?.target?.bankIfsc?.value,
      owner: loggedInUserId,
    };
    console.log(formData);

    const customerExists = customersData?.some(
      (customer) =>
        customer?.name.trim().replace(/\s+/g, " ").toLowerCase() ===
        formData?.name.trim().replace(/\s+/g, " ").toLowerCase()
    );

    if (customerExists) {
      seterrmsg("Party already exists");
      // alert("Customer already exists");
      return; // Prevent form submission
    }
    setIsLoading(true);

    fetch(URL + "/customer/newCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          // console.log(data);
          throw new Error(data.error);
        }
        setIsLoading(false);
        setShowRedirectMessage(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data.error);
        // Reset form fields after successful submission
        e.target.reset();
        // console.log(e.target.name);
      })
      .catch((error) => {
        setIsLoading(false);
        let errorMessage =
          "An error occurred while processing your request. Please try again later.";
        if (error.message) {
          const regex = /duplicate key error.*\{(.*?)\}/i;
          const match = error.message.match(regex);
          if (match && match.length > 1) {
            const fields = match[1].split(":");
            const field = fields[0].trim();
            errorMessage = `The ${field} is already in use. Please use a different ${field}.`;
          }
        }

        seterrmsg(errorMessage);
        console.error("Error:", error);
      });
  };

  return loggedInUserId === null ? (
    <div className="w-full flex flex-col items-center">
      <LoginShow />
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {!showRedirectMessage ? (
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold mb-10 text-center">
                Add New Party
              </h1>
              <div className="w-[70%] flex flex-col justify-center items-center">
                <div className="mb-3 text-red-600">{"" + errmsg}</div>
                <form action="" className="w-full " onSubmit={addCustomer}>
                  <div className="mb-5">
                    <label
                      htmlFor="name"
                      className="flex font-semibold text-xl "
                    >
                      Name
                      <p className="text-red-600">*</p>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
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
                      className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div className="flex justify-center mb-40">
                    <button className="bg-red-600 text-white p-4 rounded-xl">
                      Submit <FontAwesomeIcon icon={faArrowRightToBracket} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div>
              <TransactionSaved />
              <h1 className="text-center font-bold text-2xl">
                New Party Added Successfully
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

export default NewParty;
