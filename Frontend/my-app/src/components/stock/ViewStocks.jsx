import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../utils/UserContext";
import { URL } from "../../utils/Constants";
import LoginShow from "../LoginShow";
import Loading from "../../utils/Loading";
import { Link } from "react-router-dom";
import No_data from "../Images/No_data.jpg";

const ViewStocks = () => {
  const [stockData, setStockData] = useState([]);
  const { loggedInUserId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loggedInUserId) fetchData();
  }, []);

  const fetchData = async () => {
    const jsonData = await fetch(URL + "/stock/getStocks", {
      credentials: "include",
    });
    const data = await jsonData.json();
    const stock = data.filter((data) => {
      return data?.owner === loggedInUserId?._id;
    });
    console.log(stock);
    setStockData(stock);
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
        <div className="flex flex-col items-center w-full">
          <div className="w-[80%] flex items-center flex-col ">
            <h2 className="text-2xl font-bold my-3">Stock Details</h2>
            {stockData.length !== 0 ? (
              <div className="flex flex-col w-full">
                <div className="flex border text-white mb-1">
                  <p className="w-1/3 bg-gray-600 text-center font-semibold border-r-4">
                    Name
                  </p>
                  <p className="w-1/3 bg-gray-600 text-center font-semibold border-r-4">
                    Total Quantity
                  </p>
                  {/* <p className="w-1/3 bg-gray-600 text-center font-semibold border-r-4">
              Total Amount
            </p> */}
                  <p className="w-1/3 bg-gray-600 text-center font-semibold border-r-4">
                    View
                  </p>
                </div>
                {stockData.map((stock, index) => (
                  <div key={index} className="flex border ">
                    <p className="w-1/3 bg-gray-400 text-center font-semibold border-r-4">
                      {stock.name_of_prod}
                    </p>
                    <p className="w-1/3 bg-gray-400 text-end font-semibold border-r-4">
                      {stock.total_quan}
                    </p>
                    {/* <p className="w-1/3 bg-gray-400 text-end font-semibold border-r-4">
                {stock.pricePerUnit}
              </p> */}
                    <p className="w-1/3 bg-gray-400 text-center font-semibold border-r-4">
                      <Link to={"/viewStock/" + stock._id}>
                        <button className="bg-green-600 text-white px-4 rounded-xl">
                          View
                        </button>
                      </Link>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-2xl font-bold">
                  No stock data available. Please add stocks.
                </p>
                <div className="flex justify-center">
                  <img src={No_data} alt="" className="w-[400px] h-96 " />
                </div>
                <div className="my-5">
                  <Link to={"/NewStock"}>
                    <button className="p-4 bg-red-600 text-white rounded-xl">
                      Add New Stock Item
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="absolute right-10 bottom-10">
            <Link to={"/NewStock"}>
              <button className="p-4 bg-red-600 text-white rounded-xl">
                Add New Stock Item
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStocks;
