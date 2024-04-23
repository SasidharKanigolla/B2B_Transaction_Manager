import { URL } from "../utils/Constants";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import LoginShow from "./LoginShow";
import * as XLSX from "xlsx";
import Loading from "../utils/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const AllParty = () => {
  const [customersData, setCustomersData] = useState([]);
  const { loggedInUserId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    // setPrevPageUrl(window.location.href);
    const jsonData = await fetch(URL + "/customer", { credentials: "include" });
    const data = await jsonData.json();
    const cust = data[0].filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    // console.log(cust);
    setCustomersData(cust);
    // console.log( data[0]);
    setIsLoading(false);
  };
  const downloadExcel = () => {
    const filteredCustData = customersData.map(
      ({ name, gst, mobile, address, createdAt, updatedAt }) => ({
        Name: name,
        GST: gst,
        Mobile: mobile,
        Address: address,
        Created_On: createdAt,
        Updated_On: updatedAt,
      })
    );
    const worksheet = XLSX.utils.json_to_sheet(filteredCustData); // Convert data to worksheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers"); // Add worksheet to workbook
    XLSX.writeFile(workbook, "customers.xlsx"); // Download workbook as an Excel file
  };

  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mb-24">
          <div className="flex flex-col items-center">
            <div className="mb-5  w-[80%] flex justify-between items-center">
              <p className="font-bold text-3xl ">All Parties <FontAwesomeIcon icon={faUsers}/></p>
              <button
                onClick={downloadExcel}
                className="rounded-xl p-2 bg-red-600 text-white hover:opacity-50"
              >
                Download Parties Data as Excel &nbsp;{" "}
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
            <div className="w-[80%] mb-5 flex justify-center ">
              <div className="w-[40%] ">
                <input
                  type="text"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border  bg-gray-200 rounded-md py-2 px-3 mt-1 border-gray-600 focus:outline-none focus:border-blue-600 placeholder:text-black"
                  placeholder="Search Party By Name or Mobile Number"
                />
                {/* <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute h-8 right-40"/> */}
              </div>
            </div>
            <div className="w-[80%] border border-black">
              <div className="flex bg-gray-600 text-white mb-3">
                <p className="w-[40%]  px-4 text-center border-r-4">Name</p>
                <p className="w-[20%]  px-4 text-center border-r-4">Mobile</p>
                <p className="w-[20%]  px-4 text-center border-r-4">
                  Amount Due
                </p>
                <p className="w-[20%]  px-4 text-center ">View</p>
              </div>
              {customersData
                .filter(
                  (cust) =>
                    cust.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    String(cust?.mobile ?? "").includes(searchQuery)
                )
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((cust) => (
                  <div className="flex bg-gray-400 mb-0.5 font-bold">
                    <p className="w-[40%]  px-0 text-center border-r-4">
                      {cust.name}
                    </p>
                    <p className="w-[20%]  px-4 text-center border-r-4">
                      {cust.mobile}
                    </p>
                    <p className="w-[20%]  px-4 text-end border-r-4">
                      {cust.amount}/-
                    </p>
                    <div className="w-[20%]  px-4 text-center ">
                      <Link to={"/ViewParty/" + cust._id}>
                        <button className="px-4 bg-green-600 text-white rounded-xl">
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="fixed right-10 bottom-10">
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
  //         <div className="mb-8">
  //           <h1 className="font-bold text-3xl mb-4">All Customers</h1>
  //           <button
  //             onClick={downloadExcel}
  //             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
  //           >
  //             Download Excel
  //           </button>
  //         </div>
  //         <div className="w-full overflow-x-auto">
  //           <table className="w-full bg-white rounded-lg shadow-md">
  //             <thead>
  //               <tr className="bg-gray-200  text-lg">
  //                 <th className="py-2 text-left">Name</th>
  //                 <th className="py-2 text-left">Mobile</th>
  //                 <th className="py-2 text-left">Amount Due</th>
  //                 <th className="py-2 text-center">Actions</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {customersData.map((cust, index) => (
  //                 <tr
  //                   key={cust._id}
  //                   className={index % 2 === 1 ? "bg-gray-100" : ""}
  //                 >
  //                   <td className="">{cust.name}</td>
  //                   <td className="">{cust.mobile}</td>
  //                   <td className="">{cust.amount}/-</td>
  //                   <td className=" text-center">
  //                     <Link to={`/viewCustomer/${cust._id}`}>
  //                       <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
  //                         View
  //                       </button>
  //                     </Link>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //         <div className="w-full flex justify-center">
  //           <Link to="/Customers">
  //             <button className="mb-8 bg-red-600 justify-center p-4 rounded-xl text-white">
  //               All Customers
  //             </button>
  //           </Link>
  //         </div>
  //         <div className="fixed right-10 bottom-10">
  //           <Link to="/addNewTransaction">
  //             <button className="rounded-xl p-4 bg-red-600 text-white hover:opacity-50">
  //               Add Transaction
  //             </button>
  //           </Link>
  //         </div>
  //         <div className="fixed left-10 bottom-10">
  //           <Link to="/addNewCustomer">
  //             <button className="rounded-xl p-4 bg-red-600 text-white hover:opacity-50">
  //               Add Customer
  //             </button>
  //           </Link>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default AllParty;
