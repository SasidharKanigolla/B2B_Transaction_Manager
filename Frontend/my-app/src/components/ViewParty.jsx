import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DELETEPASS, URL } from "../utils/Constants";
import UserContext from "../utils/UserContext";
import LoginShow from "./LoginShow";
import * as XLSX from "xlsx";
import NotOwner from "../utils/NotOwner";
import Loading from "../utils/Loading";
import TransactionSaved from "../utils/TransactionSaved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrash,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import bcrypt from "bcryptjs";

const ViewParty = () => {
  const { id } = useParams();
  const [customerData, setCustomersData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [passwordError, setPasswordError] = useState("");

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { loggedInUserId } = useContext(UserContext);
  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    // setPrevPageUrl(window.location.href);
    const data = await fetch(URL + "/customer/viewcustomer/" + id, {
      credentials: "include",
    });
    const data2 = await fetch(URL + "/supplier/viewsupplier/" + id, {
      credentials: "include",
    });
    const jsonData = await data.json();
    const jsonData2 = await data2.json();
    console.log(jsonData[0]);
    console.log(loggedInUserId);
    // const cust = jsonData.filter((item) => {
    //   return item.owner === loggedInUserId._id;
    // });
    const custtrans = jsonData[1].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    const suppltrans = jsonData2[1].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    const mergedData = custtrans.concat(suppltrans);
    if (jsonData[0]?.owner === loggedInUserId?._id) {
      setCustomersData(jsonData[0]);
      setTransactionData(mergedData);
    }
    setIsLoading(false);
    // console.log(jsonData);
    // console.log(jsonData[1]);
  };

  const deleteCustomer = async () => {
    if (transactionData.length === 0) {
      if (
        (await bcrypt.compare(password, loggedInUserId.deleteTrans)) === true
      ) {
        const data = fetch(URL + "/customer/deletecustomer/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              setShowRedirectMessage(true);
              setTimeout(() => {
                window.location.href = "/";
              }, 1000);
            } else {
              throw new Error("Failed to delete transaction");
            }
          })
          .catch((error) => {
            console.error("Error deleting transaction:", error);
          });
      } else {
        setPasswordError("Invalid Password");
      }
    } else {
      alert(
        "Delete all the transaction of Party before deleting the Party data"
      );
    }
  };

  const downloadExcel = () => {
    const data = transactionData.map((trans) => ({
      Date: trans.date.substring(0, 10),
      Name: trans.name,
      "Transaction Type": trans.transType,
      "C/S":
        trans.transType === "Debit&Credit" ||
        trans.transType === "Credit" ||
        trans.transType === "Debit"
          ? "Customer"
          : "Supplier",
      "Total Debit/Paid Amount":
        trans.totalPaidAmount || trans.totalCreditAmount || 0,
      "Total Quantity": trans.totalQuantity || trans.totalPurchaseQuantity || 0,
      "Total Credit/Purchase Amount":
        trans.totalDebitAmount || trans.totalPurchaseAmount || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data); // Convert data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction_Data"); // Add worksheet to workbook
    XLSX.writeFile(workbook, "Transaction_Data_" + customerData.name + ".xlsx"); // Download workbook as an Excel file
  };

  // console.log(id);
  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {!showRedirectMessage ? (
            <div className="flex flex-col items-center w-full">
              {customerData.length !== 0 ? (
                <div className="mb-48 flex flex-col items-center w-[80%]">
                  <div className="m-4 flex w-full">
                    <div className="w-[50%] bg-gray-200 p-10 rounded - xl mr-5">
                      <p className="font-bold text-lg">
                        Name : {customerData?.name?.substring(0, 37)}
                      </p>
                      <p className="font-bold text-lg">
                        Mobile : {customerData?.mobile}
                      </p>
                      <p className="font-bold text-lg">
                        GST Number : {customerData?.gst}
                      </p>
                      <p className="font-bold text-lg">
                        Bank Name : {customerData?.bankName}
                      </p>
                      <p className="font-bold text-lg">
                        Bank Account Number : {customerData?.bankAccountNumber}
                      </p>
                      <p className="font-bold text-lg">
                        Bank IFSC : {customerData?.bankIfsc}
                      </p>
                      <p className="font-bold text-lg">
                        Address : {customerData?.address}
                      </p>
                      <p className="font-bold text-lg">
                        Id : {customerData?._id}
                      </p>
                    </div>
                    <div className="w-[50%] bg-gray-200 p-10 rounded - xl mr-5 flex justify-center items-center flex-col">
                      <h1 className="font-bold text-lg">Total Amount Due:</h1>
                      <p className="font-bold text-xl">
                        {customerData.amount}/-
                      </p>
                    </div>
                  </div>
                  {customerData.length !== 0 ? (
                    <div className="flex justify-evenly my-8 w-full">
                      <Link to={"/EditParty/" + customerData._id}>
                        <button className="p-4 bg-green-600 text-white rounded-xl">
                          Edit Party Details{" "}
                          <FontAwesomeIcon icon={faUserPen} />
                        </button>
                      </Link>
                      <div className="w-[50%]">
                        <input
                          type="password"
                          placeholder="Enter Transaction Password to Delete Party Data"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full font-bold border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                        />
                        {passwordError && (
                          <p className="text-red-500">{passwordError}</p>
                        )}
                      </div>

                      <button
                        className="p-4 bg-red-600 text-white rounded-xl"
                        onClick={() => deleteCustomer()}
                      >
                        Delete Party Data &nbsp;{" "}
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="w-full h-0.5 bg-black my-10 "></div>
                  <div className="w-full">
                    <div className="flex flex-col items-center">
                      <div className="mb-5  w-full flex justify-between">
                        <h1 className="text-center text-2xl font-bold ">
                          Transaction History
                        </h1>
                        <button
                          onClick={downloadExcel}
                          className="rounded-xl p-2 bg-red-600 text-white hover:opacity-50"
                        >
                          Download Transaction Data as Excel &nbsp;{" "}
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                      </div>
                    </div>

                    <div className="border-2 border-black w-full">
                      {/* <div className="">
                    <div className="flex justify-between bg-gray-600 mb-3">
                      <p className="w-[15%] text-white px-4 text-center border-r-4">
                        Date
                      </p>
                      <p className="w-[20%] text-white px-4 text-center border-r-4">
                        Transaction Type
                      </p>
                      <p className="w-[20%] text-white px-4 text-center border-r-4">
                        Total Quantity
                      </p>
                      <p className="w-[12.5%] text-white px-4 text-center border-r-4">
                        Total Debit Amount
                      </p>
                      <p className="w-[12.5%] text-white px-4 text-center border-r-4">
                        Total Credit Amount
                      </p>
                      <p className="w-[20%] text-white px-4 text-center">
                        View
                      </p>
                    </div> */}
                      {
                        // Object.values(transactionData)
                        //   .sort(function (a, b) {
                        //     var dateA = new Date(a.date),
                        //       dateB = new Date(b.date);
                        //     return dateA - dateB;
                        //   })
                        //   .map((trans, index) => (
                        //     <div
                        //       key={index}
                        //       className="flex justify-between my-0.5 bg-gray-400 "
                        //     >
                        //       {/* {console.log(trans.date)} */}
                        //       <p className="w-[15%] font-bold  rounded-md border-r-4">
                        //         {trans.date.substring(0, 10)}
                        //       </p>
                        //       <p className="w-[20%] font-bold  rounded-md border-r-4">
                        //         {trans.transType}
                        //       </p>
                        //       <p className="w-[20%] font-bold  rounded-md text-end border-r-4">
                        //         {trans.totalQuantity}
                        //       </p>
                        //       <p className="w-[12.5%] font-bold  rounded-md text-end border-r-4">
                        //         {trans.totalCreditAmount}
                        //       </p>
                        //       <p className="w-[12.5%] font-bold  rounded-md text-end border-r-4">
                        //         {trans.totalDebitAmount}
                        //       </p>
                        //       <p className="w-[20%] font-bold   text-white text-center ">
                        //         <Link to={"/viewTransaction/" + trans._id}>
                        //           <button className="rounded-xl bg-green-600 px-6">
                        //             View
                        //           </button>
                        //         </Link>
                        //       </p>
                        //     </div>
                        //   ))
                      }
                    </div>
                    <div className="flex justify-between text-white bg-gray-600 mb-2">
                      <p className="w-[7.5%]  px-4 text-center border-r-4">
                        Date
                      </p>
                      <p className="w-[15.5%]  px-4 text-center border-r-4">
                        Name
                      </p>
                      <p className="w-[7.5%]  px-4 text-center border-r-4">
                        C/S
                      </p>
                      <p className="w-[15%]  px-4 text-center border-r-4">
                        Transaction Type
                      </p>
                      <p className="w-[15%]  px-4 text-center border-r-4">
                        Debit/Paid Amount
                      </p>
                      <p className="w-[15%]  px-4 text-center border-r-4">
                        Quantity
                      </p>
                      <p className="w-[15%]  px-4 text-center border-r-4">
                        Credit/Purchase Amount
                      </p>
                      <p className="w-[10%]  px-4 text-center ">View</p>
                    </div>
                    {transactionData.map((trans, index) => (
                      <div
                        key={index}
                        className="flex justify-between my-0.5 bg-gray-400"
                      >
                        <p className="w-[7.5%] font-bold   border-r-4">
                          {trans.date.substring(0, 10)}
                        </p>
                        <p className="w-[15.5%] font-bold   border-r-4">
                          {trans.name.substring(0, 17)}
                        </p>
                        <p className="w-[7.5%] font-bold text-center   border-r-4">
                          {trans.transType === "Debit&Credit" ||
                          trans.transType === "Credit" ||
                          trans.transType === "Debit"
                            ? "Sales"
                            : "Purchases"}
                        </p>
                        <p className="w-[15%] font-bold   border-r-4">
                          {trans.transType}
                        </p>
                        <p className="w-[15%] font-bold   text-end border-r-4">
                          {trans?.totalCreditAmount ||
                            trans?.totalPaidAmount ||
                            0}
                        </p>
                        <p className="w-[15%] font-bold   text-end border-r-4">
                          {trans.totalQuantity ||
                            trans?.totalPurchaseQuantity ||
                            0}
                        </p>
                        <p className="w-[15%] font-bold   text-end border-r-4">
                          {trans?.totalDebitAmount ||
                            trans?.totalPurchaseAmount ||
                            0}
                        </p>
                        {trans.transType === "Debit&Credit" ||
                        trans.transType === "Credit" ||
                        trans.transType === "Debit" ? (
                          <p className="w-[10%] font-bold text-white text-center">
                            <Link to={"/viewtransaction/" + trans._id}>
                              <button className="rounded-xl bg-green-600 px-3">
                                View
                              </button>
                            </Link>
                          </p>
                        ) : (
                          <p className="w-[10%] font-bold text-white text-center">
                            <Link to={"/viewSupplierTransaction/" + trans._id}>
                              <button className="rounded-xl bg-green-600 px-3">
                                View
                              </button>
                            </Link>
                          </p>
                        )}
                      </div>
                    ))}
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
                Party Deleted Successfully
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

export default ViewParty;
