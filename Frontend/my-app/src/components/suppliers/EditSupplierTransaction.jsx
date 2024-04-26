import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { URL } from "../../utils/Constants";
import LoginShow from "../LoginShow";
import UserContext from "../../utils/UserContext";
import NotOwner from "../../utils/NotOwner";
import Loading from "../../utils/Loading";
import TransactionSaved from "../../utils/TransactionSaved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

// let dateNow;
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const EditSupplierTransaction = () => {
  const { loggedInUserId } = useContext(UserContext);

  const { id } = useParams();
  // console.log(id);
  const [supplierData, setSupplierData] = useState([]);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showBoth, setShowBoth] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    date: new Date(),
    bill_no: "",
    transType: "",
    purchaseDetails: [],
    totalPurchaseAmount: 0,
    totalPurchaseQuantity: 0,
    paidAmount: [
      {
        amount: 0,
        transactionType: "",
        transactionId: "",
        discount: 0,
      },
    ],
    totalPaidAmount: 0,
  });

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const jsonData = await fetch(
      URL + "/supplier/viewSupplierTransaction/" + id,
      { credentials: "include" }
    );
    const data = await jsonData.json();
    if (data.owner === loggedInUserId._id) {
      if (data.transType) {
        if (data.transType === "Purchase") {
          setShowPurchase(true);
          setShowBoth(true);
          setShowPayment(false);
        } else if (data.transType === "Payment") {
          setShowPurchase(false);
          setShowBoth(true);
          setShowPayment(true);
        } else if (data.transType === "Purchase&Payment") {
          setShowPurchase(true);
          setShowBoth(true);
          setShowPayment(true);
        } else {
          setShowPurchase(false);
          setShowBoth(false);
          setShowPayment(false);
        }
      }
      // const requiredTransaction = data.find((data) => data._id === id);
      const jsonData2 = await fetch(URL + "/supplier/getSuppliers", {
        credentials: "include",
      });
      const data2 = await jsonData2.json();
      const suppl = data2.filter((item) => {
        return item.owner === loggedInUserId?._id;
      });
      // dateNow = data?.date.substring(0, 10);
      setSupplierData(suppl);
      setFormData(data);

      const jsonData3 = await fetch(URL + "/stock/getStocks", {
        credentials: "include",
      });
      const stockData = await jsonData3.json();
      const stock = stockData.filter((item) => {
        return item.owner === loggedInUserId?._id;
      });
      setStockData(stock);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "transType") {
      if (value === "Purchase") {
        setShowPurchase(true);
        setShowBoth(true);
        setShowPayment(false);
      } else if (value === "Payment") {
        setShowPurchase(false);
        setShowBoth(true);
        setShowPayment(true);
      } else if (value === "Purchase&Payment") {
        setShowPurchase(true);
        setShowBoth(true);
        setShowPayment(true);
      } else {
        setShowPurchase(false);
        setShowBoth(false);
        setShowPayment(false);
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addTransDetail = () => {
    setFormData({
      ...formData,
      purchaseDetails: [
        ...formData.purchaseDetails,
        {
          productName: "",
          quantity: 0,
          pricePerUnit: 0,
          amount: 0,
        },
      ],
    });
  };

  const handleChangeDetail = (e, index, field) => {
    const newDetails = [...formData.purchaseDetails];
    newDetails[index][field] = e.target.value;
    newDetails[index].amount =
      newDetails[index].quantity * newDetails[index].pricePerUnit;
    const totalAmountDetail = formData.purchaseDetails.reduce(
      (total, detail) => total + detail.amount,
      0
    );
    const totalQuantityDetail = formData.purchaseDetails.reduce(
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
      purchaseDetails: newDetails,
      totalPurchaseAmount: totalAmountDetail,
      totalPurchaseQuantity: totalQuantityDetail,
    });
  };

  const removeTransDetail = (index) => {
    const newDetails = formData.purchaseDetails.filter((_, i) => i !== index);
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
      purchaseDetails: newDetails,
      totalPurchaseAmount: totalAmountDetail,
      totalPurchaseQuantity: totalQuantityDetail,
    });
  };
  const handlePaidDetail = (e, index, field) => {
    const newDetails = [...formData.paidAmount];
    newDetails[index][field] = e.target.value;

    const totalAmountDetail = formData.paidAmount.reduce(
      (total, detail) =>
        total + (parseInt(detail.amount, 10) + parseInt(detail.discount, 10)),
      0
    );
    setFormData({
      ...formData,
      paidAmount: newDetails,
      totalPaidAmount: totalAmountDetail,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    newSupplierTransaction(); // Handle form submission using JavaScript
  };

  const newSupplierTransaction = () => {
    setIsLoading(true);

    const newTrans = fetch(URL + "/supplier/editsuppltrans/" + id, {
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
          URL + "/stock/deleteSupplierStockTransaction/" + id,
          { credentials: "include" }
        ).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete stock data");
          }
        });

        await formData.purchaseDetails.forEach(async (purchaseDetail) => {
          console.log("Hii");
          const detailResponse = await fetch(
            URL + "/stock/newSupplierStockTrans",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                ...purchaseDetail,
                transaction_type: "Supplier",
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
          window.location.href = "/supplierHome";
        }, 1000);
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setIsLoading(false);

        // Reset form fields after successful submission
        // e.target.reset();
        setFormData({
          name: "",
          date: new Date(),
          bill_no: "",
          purchaseDetails: [
            {
              productName: "",
              quantity: 0,
              pricePerUnit: 0,
              amount: 0,
            },
          ],
          totalPurchaseAmount: 0,
          totalPurchaseQuantity: 0,
          paidAmount: [
            {
              amount: 0,
              transactionType: "",
              transactionId: "",
              discount: 0,
            },
          ],
          totalPaidAmount: 0,
        });
        // console.log(e.target.name);
      })
      .catch((error) => {
        setIsLoading(false);

        console.error("Error:", error);
      });
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
              {supplierData.length !== 0 ? (
                <div className="flex flex-col items-center w-full">
                  <h2 className="text-center text-3xl font-bold mb-3">
                    Edit Purchase/Payment-Out Transaction
                  </h2>
                  <div className="w-[70%] flex flex-col justify-center items-center">
                    <form className="w-full" onSubmit={handleSubmit}>
                      <div className="mb-5">
                        <label
                          htmlFor="name"
                          className="flex font-semibold text-xl"
                        >
                          Name(Cannot Change)
                          <p className="text-red-600">*</p>:
                        </label>
                        <input
                          name="name"
                          id="name"
                          value={formData.name}
                          // onChange={handleChange}
                          readOnly
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="flex">
                        <div className="mb-5 w-[60%] mr-5">
                          <label
                            htmlFor="date"
                            className="block font-semibold text-xl"
                          >
                            Original Transaction Date:
                          </label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formatDate(new Date(formData.date))}
                            onChange={handleChange}
                            className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                            // required
                          />
                        </div>
                        <div className="mb-5 w-[40%]">
                          <label
                            htmlFor="name"
                            className="flex font-semibold text-xl"
                          >
                            Bill Number
                            <p className="text-red-600">*</p>:
                          </label>
                          <input
                            type="text"
                            id="bill_no"
                            name="bill_no"
                            value={formData.bill_no}
                            onChange={handleChange}
                            className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="name"
                          className="flex font-semibold text-xl"
                        >
                          Select Transaction Type
                          <p className="text-red-600">*</p>:
                        </label>
                        <select
                          type="text"
                          id="transType"
                          name="transType"
                          value={formData.transType}
                          onChange={handleChange}
                          className="w-full border bg-gray-100 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                          required
                        >
                          <option value="">Select Transaction Type</option>
                          <option value="Purchase">Purchase</option>
                          <option value="Payment">Payment</option>
                          <option value="Purchase&Payment">
                            Both Purchase & Payment
                          </option>
                        </select>
                      </div>
                      {showBoth === true && showPurchase === true ? (
                        <fieldset>
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
                          <legend className="font-bold mb-3 w-full text-center">
                            <div className="h-0.5  my-4 font-bold bg-black"></div>
                            <p>Purchase Transaction Details</p>
                          </legend>
                          <div>
                            {formData.purchaseDetails.map((detail, index) => (
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
                                  className="w-[25%]  border-gray-400 bg-gray-200 text-end"
                                />
                                <div className="flex justify-center ">
                                  <button
                                    type="button"
                                    onClick={() => removeTransDetail(index)}
                                    className="bg-red-600 px-6 text-white "
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
                              <button className="bg-gray-200 font-semibold px-4 py-1 rounded-xl">
                                Add New Stock
                              </button>
                            </Link>
                          </div>
                          <div className="font-bold flex justify-between">
                            <p>
                              Total Purchase Quantity :{" "}
                              {formData.totalPurchaseQuantity}
                            </p>
                            <p>
                              Total Purchase Amount :{" "}
                              {formData.totalPurchaseAmount}
                            </p>
                          </div>
                        </fieldset>
                      ) : (
                        ""
                      )}
                      {showBoth === true && showPayment === true ? (
                        <fieldset>
                          <legend className="font-bold mb-3 w-full text-center">
                            <div className="h-0.5  my-4 font-bold bg-black"></div>
                            <p>Payment Transaction Details</p>
                          </legend>
                          <div>
                            {formData.paidAmount.map((detail, index) => (
                              <div key={index} className="flex mb-2 w-full  ">
                                <div className="w-full flex flex-col mr-3">
                                  <input
                                    type="text"
                                    name={`transactionType_${index}`}
                                    placeholder="Bank"
                                    value={detail.transactionType}
                                    onChange={(e) =>
                                      handlePaidDetail(
                                        e,
                                        index,
                                        "transactionType"
                                      )
                                    }
                                    className="w-[100%] mb-2  border-gray-400 bg-gray-200 "
                                  />
                                  <input
                                    type="text"
                                    name={`transactionId_${index}`}
                                    placeholder="Transaction ID"
                                    value={detail.transactionId}
                                    onChange={(e) =>
                                      handlePaidDetail(
                                        e,
                                        index,
                                        "transactionId"
                                      )
                                    }
                                    className="w-[100%] mb-2 border-gray-400 bg-gray-200 "
                                  />
                                </div>
                                <div className="w-full flex flex-col">
                                  <input
                                    type="number"
                                    name={`discount_${index}`}
                                    placeholder="Discount"
                                    value={
                                      detail.discount === 0
                                        ? ""
                                        : detail.discount
                                    }
                                    onChange={(e) =>
                                      handlePaidDetail(e, index, "discount")
                                    }
                                    className="w-[100%] mb-2 border-gray-400 bg-gray-200 "
                                  />
                                  <input
                                    type="number"
                                    name={`amount_${index}`}
                                    placeholder="Amount"
                                    value={
                                      detail.amount === 0 ? "" : detail.amount
                                    }
                                    onChange={(e) =>
                                      handlePaidDetail(e, index, "amount")
                                    }
                                    className="w-[100%] mb-2 border-gray-400 bg-gray-200 "
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="font-bold mb-5">
                            <p>
                              Total paid Amount : {formData.totalPaidAmount}
                            </p>
                          </div>
                        </fieldset>
                      ) : (
                        ""
                      )}
                      <div className="flex flex-col items-center w-full">
                        <div className="h-0.5 my-4 bg-black w-full"></div>
                        <button
                          type="submit"
                          className="px-4 py-2 my-5 rounded-xl text-white bg-red-600 text-end mb-10"
                          // onClick={newSupplierTransaction}
                        >
                          Submit{" "}
                          <FontAwesomeIcon icon={faArrowRightToBracket} />
                        </button>
                      </div>
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
                Purchase Transaction Edited Successfully
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

export default EditSupplierTransaction;
