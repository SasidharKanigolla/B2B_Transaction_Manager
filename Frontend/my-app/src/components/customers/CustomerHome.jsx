import { URL } from "../../utils/Constants";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../utils/UserContext";
import LoginShow from "../LoginShow";
import Loading from "../../utils/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const CustomerHome = () => {
  console.log("Hii");
  // const [customersData, setCustomersData] = useState([]);
  // const [transactionData, setTransactionData] = useState([]);
  const [monthlyTransactionAmount, setMonthlyTransactionAmount] = useState([]);
  const [yearlyTrans, setYearlyTrans] = useState([]);

  const [todayTransaction, setTodayTransaction] = useState([]);
  const [creditAmnt, setCreditAmnt] = useState(0);
  const [debitAmnt, setDebitAmnt] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [TodayQuantity, setTodayQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { loggedInUserId } = useContext(UserContext);

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    // setPrevPageUrl(window.location.href);
    const jsonData = await fetch(URL + "/customer", { credentials: "include" });
    const data = await jsonData.json();
    // setCustomersData(data[0]);
    // setTransactionData(trans);
    const trans = data[1].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    console.log(trans);
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0");
    const day = String(todayDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // console.log(transactionData);
    // console.log(formattedDate);
    let today = trans.filter(
      (trans) =>
        trans?.date?.substring(0, 10) === formattedDate?.substring(0, 10)
    );
    console.log(today);
    let debitamnt = 0,
      creditamnt = 0,
      totalamount = 0,
      qty = 0;
    for (let i = 0; i < today.length; i++) {
      qty += today[i].totalQuantity;
      debitamnt += today[i].totalDebitAmount;
      creditamnt += today[i]?.totalCreditAmount;
      totalamount += today[i]?.totalAmount;
    }

    setTodayTransaction(today);
    setCreditAmnt(creditamnt);
    setDebitAmnt(debitamnt);
    setTotalAmount(totalamount);
    setTodayQuantity(qty);

    const monthlyTransactions = trans.filter((trans) => {
      const transactionDate = new Date(trans.date);
      // console.log(transactionDate.getFullYear() === year);
      return (
        transactionDate.getFullYear() === year &&
        String(transactionDate.getMonth() + 1).padStart(2, "0") === month
      );
    });

    const totalCreditAmountMOnth = monthlyTransactions.reduce((acc, trans) => {
      return acc + trans.totalDebitAmount;
    }, 0);
    setMonthlyTransactionAmount(totalCreditAmountMOnth);

    const yearlyTrans = trans.filter((trans) => {
      const transactionDate = new Date(trans.date);
      // console.log(transactionDate.getFullYear() === year);
      return transactionDate.getFullYear() === year;
    });

    const totalCreditAmountyearly = yearlyTrans.reduce((acc, trans) => {
      return acc + trans.totalDebitAmount;
    }, 0);
    setYearlyTrans(totalCreditAmountyearly);
    setIsLoading(false);
  };

  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div className="  mb-52 flex flex-col items-center w-full">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="flex justify-center mb-10 w-[90%]">
            <div className="one is w-[33.33%] h-full bg-gray-600 text-white rounded-xl mr-5">
              <h1 className="text-2xl text-center my-4 px-2">
                {new Date().getFullYear()} Sales : ₹ {yearlyTrans}/-
              </h1>
            </div>
            <div className="w-[33.33%] h-full bg-gray-600 text-white rounded-xl mr-5">
              <h1 className="text-2xl text-center my-4 px-2">
                {new Date().toLocaleString("default", { month: "long" }) + " "}{" "}
                Sales : ₹ {monthlyTransactionAmount}/-
              </h1>
            </div>
            <div className="w-[33.33%] h-full bg-gray-600 text-white rounded-xl mr-5">
              <h1 className="text-2xl text-center my-4 px-2">
                Today Sales : ₹ {debitAmnt}/-
              </h1>
            </div>
          </div>
          <h1 className="mb-10 text-3xl font-bold">
            View Today Sales Transactions
          </h1>

          <div className="mx-4 border-4 border-black w-[90%]">
            <div className="flex flex-col">
              <div className="">
                <p className="font-bold text-center bg-gray-400 border-b-4">
                  {Date(Date.now()).substring(4, 15)}
                </p>
              </div>

              <div className="flex w-full  font-bold border-b-4">
                <p className=" px-4 text-center border-r-4 bg-gray-400 w-[33.33%]">
                  Quantity:{TodayQuantity}
                </p>
                <p className="text-center px-4 bg-gray-400 border-r-4 w-[33.33%]">
                  Credit Amount:{creditAmnt}
                </p>
                <p className="text-center px-4 bg-gray-400 w-[33.34%] ">
                  Debit Amount:
                  {debitAmnt}
                </p>
              </div>
            </div>

            <div className="">
              <div className="flex justify-between text-white bg-gray-600 mb-2">
                <p className="w-[25%]  px-4 text-center border-r-4">Name</p>
                <p className="w-[20%]  px-4 text-center border-r-4">
                  Transaction Type
                </p>
                <p className="w-[15%]  px-4 text-center border-r-4">
                  Total Quantity
                </p>
                <p className="w-[15%]  px-4 text-center border-r-4">
                  Total Debit Amount
                </p>
                <p className="w-[15%]  px-4 text-center border-r-4">
                  Total Credit Amount
                </p>
                <p className="w-[10%]  px-4 text-center ">View</p>
              </div>
              {todayTransaction.map((trans, index) => (
                <div
                  key={index}
                  className="flex justify-between my-0.5 bg-gray-400 "
                >
                  {/* {console.log(trans.date)} */}
                  <p className="w-[25%] font-bold   border-r-4">
                    {trans.custDetails.name.substring(0, 28)}
                  </p>
                  <p className="w-[20%] font-bold   border-r-4">
                    {trans.transType}
                  </p>
                  <p className="w-[15%] font-bold   text-end border-r-4">
                    {trans.totalQuantity}
                  </p>
                  <p className="w-[15%] font-bold   text-end border-r-4">
                    {trans?.totalCreditAmount}
                  </p>
                  <p className="w-[15%] font-bold   text-end border-r-4">
                    {trans.totalDebitAmount}
                  </p>

                  <p className="w-[10%] font-bold   text-white text-center ">
                    <Link to={"/viewTransaction/" + trans._id}>
                      <button className="rounded-xl bg-green-600 px-6">
                        View
                      </button>
                    </Link>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="fixed right-10 bottom-10">
            <Link to="/addNewTransaction">
              <button className="rounded-xl p-4 bg-red-600 text-white hover:opacity-50">
                Add Sale/Payment Transaction
              </button>
            </Link>
          </div>

          <div className="fixed left-10 bottom-10">
            <Link to="/NewParty">
              <button className="rounded-xl p-4 bg-red-600 text-white hover:opacity-50">
                Add New Party <FontAwesomeIcon icon={faUserPlus} />
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
  // return loggedInUserId === null ? (
  //   <LoginShow />
  // ) : (
  //   <div className="container mx-auto px-4 py-8">
  //     {isLoading ? (
  //       <Loading />
  //     ) : (
  //       <div className="max-w-screen-lg mx-auto">
  //         <header className="flex items-center justify-between mb-4">
  //           <h1 className="text-2xl font-bold">Today's Transactions</h1>
  //         </header>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
  //           <div className="bg-gray-100 rounded-lg p-4">
  //             <h2 className="text-lg font-semibold mb-2">Total Sales</h2>
  //             <p className="text-xl font-bold">₹ {yearlyTrans}</p>
  //           </div>
  //           <div className="bg-gray-100 rounded-lg p-4">
  //             <h2 className="text-lg font-semibold mb-2">Monthly Sales</h2>
  //             <p className="text-xl font-bold">₹ {monthlyTransactionAmount}</p>
  //           </div>
  //           <div className="bg-gray-100 rounded-lg p-4">
  //             <h2 className="text-lg font-semibold mb-2">Today's Sales</h2>
  //             <p className="text-xl font-bold">₹ {debitAmnt}</p>
  //           </div>
  //         </div>
  //         <div className="w-full flex justify-center">
  //           <Link to="/Customers">
  //             <button className="mb-8 bg-red-600 justify-center p-4 rounded-xl text-white">
  //               All Customers
  //             </button>
  //           </Link>
  //         </div>
  //         <div className="overflow-x-auto">
  //           <table className="w-full border border-gray-300">
  //             <thead className="bg-gray-200">
  //               <tr>
  //                 <th className="text-center py-2">Date</th>
  //                 <th className="text-center py-2">Name</th>
  //                 <th className="text-center py-2">Transaction Type</th>
  //                 <th className="text-center py-2">Total Quantity</th>
  //                 <th className="text-center py-2">Total Debit Amount</th>
  //                 <th className="text-center py-2">Total Credit Amount</th>
  //                 <th className="text-center py-2">View</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {todayTransaction.map((trans, index) => (
  //                 <tr
  //                   key={index}
  //                   className={index % 2 === 1 ? "bg-gray-100 " : ""}
  //                 >
  //                   <td className="text-center py-2">
  //                     {trans.date.substring(0, 10)}
  //                   </td>
  //                   <td className="text-center py-2">
  //                     {trans.custDetails.name.substring(0, 28)}
  //                   </td>
  //                   <td className="text-center py-2">{trans.transType}</td>
  //                   <td className="text-center py-2">{trans.totalQuantity}</td>
  //                   <td className="text-center py-2">
  //                     {trans.totalDebitAmount}
  //                   </td>
  //                   <td className="text-center py-2">
  //                     {trans.totalCreditAmount}
  //                   </td>
  //                   <td className="text-center py-2">
  //                     <Link to={"/viewTransaction/" + trans._id}>
  //                       <button className="bg-green-600 text-white px-3 py-1 rounded-lg">
  //                         View
  //                       </button>
  //                     </Link>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //         <div className="fixed right-10 bottom-10">
  //           <Link to="/addNewTransaction">
  //             <button className="rounded-xl p-4 bg-red-600 text-white hover:opacity-50">
  //               Add New Transaction
  //             </button>
  //           </Link>
  //         </div>
  //         <div className="fixed left-10 bottom-10">
  //           <Link to="/addNewCustomer">
  //             <button className="rounded-xl p-4 bg-red-600 text-white hover:opacity-50">
  //               Add New Customer
  //             </button>
  //           </Link>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default CustomerHome;
