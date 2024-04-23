import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import Sales from "./Images/Sales.png";
import Purchase from "./Images/purchase.png";
import Stock from "./Images/Stock.png";
import Others from "./Images/Others.png";

const Footer = () => {
  return (
    <div className="mb-0 relative bottom-0 left-0 right-0 ">
      <div className="w-full  mt-5 px-20 pt-5 bg-gray-100">
        <h1 className="text-center my-3 text-2xl font-bold">Shortcuts</h1>
        <div className="flex justify-between">
          <div className="w-1/4 rounded-md  text-center mx-2">
            <div className="font-bold text-2xl flex justify-center">
              <h1>Sales &nbsp;</h1>
              <img src={Sales} alt="" className="w-9" />
            </div>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/CustomerHome"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>Sales DashBoard</p>
                  <p>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </p>
                </div>
              </Link>
            </p>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/addNewTransaction"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>New Sales/Payment-In Transaction</p>
                  <p>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </p>
                </div>
              </Link>
            </p>
          </div>
          <div className="w-1/4 rounded-md  text-center mx-2">
            <div className="font-bold text-2xl flex justify-center">
              <h1>Purchase &nbsp;</h1>
              <img src={Purchase} alt="" className="w-8" />
            </div>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/SupplierHome"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>Purchase DashBoard</p>
                  <p>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </p>
                </div>
              </Link>
            </p>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/supplierTransaction"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>New Purchase/Payment-Out Transaction</p>
                  <p>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </p>
                </div>
              </Link>
            </p>
          </div>
          <div className="w-1/4 rounded-md  text-center mx-2">
            <div className="font-bold text-2xl flex justify-center">
              <h1>Stock Items &nbsp;</h1>
              <img src={Stock} alt="" className="w-8" />
            </div>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/viewStocks"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>All Stock Items</p>
                  <p>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </p>
                </div>
              </Link>
            </p>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/NewStock"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>New Stock Item</p>
                  <p>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </p>
                </div>
              </Link>
            </p>
          </div>
          <div className="w-1/4 rounded-md  text-center mx-2">
            <div className="font-bold text-2xl flex justify-center">
              <h1>Others &nbsp;</h1>
              <img src={Others} alt="" className="w-7 h-7" />
            </div>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/AllParty"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>All Party</p>
                  <p>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </p>
                </div>
              </Link>
            </p>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/NewParty"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>New Party</p>
                  <p>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </p>
                </div>
              </Link>
            </p>
            <p className="hover:bg-gray-400 w-full rounded-md bg-gray-200 my-1 ">
              <Link to={"/search"}>
                <div className="flex justify-between px-2 pt-0.5">
                  <p>Search</p>
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
  );
};

export default Footer;
