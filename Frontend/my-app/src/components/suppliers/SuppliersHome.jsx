import React, { useState, useEffect, useContext } from "react";
import { URL } from "../../utils/Constants";
import { Link } from "react-router-dom";
import LoginShow from "../LoginShow";
import UserContext from "../../utils/UserContext";
import Loading from "../../utils/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const SuppliersHome = () => {
  const { loggedInUserId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [transactionData, setTransactionData] = useState([]);
  const [monthlyTransactionAmount, setMonthlyTransactionAmount] = useState([]);
  const [yearlyTrans, setYearlyTrans] = useState([]);
  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const jsonData = await fetch(URL + "/supplier/supplierTransactions", {
      credentials: "include",
    });
    const data = await jsonData.json();
    const suppltrans = data.filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    // console.log(suppltrans);
    setTransactionData(suppltrans);

    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0");

    const monthlyTransactions = suppltrans.filter((trans) => {
      const transactionDate = new Date(trans.date);
      // console.log(transactionDate.getFullYear() === year);
      return (
        transactionDate.getFullYear() === year &&
        String(transactionDate.getMonth() + 1).padStart(2, "0") === month
      );
    });

    const totalCreditAmountMOnth = monthlyTransactions.reduce((acc, trans) => {
      return acc + trans.totalPurchaseAmount;
    }, 0);
    setMonthlyTransactionAmount(totalCreditAmountMOnth);

    const yearlyTrans = suppltrans.filter((trans) => {
      const transactionDate = new Date(trans.date);
      // console.log(transactionDate.getFullYear() === year);
      return transactionDate.getFullYear() === year;
    });

    const totalCreditAmountyearly = yearlyTrans.reduce((acc, trans) => {
      return acc + trans.totalPurchaseAmount;
    }, 0);
    setYearlyTrans(totalCreditAmountyearly);
    setIsLoading(false);
  };
  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex flex-col items-center w-full mb-40">
            <div className="flex justify-center mb-10 w-[80%]">
              <div className="one is w-[50%] h-full bg-gray-600 text-white rounded-xl mr-5">
                <h1 className="text-2xl text-center my-4 px-2">
                  {new Date().getFullYear()} Purchases : ₹ {yearlyTrans}/-
                </h1>
              </div>
              <div className="w-[50%] h-full bg-gray-600 text-white rounded-xl mr-5">
                <h1 className="text-2xl text-center my-4 px-2">
                  {new Date().toLocaleString("default", { month: "long" }) +
                    " "}{" "}
                  Purchases : ₹ {monthlyTransactionAmount}/-
                </h1>
              </div>
            </div>

            <h1 className="mb-10 text-3xl font-bold">
              Recent Purchase Transactions
            </h1>
            <div className="w-[80%] flex flex-col items-center  border-4 border-black pb-1">
              <div className="w-full flex font-bold text-white text-center mb-2">
                <p className="w-[10%] bg-gray-600 border-r-4">Date</p>
                <p className="w-[25%] bg-gray-600 border-r-4">Name</p>
                <p className="w-[10%] bg-gray-600 border-r-4">Bill No</p>
                <p className="w-[15%] bg-gray-600 border-r-4">Paid Amount</p>
                <p className="w-[15%] bg-gray-600 border-r-4">
                  Purchase Quantity
                </p>
                <p className="w-[15%] bg-gray-600 border-r-4">
                  Purchase Amount
                </p>
                <p className="w-[10%] bg-gray-600 ">View</p>
              </div>
              <div className="w-full">
                {Object.values(transactionData)
                  .sort(function (a, b) {
                    var dateA = new Date(a.date),
                      dateB = new Date(b.date);
                    return dateB - dateA;
                  })
                  .map((trans, index) => (
                    <div key={index} className="flex mb-0.5">
                      <p className="w-[10%] bg-gray-400 border-r-4">
                        {trans.date.substring(0, 10)}
                      </p>
                      <p className="w-[25%] bg-gray-400 border-r-4">
                        {trans?.supplierDetails?.name.substring(0, 30)}
                      </p>
                      <p className="w-[10%] bg-gray-400 border-r-4">
                        {trans.bill_no}
                      </p>
                      <p className="w-[15%] bg-gray-400 border-r-4">
                        {trans?.totalPaidAmount}
                      </p>
                      <p className="w-[15%] bg-gray-400 border-r-4">
                        {trans?.totalPurchaseQuantity}
                      </p>
                      <p className="w-[15%] bg-gray-400 border-r-4">
                        {trans?.totalPurchaseAmount}
                      </p>
                      <p className="w-[10%] bg-gray-400  text-center">
                        <Link to={"/viewSupplierTransaction/" + trans._id}>
                          <button className="bg-green-600 px-4 text-white font-bold rounded-xl">
                            View
                          </button>
                        </Link>
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="fixed left-10 bottom-10">
            <Link to="/NewParty">
              <button className="rounded-xl p-4 bg-red-600 text-white hover:opacity-50">
                Add New Party <FontAwesomeIcon icon={faUserPlus} />
              </button>
            </Link>
          </div>
          <div className="fixed bottom-10 right-10">
            <Link to="/supplierTransaction">
              <button className="p-4 bg-red-600 rounded-xl text-white">
                Add Purchase/Payment transaction
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersHome;
