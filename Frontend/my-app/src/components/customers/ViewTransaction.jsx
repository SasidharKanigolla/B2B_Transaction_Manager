import { useParams } from "react-router-dom";
import { URL, DELETEPASS } from "../../utils/Constants";
import { useState, useEffect, React, useContext } from "react";
import { Link } from "react-router-dom";
import LoginShow from "../LoginShow";
import UserContext from "../../utils/UserContext";
import NotOwner from "../../utils/NotOwner";
import Loading from "../../utils/Loading";
import TransactionSaved from "../../utils/TransactionSaved";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import bcrypt from "bcryptjs";

const ViewTransaction = () => {
  const { loggedInUserId, prevPageUrl, setPrevPageUrl } =
    useContext(UserContext);

  const { id } = useParams();

  const [transactionData, setTransactionData] = useState([]);
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");

  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    // setPrevPageUrl(window.location.href);
    const data = await fetch(URL + "/customer/viewtransaction/" + id, {
      credentials: "include",
    }).catch((err) => console.log(err));
    const jsonData = await data.json();
    console.log(jsonData);
    if (jsonData?.owner === loggedInUserId?._id) {
      setTransactionData(jsonData);
    }
    setIsLoading(false);
  };

  const deleteTransaction = async () => {
    if ((await bcrypt.compare(password, loggedInUserId.deleteTrans)) === true) {
      const data = fetch(
        URL + "/customer/deletetransaction/" + transactionData._id,
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
            const deleteStock = await fetch(
              URL + "/stock/deleteCustomerStockTransaction/" + id,
              { credentials: "include" }
            ).then((response) => {
              if (!response.ok) {
                throw new Error("Failed to delete stock data");
              }
            });
            setShowRedirectMessage(true);
            setTimeout(() => {
              window.location.href = "/customerHome";
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
                <div>
                  <h1 className="text-center font-bold text-3xl mb-10">
                    Party Details
                  </h1>
                  <div className="m-4 flex justify-center">
                    <div className="w-[80%] flex flex-col items-center bg-gray-200 p-10 rounded - xl mr-5">
                      <p className="font-bold text-lg">
                        Party Name : {transactionData?.custDetails?.name}
                      </p>
                      <p className="font-bold text-lg">
                        Party Mobile : {transactionData.custDetails?.mobile}
                      </p>
                    </div>
                  </div>
                  {transactionData.length !== 0 ? (
                    <div className="flex justify-evenly my-8">
                      <Link
                        to={"/ViewParty/" + transactionData?.custDetails?._id}
                      >
                        <button className="p-4 bg-green-600 text-white rounded-xl">
                          See Full Details of Party
                        </button>
                      </Link>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col items-center">
                    <h1 className="text-center font-bold text-3xl mb-10">
                      Transaction Details
                    </h1>
                    <div className="w-[80%]">
                      <p className="font-bold text-xl">
                        Transaction Description : {transactionData.description}
                      </p>
                      <p className="font-bold text-xl">
                        Transaction Type : {transactionData.transType}
                      </p>
                      <p className="font-bold text-xl">
                        {/* Transaction Date : {transactionData?.date?.substring(0, 10).} */}
                      </p>
                      <p className="font-bold text-xl">
                        Transaction Due(Credit-Debit) :{" "}
                        {transactionData?.totalAmount}
                      </p>
                      <div className="flex flex-col items-center m-5">
                        <div>
                          <p className="font-bold text-xl mb-3">
                            Debit Details:
                          </p>
                        </div>
                        <div className="w-full">
                          {transactionData?.credit?.map((detail, index) => (
                            <div
                              key={index}
                              className=" w-full flex justify-evenly mb-1"
                            >
                              <p className="w-[50%] mr-3 text-center bg-gray-400 font-bold rounded-xl">
                                Debit Type:{detail?.creditName} {"  "}
                              </p>
                              <p className="w-[50%] ml-3 text-center bg-gray-400 font-bold rounded-xl">
                                Debit Amount:{detail?.creditAmount}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className=" w-full flex justify-evenly mb-1">
                          <p className="w-full text-center bg-gray-600 text-white rounded-xl font-bold p-2 my-3">
                            Total Debit Amount :{" "}
                            {transactionData?.totalCreditAmount}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-center my-4 text-xl">
                        Credit Transaction details
                      </p>
                      <div className="flex w-full justify-center bg-gray-600 text-white mb-2">
                        <p className="w-[25%] border-r-4 text-center">
                          Prdouct Name
                        </p>
                        <p className="w-[25%] border-r-4 text-center">
                          Quantity
                        </p>
                        <p className="w-[25%] border-r-4 text-center">
                          Price Per Unit
                        </p>
                        <p className="w-[25%]  text-center">Total Amount</p>
                      </div>
                      {transactionData?.transDetails?.map((trans, index) => (
                        <div key={index} className="flex bg-gray-400 mb-0.5">
                          <p className="w-[25%] border-r-4 text-center">
                            {trans.productName}
                          </p>
                          <p className="w-[25%] border-r-4 text-center">
                            {trans.quantity}
                          </p>
                          <p className="w-[25%] border-r-4 text-center">
                            {trans.pricePerUnit}
                          </p>
                          <p className="w-[25%]  text-center">{trans.amount}</p>
                        </div>
                      ))}
                      <div className="flex justify-end bg-gray-600 mb-10 mt-1">
                        <p className="w-[25%] text-center border-r-4 text-white">
                          Total Quantity
                        </p>
                        <p className="w-[25%] text-center border-r-4 text-white">
                          {transactionData.totalQuantity}
                        </p>
                        <p className="w-[25%] text-center border-r-4 text-white">
                          Total Price
                        </p>
                        <p className="w-[25%] text-center  text-white">
                          {transactionData.totalDebitAmount}
                        </p>
                      </div>
                      {transactionData.length !== 0 ? (
                        <div className="flex  justify-evenly mb-8">
                          <Link to={"/editTransaction/" + transactionData._id}>
                            <button className="p-4 bg-green-600 text-white rounded-xl">
                              Edit Transaction Details &nbsp;{" "}
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                          </Link>

                          <div className="w-[50%]">
                            <input
                              type="password"
                              placeholder="Enter Transaction Password to Delete Transaction"
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
                            onClick={deleteTransaction}
                          >
                            Delete Trasaction Details &nbsp;{" "}
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
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
                Sales Transaction Deleted Successfully
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

export default ViewTransaction;
