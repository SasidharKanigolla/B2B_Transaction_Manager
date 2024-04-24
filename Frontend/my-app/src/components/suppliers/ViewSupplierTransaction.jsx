import React, { useState, useEffect, useContext } from "react";
import { DELETEPASS, URL } from "../../utils/Constants";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../utils/UserContext";
import LoginShow from "../LoginShow";
import NotOwner from "../../utils/NotOwner";
import Loading from "../../utils/Loading";
import bcrypt from "bcryptjs";

import TransactionSaved from "../../utils/TransactionSaved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const ViewSupplierTransaction = () => {
  const { loggedInUserId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [transactionData, setTransactionData] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  // const [flashMessage, setFlashMessage] = useState("");

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
    console.log(data);
    if (data.owner === loggedInUserId?._id) {
      setTransactionData(data);
    }
    setIsLoading(false);
  };

  const deleteTransaction = async () => {
    if ((await bcrypt.compare(password, loggedInUserId.deleteTrans)) === true) {
      const data = await fetch(
        URL + "/supplier/deleteSupplierTransaction/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )
        .then(async (response) => {
          if (response.ok) {
            // setFlashMessage("Transaction deleted successfully");
            const deleteStock = await fetch(
              URL + "/stock/deleteSupplierStockTransaction/" + id,
              { credentials: "include" }
            ).then((response) => {
              if (!response.ok) {
                throw new Error("Failed to delete stock data");
              }
            });
            setShowRedirectMessage(true);
            setTimeout(() => {
              window.location.href = "/supplierHome";
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
              {transactionData.length !== 0 ? (
                <div className="flex flex-col items-center">
                  {/* {flashMessage && <div className="flash-message">{flashMessage}</div>} */}
                  <h1 className="font-bold text-3xl mb-10">Supplier Details</h1>
                  <div className="w-[80%] bg-gray-200 rounded-xl py-8 flex flex-col mb-5 items-center font-bold">
                    <p>
                      Supplier Name :{" "}
                      {transactionData?.supplierDetails?.name.substring(0, 60)}
                    </p>
                    <p>
                      Supplier Mobile Number :{" "}
                      {transactionData?.supplierDetails?.mobile}
                    </p>
                    <p>
                      Broker Name :{" "}
                      {transactionData?.supplierDetails?.brokerDetails}
                    </p>
                  </div>
                  {transactionData.length !== 0 ? (
                    <div>
                      <Link
                        to={
                          "/ViewParty/" + transactionData?.supplierDetails?._id
                        }
                      >
                        <button className="p-4 mb-5 font-bold bg-green-600 rounded-xl text-white">
                          See Full Details of Party
                        </button>
                      </Link>
                    </div>
                  ) : (
                    ""
                  )}
                  <h1 className="font-bold text-2xl mb-5">
                    Transaction Details
                  </h1>
                  <div className="w-[80%] font-bold text-xl mb-5">
                    <p>Date : {transactionData?.date?.substring(0, 10)}</p>
                    <p>Bill No : {transactionData?.bill_no}</p>
                  </div>
                  <h1 className="font-bold text-2xl mb-10">
                    Amount Paid Details
                  </h1>
                  {transactionData &&
                    transactionData.paidAmount &&
                    transactionData.paidAmount.length > 0 && (
                      <div className="w-[80%] flex font-bold mb-3">
                        <div className="w-[50%] mr-5">
                          <p className="bg-gray-400 rounded-lg px-2 mb-3">
                            Transaction Type :
                            {transactionData?.paidAmount[0]?.transactionType ??
                              "N/A"}
                          </p>
                          <p className="bg-gray-400 rounded-lg px-2 mb-3">
                            Transaction Id :{" "}
                            {transactionData?.paidAmount[0]?.transactionId ??
                              "N/A"}
                          </p>
                        </div>
                        <div className="w-[50%]">
                          <p className="bg-gray-400 rounded-lg px-2 mb-3">
                            Discount :{" "}
                            {transactionData?.paidAmount[0]?.discount ?? "N/A"}
                          </p>
                          <p className="bg-gray-400 rounded-lg px-2 mb-3">
                            Amount:{" "}
                            {transactionData?.paidAmount[0]?.amount ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                  <p className="bg-gray-600 text-white w-[80%] flex justify-center px-4 py-2 rounded-xl mb-3 font-bold">
                    Total Amount Paid : {transactionData?.totalPaidAmount}
                  </p>
                  <h1 className="font-bold text-2xl mb-10">Purchase Details</h1>
                  <div className="w-[80%]">
                    <div className="w-full mb-3 font-bold flex text-center">
                      <p className="w-[25%] bg-gray-600 text-white border-r-4 text-center">
                        Product Name
                      </p>
                      <p className="w-[25%] bg-gray-600 text-white border-r-4">
                        Quantity
                      </p>
                      <p className="w-[25%] bg-gray-600 text-white border-r-4">
                        price Per Unit
                      </p>
                      <p className="w-[25%] bg-gray-600 text-white ">Amount</p>
                    </div>
                    {transactionData?.purchaseDetails?.map((trans, index) => (
                      <div key={index} className="w-full mb-1 flex">
                        <p className="w-[25%] bg-gray-400  border-r-4 ">
                          {trans?.productName}
                        </p>
                        <p className="w-[25%] bg-gray-400  border-r-4 text-end">
                          {trans?.quantity}
                        </p>
                        <p className="w-[25%] bg-gray-400  border-r-4 text-end">
                          {trans?.pricePerUnit}
                        </p>
                        <p className="w-[25%] bg-gray-400 text-end">
                          {trans?.amount}
                        </p>
                      </div>
                    ))}
                    <div className="w-full my-3 font-bold flex">
                      <p className="w-[25%] bg-gray-600 text-white border-r-4 text-center">
                        Total Purchase Quantity
                      </p>
                      <p className="w-[25%] bg-gray-600 text-white border-r-4 text-end">
                        {transactionData?.totalPurchaseQuantity}
                      </p>
                      <p className="w-[25%] bg-gray-600 text-white border-r-4 text-center">
                        Total Purchase Amount
                      </p>
                      <p className="w-[25%] bg-gray-600 text-white text-end">
                        {transactionData?.totalPurchaseAmount}
                      </p>
                    </div>
                  </div>
                  {transactionData.length !== 0 ? (
                    <div className="mb-10 mt-5 flex justify-evenly w-[90%]">
                      <Link to={"/editSupplierTransaction/" + id}>
                        <button className="p-4  bg-green-600 rounded-xl text-white">
                          Edit transaction &nbsp;{" "}
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </Link>
                      <div className="w-[50%]">
                        <input
                          type="password"
                          placeholder="Enter Password to Delete Transaction"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border bg-gray-200 rounded-md py-2 px-3 mt-1 focus:outline-none focus:border-blue-500"
                        />
                        {passwordError && (
                          <p className="text-red-500">{passwordError}</p>
                        )}
                      </div>
                      <button
                        className="p-4 bg-red-600 rounded-xl text-white"
                        onClick={() => deleteTransaction()}
                      >
                        Delete transaction &nbsp;{" "}
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <NotOwner />
              )}
            </div>
          ) : (
            <div>
              <TransactionSaved />
              <h1 className="text-center font-bold text-2xl">
                Purchase Transaction Deleted Successfully
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

export default ViewSupplierTransaction;
