import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../utils/UserContext";
import { URL } from "../../utils/Constants";
import LoginShow from "../LoginShow";
import Loading from "../../utils/Loading";

import TransactionSaved from "../../utils/TransactionSaved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

const NewStockItem = () => {
  const [stockData, setStockData] = useState([]);
  const { loggedInUserId } = useContext(UserContext);
  const [errmsg, seterrmsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [newStockItem, setNewStockItem] = useState({
    name_of_prod: "",
    quantity: 0,
    pricePerUnit: 0,
    amount: 0,
    transaction_type: "Opening Balance",
    date: new Date(),
    owner: loggedInUserId,
  });

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const jsonData = await fetch(URL + "/stock/getStocks", {
      credentials: "include",
    });
    const data = await jsonData.json();
    const stock = data.filter((data) => {
      return data?.owner === loggedInUserId?._id;
    });
    console.log(stock);
    setStockData(stock);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    // Update newStockItem state as user types
    const { name, value } = e.target;

    // Parse value to a number if it's not empty
    const parsedValue =
      name === "name_of_prod" ? value : value === "" ? "" : parseFloat(value);

    let amount = newStockItem.amount;
    if (name === "quantity") {
      amount = isNaN(parsedValue)
        ? 0
        : parsedValue * parseFloat(newStockItem.pricePerUnit);
    } else if (name === "pricePerUnit") {
      amount = isNaN(parsedValue)
        ? 0
        : parseFloat(newStockItem.quantity) * parsedValue;
    }

    setNewStockItem({
      ...newStockItem,
      [name]: parsedValue,
      amount: amount, // Keep amount rounded to 2 decimal places
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (newStockItem.quantity === null || newStockItem.quantity === "") {
      newStockItem.quantity = 0;
      newStockItem.amount = 0;
    }

    if (
      newStockItem.pricePerUnit === null ||
      newStockItem.pricePerUnit === ""
    ) {
      newStockItem.pricePerUnit = 0;
      newStockItem.amount = 0;
    }
    console.log(newStockItem);
    if (!newStockItem.name_of_prod) {
      setIsLoading(false);

      seterrmsg("Enter the name of stock");
      return;
    }
    const stockExists = stockData?.some(
      (stock) =>
        stock?.name_of_prod.trim().replace(/\s+/g, " ").toLowerCase() ===
        newStockItem?.name_of_prod.trim().replace(/\s+/g, " ").toLowerCase()
    );
    if (stockExists) {
      setIsLoading(false);

      seterrmsg("Product already exists");
      // alert("Customer already exists");
      return; // Prevent form submission
    }
    seterrmsg("");
    try {
      const newStockTransactionResponse = await fetch(
        URL + "/stock/newSupplierStockTrans",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...newStockItem, // Associate the stock with its transaction
          }),
        }
      );

      if (!newStockTransactionResponse.ok) {
        throw new Error("Failed to add new supplier stock transaction");
      }

      // Reset form state and handle success
      setNewStockItem({
        name_of_prod: "",
        quantity: 0,
        pricePerUnit: 0,
        amount: 0,
        owner: loggedInUserId,
      });
      seterrmsg("");
      setIsLoading(false);
      setShowRedirectMessage(true);
      setTimeout(() => {
        window.location.href = "/viewStocks";
      }, 1000);
    } catch (error) {
      setIsLoading(false);

      seterrmsg(error.message);
      console.error("Error adding stock item:", error);
      // Handle error (e.g., display error message)
    }
  };

  return loggedInUserId === null ? (
    <div>
      <LoginShow />
    </div>
  ) : (
    <div>
      {!showRedirectMessage ? (
        <div className="flex flex-col items-center w-full">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="bg-white rounded-lg flex flex-col w-[80%]">
              <h2 className="text-2xl font-bold text-center my-3">
                Add New Stock Item
              </h2>
              <p className="mb-3 text-red-600 text-center">{errmsg}</p>
              <div className="flex flex-col items-center w-full">
                <div className="w-full my-2">
                  <label
                    htmlFor="name_of_prod"
                    className="flex font-semibold text-xl mb-2"
                  >
                    Name
                    <p className="text-red-600">*</p>
                  </label>
                  <input
                    type="text"
                    name="name_of_prod"
                    placeholder="Name"
                    value={newStockItem.name_of_prod}
                    onChange={handleChange}
                    className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="w-full my-2">
                  <label
                    htmlFor="quantity"
                    className="flex font-semibold text-xl mb-2"
                  >
                    Opening Quantity:
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={
                      newStockItem.quantity === 0 ? "" : newStockItem.quantity
                    }
                    onChange={handleChange}
                    required
                    className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full my-2">
                  <label
                    htmlFor="pricePerUnit"
                    className="flex font-semibold text-xl mb-2"
                  >
                    Price Per Unit:
                  </label>
                  <input
                    type="number"
                    name="pricePerUnit"
                    placeholder="Price"
                    value={
                      newStockItem.pricePerUnit === 0
                        ? ""
                        : newStockItem.pricePerUnit
                    }
                    onChange={handleChange}
                    required
                    className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full my-2">
                  <label
                    htmlFor="amount"
                    className="flex font-semibold text-xl mb-2"
                  >
                    Amount:
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Price"
                    value={newStockItem.amount === 0 ? "" : newStockItem.amount}
                    onChange={handleChange}
                    readOnly
                    className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <button
                    className="bg-green-600 mt-3 text-white p-2 rounded"
                    onClick={handleSubmit}
                  >
                    Submit <FontAwesomeIcon icon={faArrowRightToBracket} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <TransactionSaved />
          <h1 className="text-center font-bold text-2xl">
            Stock Item Added Successfully
          </h1>
          <h3 className="text-center">
            Page will be redirected automatically in 1 second
          </h3>
        </div>
      )}
    </div>
  );
};

export default NewStockItem;
