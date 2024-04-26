import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { URL } from "../utils/Constants";
import UserContext from "../utils/UserContext";
import LoginShow from "./LoginShow";
import Loading from "../utils/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faEye,
  faEyeSlash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Sales from "./Images/Sales.png";
import Purchase from "./Images/purchase.png";
import Stock from "./Images/Stock.png";
import Others from "./Images/Others.png";
import Orders from "./Images/orders.png";
import transactionManager from "./Images/transaction Manager.png";

const Home = () => {
  const [custSum, setCustSum] = useState(0);
  const [supplSum, setSupplSum] = useState(0);
  const [stockSum, setStockSum] = useState(0);
  const [show, setShow] = useState(false);
  const { loggedInUserId, setUserInfo } = useContext(UserContext);
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loggedInUserId) {
      fetchData();
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 16) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    }
  }, [loggedInUserId]);

  const fetchData = async () => {
    setIsLoading(true);
    const custom = await fetch(URL + "/customer", { credentials: "include" });
    const suppli = await fetch(URL + "/supplier/getSuppliers", {
      credentials: "include",
    });
    const stock = await fetch(URL + "/stock/getstocks", {
      credentials: "include",
    });
    const custdata = await custom.json();
    const suppldata = await suppli.json();
    const stockdata = await stock.json();
    console.log(stockdata);
    const cust = custdata[0].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    const suppl = suppldata.filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    const stockData = stockdata.filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    console.log(stockData);
    let custSum = 0,
      supplSum = 0,
      stocksum = 0;
    for (let i = 0; i < cust?.length; i++) {
      custSum += cust[i]?.amount;
      // console.log(data[0][i]?.amount);
    }
    setCustSum(custSum);
    for (let i = 0; i < suppl?.length; i++) {
      supplSum += suppl[i].amount;
    }
    setSupplSum(supplSum);
    for (let i = 0; i < stockData?.length; i++) {
      stocksum += stockData[i].total_quan;
    }
    setStockSum(stocksum);
    setIsLoading(false);
  };

  return loggedInUserId === null ? (
    <div>
      <LoginShow />
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex items-center flex-col">
          <div className="text-2xl  font-bold flex font-jersey-25">
            <p>WELCOME TO B2B TRANSACTION MANAGER! &nbsp;</p>
            <img src={transactionManager} alt="" className="w-8" />
          </div>
          <div className="text-xl mb-3 font-bold">
            {greeting} {loggedInUserId?.username}!!
          </div>
          <div className="flex justify-evenly w-[80%] mb-10">
            {/* <Link to={"/viewStocks"} className="w-full"> */}
            <div className=" bg-gray-200 p-8 mr-5 rounded-xl w-full">
              <h1 className="text-center mx-2 font-bold text-xl my-4">
                Total Stock Value
              </h1>
              <p className="text-center text-lg font-bold">
                {show === true ? stockSum + " kgs" : " *****"}
              </p>
            </div>
            {/* </Link> */}

            {/* <Link to={"/customerHome"} className="w-full "> */}
            <div className=" bg-gray-200 p-8 mr-5 rounded-xl w-full">
              <h1 className="text-center font-bold text-xl my-4">
                Total Party Due Amount (Receivables - Payables)
              </h1>
              <p className="text-center text-lg font-bold">
                {show === true ? custSum + "/-" : " *****"}
              </p>
            </div>
            {/* </Link> */}
          </div>

          <div className="w-[60%] flex justify-center">
            {/* <Link to={"/supplierHome"}>
            <button className="px-6 py-3 bg-red-600 rounded-md text-white hover:bg-red-700">
              Go to Suppliers Page
            </button>
          </Link> */}
            <button
              className="p-4 bg-red-600 rounded-xl text-white hover:bg-red-700"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
            {/* <Link to={"/customerHome"}>
            <button className="px-6 py-3 bg-red-600 rounded-md text-white hover:bg-red-700 ">
              Go to Customers Page
            </button>
          </Link> */}
          </div>
          <div className="w-full  my-5   bg-gray-100">
            <h1 className="text-center my-3 text-2xl font-bold">Shortcuts</h1>
            <div>
              <div className="flex justify-between">
                <div className="w-1/3 rounded-md  text-start mx-2">
                  <div className="font-bold text-2xl flex justify-center">
                    <h1>Sales &nbsp;</h1>
                    <img src={Sales} alt="" className="w-9" />
                  </div>
                  <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                    <Link to={"/CustomerHome"}>
                      <div className="flex justify-between px-2 py-0.5">
                        <p>Sales DashBoard</p>
                        <p>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </p>
                      </div>
                    </Link>
                  </p>
                  <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                    <Link to={"/addNewTransaction"}>
                      <div className="flex justify-between px-2 py-0.5">
                        <p>New Sales/Payment-In Transaction</p>
                        <p>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </p>
                      </div>
                    </Link>
                  </p>
                </div>
                <div className="w-1/3 rounded-md text-start   mx-2 ">
                  <div className="font-bold text-2xl flex justify-center">
                    <h1>Purchase &nbsp;</h1>
                    <img src={Purchase} alt="" className="w-8" />
                  </div>
                  <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                    <Link to={"/SupplierHome"}>
                      <div className="flex justify-between px-2 py-0.5">
                        <p>Purchase DashBoard</p>
                        <p>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </p>
                      </div>
                    </Link>
                  </p>
                  <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                    <Link to={"/supplierTransaction"}>
                      <div className="flex justify-between px-2 py-0.5">
                        <p className="text-start">
                          New Purchase/Payment-Out Transaction
                        </p>
                        <p>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </p>
                      </div>
                    </Link>
                  </p>
                </div>
                <div className="w-1/3 rounded-md  text-start mx-2">
                  <div className="font-bold text-2xl flex justify-center">
                    <h1>Stock Items &nbsp;</h1>
                    <img src={Stock} alt="" className="w-8" />
                  </div>
                  <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                    <Link to={"/viewStocks"}>
                      <div className="flex justify-between px-2 py-0.5">
                        <p>All Stock Items</p>
                        <p>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </p>
                      </div>
                    </Link>
                  </p>
                  <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                    <Link to={"/NewStock"}>
                      <div className="flex justify-between px-2 py-0.5">
                        <p>New Stock Item</p>
                        <p>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </p>
                      </div>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full  my-5   bg-gray-100 flex">
              {" "}
              <div className="w-1/3 rounded-md  text-start mx-2">
                <div className="font-bold text-2xl flex justify-center">
                  <h1>Parties &nbsp;</h1>
                  <FontAwesomeIcon icon={faUsers} />
                  {/* <img src={Others} alt="" className="w-7 h-7" /> */}
                </div>
                <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                  <Link to={"/AllParty"}>
                    <div className="flex justify-between px-2 py-0.5">
                      <p>All Party</p>
                      <p>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </p>
                    </div>
                  </Link>
                </p>
                <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                  <Link to={"/NewParty"}>
                    <div className="flex justify-between px-2 py-0.5">
                      <p>New Party</p>
                      <p>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </p>
                    </div>
                  </Link>
                </p>
              </div>
              <div className="w-1/3 rounded-md  text-start mx-2">
                <div className="font-bold text-2xl flex justify-center">
                  <h1>Orders &nbsp;</h1>
                  <img src={Orders} alt="" className="w-7 h-7" />
                </div>
                <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                  <Link to={"/ViewOrders"}>
                    <div className="flex justify-between px-2 py-0.5">
                      <p>All Orders</p>
                      <p>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </p>
                    </div>
                  </Link>
                </p>
                <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                  <Link to={"/NewOrder"}>
                    <div className="flex justify-between px-2 py-0.5">
                      <p>New Order</p>
                      <p>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </p>
                    </div>
                  </Link>
                </p>
              </div>
              <div className="w-1/3 rounded-md  text-start mx-2">
                <div className="font-bold text-2xl flex justify-center">
                  <h1>Others &nbsp;</h1>
                  <img src={Others} alt="" className="w-7 h-7" />
                </div>
                <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                  <Link to={"/search"}>
                    <div className="flex justify-between px-2 py-0.5">
                      <p>Search</p>
                      <p>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </p>
                    </div>
                  </Link>
                </p>
                <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
                  <Link to={"/changePass"}>
                    <div className="flex justify-between px-2 py-0.5">
                      <p>Change Password</p>
                      <p>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </p>
                    </div>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
