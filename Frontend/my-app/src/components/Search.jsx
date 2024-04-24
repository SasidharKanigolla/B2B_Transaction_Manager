import { useState, useEffect, useContext } from "react";
import { URL } from "../utils/Constants";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import LoginShow from "./LoginShow";
import * as XLSX from "xlsx";
import Loading from "../utils/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const { loggedInUserId } = useContext(UserContext);
  const [transactionData, setTransactionData] = useState([]);
  const [requestedData, setRequestedData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [creditAmnt, setCreditAmnt] = useState(0);
  const [debitAmnt, setDebitAmnt] = useState(0);
  const [totalCustQuantity, setTotalCustQuantity] = useState(0);

  const [purchAmnt, setPurchAmnt] = useState(0);
  const [paidAmnt, setPaidAmnt] = useState(0);
  const [totalPurchQuantity, setTotalPurchQuantity] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const jsonData = await fetch(URL + "/customer", { credentials: "include" });
    const data = await jsonData.json();
    const trans = data[1].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });

    const supplierData = await fetch(URL + "/supplier/supplierTransactions", {
      credentials: "include",
    });
    const supplierJsonData = await supplierData.json();
    const supplierTrans = supplierJsonData.filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    console.log([...trans, ...supplierTrans]);
    setTransactionData([...trans, ...supplierTrans]);
    setIsLoading(false);
  };

  const getDates = () => {
    let date1 = document.getElementById("from");
    let date2 = document.getElementById("to");

    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0");
    const day = String(todayDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    if (date1.value === "") {
      const defaultFromDate = new Date("2000-01-01");
      date1.value = defaultFromDate.toISOString().substring(0, 10);
    }

    if (date2.value === "") {
      date2.value = formattedDate.substring(0, 10);
    }

    setFromDate(date1.value);
    setToDate(date2.value);

    const fromDateTime = new Date(date1.value);
    const toDateTime = new Date(date2.value).setHours(23, 59, 59, 999);

    let data = transactionData.filter((trans) => {
      const transactionDate = new Date(trans.date);

      return transactionDate >= fromDateTime && transactionDate <= toDateTime;
    });

    let creditamnt = 0,
      debitamnt = 0,
      custqty = 0,
      purchamnt = 0,
      paidamnt = 0,
      purchqty = 0;
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].transType === "Debit&Credit" ||
        data[i].transType === "Credit" ||
        data[i].transType === "Debit"
      ) {
        creditamnt += data[i]?.totalDebitAmount;
        debitamnt += data[i]?.totalCreditAmount;
        custqty += data[i].totalQuantity;
        // console.log(creditAmnt, debitAmnt, qty, data[i]);
      } else {
        purchamnt += data[i]?.totalPurchaseAmount;
        purchqty += data[i]?.totalPurchaseQuantity;
        paidamnt += data[i]?.totalPaidAmount;
      }
    }
    setCreditAmnt(creditamnt);
    setDebitAmnt(debitamnt);
    setTotalCustQuantity(custqty);
    setPurchAmnt(purchamnt);
    setTotalPurchQuantity(purchqty);
    setPaidAmnt(paidamnt);
    setRequestedData(data);
  };

  const generateExcelData = () => {
    if (!fromDate) {
      return alert("Select Date to download");
    }
    const data = requestedData.map((trans) => ({
      Date: trans.date.substring(0, 10),
      Name: trans.name,
      "Transaction Type": trans.transType,
      "C/S":
        trans.transType === "Debit&Credit" ||
        trans.transType === "Credit" ||
        trans.transType === "Debit"
          ? "Sales"
          : "Purchase",
      "Total Debit/Paid Amount":
        trans.totalPaidAmount || trans.totalCreditAmount || 0,
      "Total Quantity": trans.totalQuantity || trans.totalPurchaseQuantity || 0,
      "Total Credit/Purchase Amount":
        trans.totalDebitAmount || trans.totalPurchaseAmount || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data); // Convert data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction_Data"); // Add worksheet to workbook
    XLSX.writeFile(
      workbook,
      "Transaction " + fromDate + "-" + toDate + ".xlsx"
    );
  };

  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div className="mb-40 w-full flex flex-col items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-[90%] flex flex-col items-center">
          <div className="flex justify-between w-[80%] ">
            <h1 className="text-center text-2xl font-bold">
              Search Transactions Between Dates
            </h1>

            <div className="">
              {/* Download Excel button */}
              <button
                className="rounded-xl px-4 py-2 bg-red-600 text-white hover:opacity-50"
                onClick={generateExcelData}
              >
                Download Data as Excel &nbsp;{" "}
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          </div>
          <div className="bg-black h-0.5 w-full mt-4">.</div>
          <div className="w-full flex justify-center">
            <div className="flex">
              <div className="p-4 mx-4 my-1">
                <label className="mx-4 bg-gray-300 rounded-xl p-2 font-bold">
                  From :-
                </label>
                <input
                  type="date"
                  id="from"
                  className="border-black border-2"
                />
              </div>
              <div className="p-4 mx-4 my-1">
                <label className="mx-4 bg-gray-300 rounded-xl p-2 font-bold">
                  To :-
                </label>
                <input type="date" id="to" className="border-black border-2" />
              </div>
              <div className=" m-4">
                <button
                  className="px-4 py-1 bg-red-600 text-white rounded-xl"
                  onClick={() => getDates()}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            </div>
          </div>
          {/* <div className="bg-black h-0.5 w-full mt-4 mb-8">.</div> */}

          <div className="mx-5 border-4 border-black w-full">
            <div className="flex justify-evenly font-bold ">
              <p className=" px-4 text-center border-r-4 bg-gray-400 w-[50%]">
                From Date:{fromDate}
              </p>
              <p className=" px-4 text-center  bg-gray-400 w-[50%]">
                To Date:{toDate}
              </p>
            </div>
            <div className="h-1"></div>
            <div className="flex   font-bold ">
              <div className="w-full border-r-2 ">
                <div className=" text-center border-b-4 bg-gray-400 w-full">
                  Supplier Transactions
                </div>
                <div className="flex justify-between font-bold border-b-4">
                  <p className="  text-center border-r-2 bg-gray-400 w-[34.33%]">
                    Total Paid Amount : {paidAmnt}
                  </p>
                  <p className="  text-center border-r-2 bg-gray-400 w-[28%]">
                    Total Quantity: {totalPurchQuantity}
                  </p>
                  <p className="  text-center  bg-gray-400 w-[37.33%]">
                    Total Purchase Amount :{purchAmnt}
                  </p>
                </div>
              </div>
              <div className=" font-bold w-full border-l-2">
                <div className="  text-center border-b-4 bg-gray-400 w-full">
                  Customer Transactions
                </div>
                <div className="flex justify-between font-bold mb-3">
                  <p className="  text-center border-r-2 bg-gray-400 w-[34.33%]">
                    Total Debit Amount : {debitAmnt}
                  </p>
                  <p className="  text-center border-r-2 bg-gray-400 w-[28%]">
                    Total Quantity: {totalCustQuantity}
                  </p>
                  <p className="  text-center  bg-gray-400 w-[37.33%]">
                    Total Credit Amount :{creditAmnt}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-white bg-gray-600 mb-2">
              <p className="w-[7.5%]  px-4 text-center border-r-4">Date</p>
              <p className="w-[15.5%]  px-4 text-center border-r-4">Name</p>
              <p className="w-[9%]  px-4 text-center border-r-4">P/S</p>
              <p className="w-[15%]  px-4 text-center border-r-4">
                Transaction Type
              </p>
              <p className="w-[15%]  px-4 text-center border-r-4">
                Debit/Paid Amount
              </p>
              <p className="w-[15%]  px-4 text-center border-r-4">Quantity</p>
              <p className="w-[15%]  px-4 text-center border-r-4">
                Credit/Purchase Amount
              </p>
              <p className="w-[8.5%]  px-4 text-center ">View</p>
            </div>
            {Object.values(requestedData)
              .sort(function (a, b) {
                var dateA = new Date(a.date),
                  dateB = new Date(b.date);
                return dateB - dateA;
              })
              .map((trans, index) => (
                <div
                  key={index}
                  className="flex justify-between my-0.5 bg-gray-400"
                >
                  <p className="w-[7.5%] font-bold   border-r-4">
                    {trans.date.substring(0, 10)}
                  </p>
                  <p className="w-[15.5%] font-bold   border-r-4">
                    {trans?.custDetails?.name?.substring(0, 17) ||
                      trans?.supplierDetails?.name?.substring(0, 17)}
                  </p>
                  <p className="w-[9%] font-bold    border-r-4">
                    {trans.transType === "Debit&Credit" ||
                    trans.transType === "Credit" ||
                    trans.transType === "Debit"
                      ? "Sales"
                      : "Purchase"}
                  </p>
                  <p className="w-[15%] font-bold   border-r-4">
                    {trans.transType}
                  </p>
                  <p className="w-[15%] font-bold   text-end border-r-4">
                    {trans?.totalCreditAmount || trans?.totalPaidAmount || 0}
                  </p>
                  <p className="w-[15%] font-bold   text-end border-r-4">
                    {trans.totalQuantity || trans?.totalPurchaseQuantity || 0}
                  </p>
                  <p className="w-[15%] font-bold   text-end border-r-4">
                    {trans?.totalDebitAmount || trans?.totalPurchaseAmount || 0}
                  </p>
                  {trans.transType === "Debit&Credit" ||
                  trans.transType === "Credit" ||
                  trans.transType === "Debit" ? (
                    <p className="w-[8.5%] font-bold text-white text-center">
                      <Link to={"/viewtransaction/" + trans._id}>
                        <button className="rounded-xl bg-green-600 px-3">
                          View
                        </button>
                      </Link>
                    </p>
                  ) : (
                    <p className="w-[8.5%] font-bold text-white text-center">
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
      )}
    </div>
  );
};

export default Search;
