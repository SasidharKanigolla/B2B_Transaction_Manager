import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../utils/UserContext";
import LoginShow from "../LoginShow";
import { URL } from "../../utils/Constants";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import TransactionSaved from "../../utils/TransactionSaved";
import Loading from "../../utils/Loading";

const dateNow = "" + new Date(Date.now());
const NewOrder = () => {
  const { loggedInUserId } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    owner: loggedInUserId,
    custDetails: null,
    orderDate: new Date(),
    deliveryDate: new Date(),
    orderDetails: [
      { productName: "", quantity: 0, pricePerUnit: 0, amount: 0 },
    ],
    status: "",
    totalQuantity: 0,
    totalAmount: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState([]);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [errmsg, seterrmsg] = useState("");

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, [loggedInUserId]);

  const fetchData = async () => {
    setIsLoading(true);
    const jsonData = await fetch(URL + "/customer", { credentials: "include" });
    const data = await jsonData.json();
    // console.log(data);
    const cust = data[0].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    const jsonData2 = await fetch(URL + "/stock/getStocks", {
      credentials: "include",
    });
    const data2 = await jsonData2.json();
    const stock = data2.filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    setStockData(stock);
    setCustomersData(cust);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeDetail = (e, index, field) => {
    const newDetails = [...formData.orderDetails];
    newDetails[index][field] = e.target.value;
    newDetails[index].amount =
      newDetails[index].quantity * newDetails[index].pricePerUnit;
    const totalAmountDetail = formData.orderDetails.reduce(
      (total, detail) => total + detail.amount,
      0
    );
    const totalQuantityDetail = formData.orderDetails.reduce(
      (total, detail) => {
        const quantity = parseInt(detail.quantity, 10);
        return typeof quantity === "number" && !isNaN(quantity)
          ? total + quantity
          : total;
      },
      0
    );
    setFormData({
      ...formData,
      orderDetails: newDetails,
      totalAmount: totalAmountDetail,
      totalQuantity: totalQuantityDetail,
    });
  };
  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };
  const handleSelectCustomer = (name) => {
    // console.log(name);
    const selectedCust = customersData.find((cust) => cust.name === name);
    console.log(selectedCust);
    setSelectedCustomer(selectedCust);
    setSearchQuery("");
  };
  const addTransDetail = () => {
    setFormData({
      ...formData,
      orderDetails: [
        ...formData.orderDetails,
        { productName: "", quantity: 0, pricePerUnit: 0, amount: 0 },
      ],
    });
  };
  const removeTransDetail = (index) => {
    if (index === 0) {
      return alert("You cannot remove first row");
    }
    const newDetails = formData.orderDetails.filter((_, i) => i !== index);
    const totalAmountDetail = newDetails.reduce(
      (total, detail) => total + detail.amount,
      0
    );
    const totalQuantityDetail = newDetails.reduce((total, detail) => {
      const quantity = parseInt(detail.quantity, 10);
      return typeof quantity === "number" && !isNaN(quantity)
        ? total + quantity
        : total;
    }, 0);
    // let totalAmountDetail += trans.amount;
    setFormData({
      ...formData,
      orderDetails: newDetails,
      totalAmount: totalAmountDetail,
      totalQuantity: totalQuantityDetail,
    });
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    setIsLoading(true);
    seterrmsg("");
    e.preventDefault();
    if (!selectedCustomer) {
      alert("Please select a customer.");
      setIsLoading(false);
      return;
    }
    formData.name = selectedCustomer.name;
    const data = await fetch(URL + "/order/NewOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.message);
        }
        setIsLoading(false);
        setShowRedirectMessage(true);
        setTimeout(() => {
          window.location.href = "/ViewOrders";
        }, 1000);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        seterrmsg(error);
      });
  };

  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div className="flex flex-col items-center w-full">
      {!isLoading ? (
        <div className="flex flex-col items-center w-[80%]">
          {!showRedirectMessage ? (
            <div className="w-full">
              <h1 className="text-center font-bold text-3xl">New Order</h1>
              {errmsg ? (
                <p className="text-center text-xl my-2 text-red-600">
                  {errmsg}
                </p>
              ) : (
                ""
              )}
              <form onSubmit={handleSubmit} className="w-full">
                <div className="my-5 flex">
                  <div className="w-[50%] mr-5">
                    <label
                      htmlFor="name"
                      className="flex font-semibold text-xl"
                    >
                      Choose Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                      placeholder="Search customer by name"
                    />
                    {searchQuery &&
                      customersData
                        .filter((cust) =>
                          cust.name.toLowerCase().includes(searchQuery)
                        )
                        ?.map((cust) => (
                          <div
                            key={cust._id}
                            onClick={() => handleSelectCustomer(cust.name)}
                            className="cursor-pointer bg-gray-100 my-0.5 hover:bg-gray-200 py-1 px-2 rounded-md"
                          >
                            <p className="flex justify-between">
                              {cust.name}
                              <p className="font-bold">{cust.amount}/-</p>
                            </p>
                          </div>
                        ))}
                    <Link to="/NewParty">
                      <div className="cursor-pointer bg-gray-100 my-0.5 hover:bg-gray-200 py-1 px-2 rounded-md font-bold">
                        <button className="">Add New Party</button>
                      </div>
                    </Link>
                  </div>
                  <div className="w-[50%] mr-5">
                    <label
                      htmlFor="selectedCustomer"
                      className="flex font-semibold text-xl"
                    >
                      Selected Customer <p className="text-red-600">*</p>:
                    </label>
                    <input
                      type="text"
                      id="selectedCustomer"
                      name="selectedCustomer"
                      value={selectedCustomer.name}
                      readOnly
                      className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                    />
                    {selectedCustomer ? (
                      <div className="cursor-pointer bg-gray-100 my-0.5 hover:bg-gray-200 py-1 px-2 rounded-md font-bold flex justify-between">
                        <p>Due</p>

                        <p className="font-bold">{selectedCustomer.amount}/-</p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="mb-5 w-[40%] mr-2">
                    <label
                      htmlFor="orderDate"
                      className="block font-semibold text-xl"
                    >
                      Order Date - {dateNow.substring(3, 15)}
                    </label>
                    <input
                      type="date"
                      id="orderDate"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleChange}
                      className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                      // required
                    />
                  </div>
                  <div className="mb-5 w-[40%] mr-2">
                    <label
                      htmlFor="deliveryDate"
                      className="block font-semibold text-xl"
                    >
                      Delivery Expected Date - {dateNow.substring(3, 15)}
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                      // required
                    />
                  </div>
                </div>

                <fieldset>
                  <legend className="font-bold text-xl mb-3 w-full text-center">
                    <div className="h-0.5 my-4 bg-black"></div>
                    <p>Order Details</p>
                  </legend>
                  <div>
                    <div className="flex mb-2 text-center">
                      <p className="w-[25%] border-r-4 border-gray-200 bg-gray-600 text-white ">
                        Product Name
                      </p>
                      <p className="w-[25%] border-r-4 border-gray-200 bg-gray-600 text-white ">
                        Quantity
                      </p>
                      <p className="w-[25%] border-r-4 border-gray-200 bg-gray-600 text-white ">
                        Price Per Unit
                      </p>
                      <p className="w-[25%] border-r-4 border-gray-200 bg-gray-600 text-white ">
                        Amount
                      </p>
                      <p className="px-6  bg-gray-600  text-white ">X</p>
                    </div>
                    {formData.orderDetails &&
                      formData.orderDetails?.map((detail, index) => (
                        <div key={index} className="flex mb-2 w-full  ">
                          <div className="w-[25%]">
                            <select
                              name={`productName_${index}`}
                              value={detail.productName}
                              onChange={(e) => {
                                handleChangeDetail(e, index, "productName");
                              }}
                              required
                              className="w-full border-r-4 border-gray-400 bg-gray-200 "
                            >
                              <option value="">Select Product</option>
                              {/* Map through stock data to generate options */}
                              {stockData
                                .sort((a, b) =>
                                  a.name_of_prod.localeCompare(b.name_of_prod)
                                )
                                .map((item) => (
                                  <option
                                    key={item._id}
                                    value={item.name_of_prod}
                                  >
                                    {item.name_of_prod}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <input
                            type="number"
                            name={`quantity_${index}`}
                            placeholder="Quantity"
                            value={detail.quantity}
                            onChange={(e) =>
                              handleChangeDetail(e, index, "quantity")
                            }
                            className="w-[25%] border-r-4 text-end border-gray-400 bg-gray-200 "
                          />
                          <input
                            type="number"
                            name={`pricePerUnit_${index}`}
                            placeholder="Price Per Unit"
                            value={detail.pricePerUnit}
                            onChange={(e) =>
                              handleChangeDetail(e, index, "pricePerUnit")
                            }
                            className="w-[25%] border-r-4 text-end border-gray-400 bg-gray-200 "
                          />
                          <input
                            type="number"
                            name={`amount_${index}`}
                            placeholder="Amount"
                            value={detail.amount}
                            onChange={(e) =>
                              handleChangeDetail(e, index, "amount")
                            }
                            className="w-[25%] border-r-4 text-end border-gray-400 bg-gray-200 "
                          />
                          {/* {
                            index!==1?:""
                          } */}
                          <div className="flex justify-center ">
                            <button
                              type="button"
                              onClick={() => removeTransDetail(index)}
                              className="bg-red-600  px-6 text-white "
                            >
                              x
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-between my-5">
                    <button
                      type="button"
                      onClick={addTransDetail}
                      className="px-4 py-1 rounded-xl text-white bg-red-600 "
                    >
                      +
                    </button>
                    <p className="bg-gray-100 font-semibold px-4 py-1 rounded-xl">
                      Click on + Button to add a row
                    </p>
                    <Link to={"/NewStock"}>
                      <button className="bg-gray-200 font-semibold px-4 py-1 rounded-xl hover:opacity-70">
                        Add New Stock
                      </button>
                    </Link>
                  </div>
                  <div className=" mb-4  flex justify-around text-center bg-gray-200 ">
                    <p className="font-bold w-1/4 ">Total Order Quantity:</p>
                    <p className="font-bold  w-1/4 text-end px-4 border-r-4 border-gray-600">
                      {formData.totalQuantity}
                    </p>
                    <p className="font-bold w-1/4 text-center">
                      Total Order Amount:
                    </p>
                    <p className="font-bold w-1/4 text-end border-r-4 px-4">
                      {formData.totalAmount}
                    </p>
                    <p className="font-bold px-6 text-gray-600"></p>
                  </div>
                </fieldset>

                <div className="flex flex-col items-center w-full">
                  <div className="h-0.5 my-4 bg-black w-full"></div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-white bg-red-600 text-end mb-10"
                  >
                    Submit <FontAwesomeIcon icon={faArrowRightToBracket} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <TransactionSaved />
              <h1 className="text-center font-bold text-2xl">
                Order Saved Successfully
              </h1>
              <h3 className="text-center">
                Page will be redirected automatically in 1 second
              </h3>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default NewOrder;
