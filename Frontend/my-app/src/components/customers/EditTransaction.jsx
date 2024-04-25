import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { URL } from "../../utils/Constants";
import UserContext from "../../utils/UserContext";
import NotOwner from "../../utils/NotOwner";
import LoginShow from "../LoginShow";
import Loading from "../../utils/Loading";
import TransactionSaved from "../../utils/TransactionSaved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

let date;
const EditTransaction = () => {
  const { loggedInUserId } = useContext(UserContext);
  const { id } = useParams();
  const [showCredit, setShowCredit] = useState(false);
  const [showDebit, setShowDebit] = useState(false);
  const [showBoth, setShowBoth] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [requiredTransaction, setRequiredTransaction] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    transType: "",
    date: "",
    invoice: 0,
    credit: [],
    transDetails: [],
    custDetails: null,
    totalDebitAmount: 0,
    totalCreditAmount: 0,
    totalQuantity: 0,
  });
  // const [TotalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const jsonData = await fetch(URL + "/customer", { credentials: "include" });
    const data = await jsonData.json();
    // console.log(data);
    const cust = data[0].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    const trans = data[1].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    const requiredTransaction = trans.find((data) => data._id === id);

    console.log("formData.credit before mapping:", formData.credit);
    setFormData(requiredTransaction);
    setFormData({
      ...requiredTransaction,
      credit: Array?.isArray(requiredTransaction?.credit)
        ? requiredTransaction?.credit
        : [],
    });

    date = requiredTransaction?.date.substring(0, 10);
    // console.log(date);
    setCustomersData(cust);
    setRequiredTransaction(requiredTransaction);
    if (requiredTransaction?.transType) {
      if (requiredTransaction.transType === "Debit") {
        setShowDebit(true);
        setShowBoth(true);
        setShowCredit(false);
      } else if (requiredTransaction.transType === "Credit") {
        setShowDebit(false);
        setShowCredit(true);
        setShowBoth(true);
      } else if (requiredTransaction.transType === "Debit&Credit") {
        setShowBoth(true);
        setShowCredit(true);
        setShowDebit(true);
      }
    }
    // console.log(id);
    // console.log(data);
    const jsonData2 = await fetch(URL + "/stock/getStocks", {
      credentials: "include",
    });
    const data2 = await jsonData2.json();
    const stock = data2.filter((item) => {
      return item?.owner === loggedInUserId?._id;
    });
    setStockData(stock);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "transType") {
      if (value === "Debit") {
        setFormData({
          ...formData,
          transDetails: [],
        });
        setShowDebit(true);
        setShowBoth(true);
        setShowCredit(false);
      } else if (value === "Credit") {
        setShowDebit(false);
        setShowCredit(true);
        setShowBoth(true);
      } else if (value === "Debit&Credit") {
        setShowBoth(true);
        setShowCredit(true);
        setShowDebit(true);
      } else {
        setShowBoth(false);
        setShowCredit(false);
        setShowDebit(false);
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeDetail = (e, index, field) => {
    const newDetails = [...formData.transDetails];
    newDetails[index][field] = e.target.value;
    newDetails[index].amount =
      newDetails[index].quantity * newDetails[index].pricePerUnit;
    const totalAmountDetail = formData.transDetails.reduce(
      (total, detail) => total + detail.amount,
      0
    );
    const totalQuantityDetail = formData.transDetails.reduce(
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
      transDetails: newDetails,
      totalDebitAmount: totalAmountDetail,
      totalQuantity: totalQuantityDetail,
    });
  };

  const addCreditDetail = () => {
    setFormData({
      ...formData,
      credit: [
        ...formData.credit,
        {
          creditName: "",
          creditAmount: 0,
        },
      ],
    });
  };
  const handleChangeCredit = (e, index, field) => {
    const newCredit = [...formData.credit]; // Create a copy of credit transactions
    newCredit[index][field] = e.target.value; // Update the specific field
    // Recalculate the total credit amount
    const totalCreditAmount = newCredit.reduce(
      (total, credit) => total + parseFloat(credit.creditAmount || 0),
      0
    );

    setFormData({
      ...formData,
      credit: newCredit, // Update the credit transactions
      totalCreditAmount: totalCreditAmount, // Update the total credit amount
    });
  };
  const removeCreditTransaction = (index) => {
    // const newCredit = formData.credit.filter((_, i) => i !== index); // Remove the credit transaction at the specified index
    const newCredit = [...formData.credit]; // Create a copy of the credit array
    newCredit.splice(index, 1);
    const totalCreditAmount = newCredit.reduce(
      (total, credit) => total + parseFloat(credit.creditAmount || 0),
      0
    ); // Recalculate the total credit amount

    setFormData({
      ...formData,
      credit: newCredit, // Update the credit transactions
      totalCreditAmount: totalCreditAmount, // Update the total credit amount
    });
  };

  const addTransDetail = () => {
    setFormData({
      ...formData,
      transDetails: [
        ...formData.transDetails,
        { productName: "", quantity: "", pricePerUnit: "", amount: "" },
      ],
    });
  };

  const removeTransDetail = (index) => {
    const newDetails = formData.transDetails.filter((_, i) => i !== index);
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
      transDetails: newDetails,
      totalDebitAmount: totalAmountDetail,
      totalQuantity: totalQuantityDetail,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    submit();
  };

  const submit = (e) => {
    // const user = Cookies.get("userData");
    // console.log(JSON.parse(user)._id === loggedInUserId._id);
    // if (JSON.parse(user)._id === loggedInUserId._id) {
    setIsLoading(true);
    fetch(URL + "/customer/edittransaction/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const transactionData = await response.json();

        console.log(transactionData);

        const deleteStock = await fetch(
          URL + "/stock/deleteCustomerStockTransaction/" + id,
          { credentials: "include" }
        ).then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to delete stock data");
          }
        });

        await formData.transDetails.forEach(async (purchaseDetail) => {
          console.log("Hii");
          const detailResponse = await fetch(
            URL + "/stock/newCustomerStockTrans",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                ...purchaseDetail,
                transaction_type: "Customer",
                transaction_details: transactionData._id,
                date: formData.date,
                owner: loggedInUserId,
              }),
            }
          );

          if (!detailResponse.ok) {
            throw new Error(detailResponse.statusText);
          }
        });
        setIsLoading(false);
        setShowRedirectMessage(true);
        setTimeout(() => {
          window.location.href = "/CustomerHome";
        }, 1000);
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // Reset form fields after successful submission
        // e.target.reset();
        setFormData({
          name: "",
          transType: "",
          date: "",
          description: "",
          credit: {
            creditName: "",
            creditAmount: 0,
          },
          transDetails: [
            { productName: "", quantity: "", pricePerUnit: "", amount: "" },
          ],
          custDetails: null,
          totalDebitAmount: 0,
          totalCreditAmount: 0,
          totalAmount: 0,
          totalQuantity: 0,
        });
        // console.log(e.target.name);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
    // } else {
    //   window.location.href = "/login";
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
              {requiredTransaction ? (
                <div className="flex flex-col items-center">
                  <h2 className="text-center text-3xl font-bold my-5">
                    Edit Sales/Payment-In Transaction
                  </h2>

                  <div className="w-[70%] flex flex-col justify-center items-center">
                    <form onSubmit={handleSubmit} className="w-full mb-32">
                      <div className="mb-5">
                        <label
                          htmlFor="name"
                          className="block font-semibold text-xl"
                        >
                          Name(Cannot Change Name):
                        </label>
                        <input
                          name="name"
                          id="name"
                          value={
                            formData?.custDetails?.name
                              ? formData?.custDetails?.name
                              : ""
                          }
                          readOnly
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                        />
                        {/* <option>
                  {formData?.custDetails?.name
                    ? formData?.custDetails?.name
                    : ""}
                </option> */}
                      </div>

                      <div className="mb-5">
                        <label
                          htmlFor="transType"
                          className="flex font-semibold text-xl"
                        >
                          Transaction Type <p className="text-red-600">*</p>:
                        </label>
                        {/* <input
                type="text"
                id="transType"
                name="transType"
                value={formData.transType}
                onChange={handleChange}
                className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                required
              /> */}
                        <select
                          id="transType"
                          name="transType"
                          value={formData?.transType}
                          onChange={handleChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                          required
                        >
                          <option value="">Select Transaction type</option>
                          <option value="Credit">Credit</option>
                          <option value="Debit">Debit</option>
                          <option value="Debit&Credit">Debit&Credit</option>
                        </select>
                      </div>
                      <div className="flex">
                        <div className="mb-5 w-[40%] mr-2">
                          <label
                            htmlFor="date"
                            className="block font-semibold text-xl"
                          >
                            Original Transaction Date-{date}:
                          </label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData?.date}
                            onChange={handleChange}
                            className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                            // required
                          />
                        </div>
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="description"
                          className="block font-semibold text-xl"
                        >
                          Description:
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          cols="30"
                          rows="3"
                          placeholder="Enter Description"
                          value={formData?.description}
                          onChange={handleChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500 resize-none"
                        ></textarea>
                      </div>

                      {showBoth === true && showCredit === true ? (
                        <fieldset>
                          <legend className="font-bold w-full text-xl mb-3 text-center">
                            <div className="h-0.5 my-4 font-bold bg-black"></div>
                            <p>Credit Transaction Details</p>
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
                              <p className="px-6  bg-gray-600  text-white ">
                                X
                              </p>
                            </div>
                            {formData?.transDetails.map((detail, index) => (
                              <div key={index} className="flex mb-2 w-full  ">
                                <div className="w-[25%]">
                                  <select
                                    name={`productName_${index}`}
                                    value={detail.productName}
                                    onChange={(e) => {
                                      handleChangeDetail(
                                        e,
                                        index,
                                        "productName"
                                      );
                                    }}
                                    required
                                    className="w-full border-r-4 border-gray-400 bg-gray-200 "
                                  >
                                    <option value="">Select Product</option>
                                    {/* Map through stock data to generate options */}
                                    {stockData
                                      .sort((a, b) =>
                                        a.name_of_prod.localeCompare(
                                          b.name_of_prod
                                        )
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
                                  value={
                                    detail.quantity === 0 ? "" : detail.quantity
                                  }
                                  onChange={(e) =>
                                    handleChangeDetail(e, index, "quantity")
                                  }
                                  className="w-[25%] border-r-4 border-gray-400 bg-gray-200 text-end"
                                />
                                <input
                                  type="number"
                                  name={`pricePerUnit_${index}`}
                                  placeholder="Price Per Unit"
                                  value={
                                    detail.pricePerUnit === 0
                                      ? ""
                                      : detail.pricePerUnit
                                  }
                                  onChange={(e) =>
                                    handleChangeDetail(e, index, "pricePerUnit")
                                  }
                                  className="w-[25%] border-r-4 border-gray-400 bg-gray-200 text-end"
                                />
                                <input
                                  type="number"
                                  name={`amount_${index}`}
                                  placeholder="Amount"
                                  value={
                                    detail.amount === 0 ? "" : detail.amount
                                  }
                                  onChange={(e) =>
                                    handleChangeDetail(e, index, "amount")
                                  }
                                  className="w-[25%] border-r-4 border-gray-400 bg-gray-200  text-end"
                                />
                                <div className="flex justify-center">
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
                              className="px-8 py-1 rounded-xl text-white bg-red-600 "
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
                            <p className="font-bold w-1/4 ">
                              Total transaction Quantity:
                            </p>
                            <p className="font-bold  w-1/4 text-end px-4 border-r-4 border-gray-600">
                              {formData.totalQuantity}
                            </p>
                            <p className="font-bold w-1/4 text-center">
                              Total transaction Amount:
                            </p>
                            <p className="font-bold w-1/4 text-end border-r-4 px-4">
                              {formData.totalDebitAmount}
                            </p>
                            <p className="font-bold px-6 text-gray-600"></p>
                          </div>
                          {/* <div className=" mb-4">
                            <input
                              type="number"
                              id="totalQuantity"
                              name="totalQuantity"
                              value={formData.totalQuantity}
                              onChange={handleChange}
                              className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                              placeholder="Total Quantity"
                              // required
                            />
                            <p className="font-bold">
                              Total Quantity: {formData.totalQuantity}
                            </p>
                            <input
                              placeholder="Total Amount"
                              type="number"
                              id="totalDebitAmount"
                              name="totalDebitAmount"
                              value={formData.totalDebitAmount}
                              onChange={handleChange}
                              className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                              // required
                            />
                            <p className="font-bold">
                              Total Amount: {formData.totalDebitAmount}
                            </p>
                          </div> */}
                        </fieldset>
                      ) : (
                        ""
                      )}
                      {showBoth === true && showDebit === true ? (
                        <div className="mb-4">
                          <div className="h-0.5 my-4 bg-black"></div>
                          <p className="font-bold text-xl text-center mb-1">
                            Debit Transaction Details
                          </p>
                          <div>
                            {/* Credit transaction details */}
                            {formData?.credit.length > 0 &&
                              formData?.credit.map((credit, index) => (
                                <div key={index} className="flex">
                                  <select
                                    id={`creditName_${index}`}
                                    name={`creditName_${index}`}
                                    value={credit.creditName}
                                    onChange={(e) =>
                                      handleChangeCredit(e, index, "creditName")
                                    }
                                    className="w-[45%] border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                                  >
                                    <option value="">
                                      Select Type Of Debit
                                    </option>
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank">Bank</option>
                                  </select>
                                  <input
                                    type="number"
                                    id={`creditAmount_${index}`}
                                    name={`creditAmount_${index}`}
                                    value={credit.creditAmount}
                                    onChange={(e) =>
                                      handleChangeCredit(
                                        e,
                                        index,
                                        "creditAmount"
                                      )
                                    }
                                    className="w-[45%] border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                                    placeholder="Credit Amount"
                                  />
                                  <div className="w-[10%] flex justify-center items-center">
                                    <button
                                      onClick={() =>
                                        removeCreditTransaction(index)
                                      }
                                      className="bg-red-600 w-full py-2  text-white "
                                    >
                                      x
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <button
                            type="button"
                            onClick={addCreditDetail}
                            className="px-8 py-1 my-3 rounded-xl text-white bg-red-600 mb-5"
                          >
                            +
                          </button>
                          {/* <div className="w-[100%] ">
                            <p className="text-center font-bold">
                              Or Enter Total Debit Total Price
                            </p>
                            <input
                              type="number"
                              id="totalCreditAmount"
                              name="totalCreditAmount"
                              value={formData.totalCreditAmount}
                              onChange={handleChange}
                              className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                              placeholder="Total Debit Amount"
                              // required
                            />
                            <p className="font-bold w-[50%] ">
                              Total Debit Amount: {formData?.totalCreditAmount}
                            </p>
                          </div> */}
                        </div>
                      ) : (
                        ""
                      )}
                      {requiredTransaction &&
                      requiredTransaction?.length !== 0 ? (
                        <div className="flex flex-col items-center w-full">
                          <div className="h-0.5 my-4 bg-black w-full"></div>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl text-white bg-red-600 text-end mb-10"
                          >
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
                Sales Transaction Edited Successfully
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

export default EditTransaction;
