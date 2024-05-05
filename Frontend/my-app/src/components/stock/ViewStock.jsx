import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import { URL } from "../../utils/Constants";
import LoginShow from "../LoginShow";
import NotOwner from "../../utils/NotOwner";
import Loading from "../../utils/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faSliders,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import bcrypt from "bcryptjs";
import TransactionSaved from "../../utils/TransactionSaved";

const ViewStock = () => {
  const { id } = useParams();
  const [stockData, setStockData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const { loggedInUserId } = useContext(UserContext);
  const [avgCost, setAvgCost] = useState(0);
  const [errmsg, seterrmsg] = useState("");
  const [addStockShow, setAddStockShow] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  const [newStockItem, setNewStockItem] = useState({
    quantity: 0,
    pricePerUnit: 0,
    amount: 0,
    transaction_type: "",
    date: new Date(),
    owner: loggedInUserId,
  });

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, [loggedInUserId]);

  const fetchData = async () => {
    setIsLoading(true);
    const jsonData = await fetch(URL + "/stock/getStockData/" + id, {
      credentials: "include",
    });
    const data = await jsonData.json();
    const trans = data[1]?.filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    // console.log(data);
    if (data[0]?.owner === loggedInUserId._id) {
      setStockData(data[0]);
      setTransactionData(trans);
    }
    let avgcost = 0;
    let totalQuantity = 0;
    const relevantTransactions = trans.filter(
      (item) =>
        item.transaction_type === "Opening Balance" ||
        item.transaction_type === "Supplier" ||
        item.transaction_type === "Add Stock"
    );
    relevantTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(relevantTransactions);
    if (relevantTransactions.length > 0) {
      setAvgCost(relevantTransactions[0].pricePerUnit);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    // Update newStockItem state as user types
    const { name, value } = e.target;

    // Parse value to a number if it's not empty
    const parsedValue =
      name === "transaction_type"
        ? value
        : value === ""
        ? ""
        : parseFloat(value);

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
    if (!newStockItem.transaction_type) {
      setIsLoading(false);
      seterrmsg("Select transaction type");
      return;
    }
    if (
      isNaN(newStockItem.quantity) ||
      isNaN(newStockItem.pricePerUnit) ||
      isNaN(newStockItem.amount)
    ) {
      setIsLoading(false);
      seterrmsg("Please enter valid quantity, price per unit, and amount");
      return;
    }
    try {
      let endpoint = "";
      if (newStockItem.transaction_type === "Add Stock") {
        endpoint = "/stock/newSupplierStockTrans";
      } else if (newStockItem.transaction_type === "Reduce Stock") {
        endpoint = "/stock/newCustomerStockTrans";
      } else {
        setIsLoading(false);
        seterrmsg("Invalid transaction type");
        return;
      }
      const response = await fetch(URL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productName: stockData.name_of_prod,
          quantity: newStockItem.quantity,
          pricePerUnit: newStockItem.pricePerUnit,
          amount: newStockItem.amount,
          transaction_type: newStockItem.transaction_type,
          date: new Date(),
          owner: loggedInUserId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new stock transaction");
      }

      setNewStockItem({
        quantity: 0,
        pricePerUnit: 0,
        amount: 0,
        transaction_type: "",
        date: new Date(),
        owner: loggedInUserId,
      });
      seterrmsg("");
      setIsLoading(false);
      setAddStockShow(false); // Hide the adjust stock form
      fetchData(); // Fetch updated data after submission
      alert("Stock Adjusted Successfully");
    } catch (error) {
      setIsLoading(false);

      seterrmsg(error.message);
      console.error("Error adding stock transaction:", error);
      // Handle error (e.g., display error message)
    }
  };
  const deleteStock = async () => {
    console.log(await bcrypt.compare(password, loggedInUserId.deleteTrans));
    if ((await bcrypt.compare(password, loggedInUserId.deleteTrans)) === true) {
      const relevantTransactions = transactionData.filter(
        (item) =>
          item.transaction_type === "Customer" ||
          item.transaction_type === "Supplier"
      );
      if (relevantTransactions.length === 0) {
        const data = await fetch(URL + "/stock/deleteStock/" + id, {
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              setShowRedirectMessage(true);
              setTimeout(() => {
                window.location.href = "/viewStocks";
              }, 1000);
              return response.json();
            } else {
              throw new Error("Delete transaction not processed");
            }
          })
          .catch((error) => {
            console.error("Error : ", error);
          });
      } else {
        alert(
          "Delete all the Supplier and Customers transaction first then try deleting this one."
        );
      }
    } else {
      setpasswordError("Invalid Password");
    }
  };

  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : stockData.length === 0 ? (
        <NotOwner />
      ) : (
        <div className="flex flex-col items-center w-full">
          {!showRedirectMessage ? (
            <div className="flex flex-col items-center w-[80%]">
              {/* <h1 className="text-2xl font-bold">Stock Data</h1> */}
              <div className="w-[50%] bg-gray-200 my-3 py-3 rounded-xl font-bold">
                <p className="text-center px-3 text-2xl mb-3">
                  {stockData?.name_of_prod}
                </p>
                <div className="flex justify-between px-12">
                  <p>Total Quantity : {stockData?.total_quan}</p>
                  <p>
                    Total Value :{" "}
                    {(stockData?.total_quan * avgCost || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              {stockData && stockData.length !== 0 ? (
                <div className="w-[70%] flex justify-between">
                  <button
                    className="px-4 bg-red-600 text-white rounded-xl py-2"
                    onClick={() => {
                      setAddStockShow(!addStockShow);
                      setNewStockItem({
                        quantity: 0,
                        pricePerUnit: 0,
                        amount: 0,
                        transaction_type: "",
                        date: new Date(),
                        owner: loggedInUserId,
                      });
                    }}
                  >
                    Adjust Stock &nbsp;{" "}
                    <FontAwesomeIcon icon={faSliders} rotation={270} />
                  </button>

                  <div className="w-[50%]">
                    <input
                      type="password"
                      placeholder="Enter Transaction Password to Delete Stock"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full font-bold border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                    />
                    {passwordError && (
                      <p className="text-red-500">{passwordError}</p>
                    )}
                  </div>
                  <button
                    className="px-4 bg-red-600 text-white rounded-xl py-2"
                    onClick={() => deleteStock()}
                  >
                    Delete Stock &nbsp; <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ) : (
                ""
              )}
              {addStockShow ? (
                <div className="flex flex-col items-center w-full">
                  <div className="bg-white rounded-lg flex flex-col w-[80%] items-center">
                    <h2 className="text-2xl font-bold text-center my-3">
                      Adjsut Stock
                    </h2>
                    <p className="mb-3 text-red-600 text-center">{errmsg}</p>
                    <div className="flex  items-center w-full">
                      <div className="w-full my-2 mr-5">
                        <label
                          htmlFor="transaction_type"
                          className="flex font-semibold text-xl mb-2"
                        >
                          Transaction Type
                          <p className="text-red-600">*</p>
                        </label>
                        <select
                          type="text"
                          name="transaction_type"
                          placeholder="Name"
                          value={newStockItem.transaction_type}
                          onChange={handleChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                          required
                        >
                          <option value="">Select Option</option>
                          <option value="Add Stock">Add Stock</option>
                          <option value="Reduce Stock">Reduce Stock</option>
                        </select>
                      </div>
                      <div className="w-full my-2 mr-5">
                        <label
                          htmlFor="quantity"
                          className="flex font-semibold text-xl mb-2"
                        >
                          Quantity:
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          placeholder="Quantity"
                          value={
                            newStockItem.quantity === 0
                              ? ""
                              : newStockItem.quantity
                          }
                          onChange={handleChange}
                          required
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="w-full my-2 mr-5">
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
                      <div className="w-full my-2 mr-5">
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
                          value={
                            newStockItem.amount === 0 ? "" : newStockItem.amount
                          }
                          onChange={handleChange}
                          readOnly
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                        />
                      </div>
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
              ) : (
                ""
              )}

              <div className=" w-full">
                <h1 className="text-2xl font-bold text-center my-5">
                  Stock Transactions
                </h1>
                <div className="border border-black">
                  <div className="w-full border flex mb-2">
                    <p className="w-1/6 bg-gray-600 border-r-4 text-white text-center">
                      Date
                    </p>
                    <p className="w-1/6 bg-gray-600 border-r-4 text-white text-center">
                      Transaction Type
                    </p>
                    <p className="w-1/6 bg-gray-600 border-r-4 text-white text-center">
                      Quantity
                    </p>
                    <p className="w-1/6 bg-gray-600 border-r-4 text-white text-center">
                      Price Per Unit
                    </p>
                    <p className="w-1/6 bg-gray-600 border-r-4 text-white text-center">
                      Amount
                    </p>
                    <p className="w-1/6 bg-gray-600 text-white text-center">
                      View
                    </p>
                  </div>
                  {Object.values(transactionData)
                    .sort(function (a, b) {
                      var dateA = new Date(a.date),
                        dateB = new Date(b.date);
                      return dateB - dateA;
                    })
                    .map((item, index) => (
                      <div key={index} className="w-full border flex">
                        <p className="w-1/6 bg-gray-400 border-r-4 my-0.5 font-bold ">
                          {item.date?.substring(0, 10)}
                        </p>
                        <p className="w-1/6 bg-gray-400 border-r-4 my-0.5 ">
                          {item?.transaction_type === "Customer"
                            ? "Sales"
                            : item?.transaction_type === "Supplier"
                            ? "Purchase"
                            : item?.transaction_type}
                        </p>
                        <p className="w-1/6 bg-gray-400 border-r-4 my-0.5 text-end">
                          {item?.quantity}
                        </p>
                        <p className="w-1/6 bg-gray-400 border-r-4 my-0.5 text-end">
                          {item?.pricePerUnit}
                        </p>
                        <p className="w-1/6 bg-gray-400 border-r-4 my-0.5 text-end">
                          {item?.amount}
                        </p>
                        <p className="w-1/6 bg-gray-400 my-0.5 text-center">
                          {item.transaction_type &&
                            (item.transaction_type === "Supplier" ? (
                              <Link
                                to={
                                  "/viewSupplierTransaction/" +
                                  item?.transaction_details
                                }
                              >
                                <button className="bg-green-600 px-4 rounded-xl text-white">
                                  View
                                </button>
                              </Link>
                            ) : item.transaction_type === "Customer" ? (
                              <Link
                                to={
                                  "/viewTransaction/" +
                                  item?.transaction_details
                                }
                              >
                                <button className="bg-green-600 px-4 rounded-xl text-white">
                                  View
                                </button>
                              </Link>
                            ) : (
                              ""
                            ))}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <TransactionSaved />
              <h1 className="text-center font-bold text-2xl">
                Stock Item Deleted Successfully
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

export default ViewStock;
