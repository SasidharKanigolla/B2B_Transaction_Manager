import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../utils/UserContext";
import LoginShow from "../LoginShow";
import { URL } from "../../utils/Constants";
import { Link } from "react-router-dom";
import Loading from "../../utils/Loading";
import No_data from "../Images/No_data.jpg";

const ViewOrders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const { loggedInUserId } = useContext(UserContext);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const jsonData = await fetch(URL + "/order/getOrders", {
      credentials: "include",
    });
    const data = await jsonData.json();
    const orderData = data.filter((item) => {
      return item.owner === loggedInUserId?._id;
    });
    console.log(orderData);
    setOrdersData(orderData);
    setIsLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setIsLoading(true);

      console.log(orderId);
      console.log(newStatus);
      const response = await fetch(URL + `/order/status/${orderId}`, {
        method: "PUT", // You can use POST or PUT based on your server implementation
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        setIsLoading(false);
        fetchData();
        console.log("Order status updated:", updatedOrder);
      } else {
        setIsLoading(false);
        console.error("Error updating order status:", response.statusText);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      setIsLoading(true);

      const response = await fetch(URL + `/order/delete/${orderId}`, {
        method: "DELETE", // You can use POST or PUT based on your server implementation
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const deletedOrder = await response.json();
        setIsLoading(false);

        fetchData();
        console.log("Order status updated:", deletedOrder);
      } else {
        setIsLoading(false);

        console.error("Error deleting order:", response.statusText);
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Error deleting order:", error);
    }
  };

  const handleFilterChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Filtered orders data based on selected status
  const filteredOrdersData =
    selectedStatus === "All" && !selectedDate
      ? ordersData
      : ordersData.filter((order) => {
          const statusMatches =
            selectedStatus === "All" || order.status === selectedStatus;
          const dateMatches =
            !selectedDate || order.orderDate?.substring(0, 10) === selectedDate;
          return statusMatches && dateMatches;
        });

  return loggedInUserId === null ? (
    <LoginShow />
  ) : (
    <div className="flex flex-col items-center w-full">
      {!isLoading ? (
        <div className="flex flex-col items-center w-[60%]">
          <div className="w-full">
            <h1 className="text-center font-bold text-3xl">Orders</h1>
          </div>
          <div className="flex justify-around items-center my-3 w-full">
            {/* Filter */}
            <div>
              <label htmlFor="status-filter" className="font-bold mr-2">
                Filter by status:
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={handleFilterChange}
                className="border rounded p-1"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="On-Hold">On-Hold</option>
                <option value="Sent">Sent</option>
              </select>
            </div>
            {/* Filter by Date */}
            <div>
              <label htmlFor="date-filter" className="font-bold mr-2">
                Filter by date:
              </label>
              <input
                type="date"
                id="date-filter"
                value={selectedDate}
                onChange={handleDateFilterChange}
                className="border rounded p-1"
              />
            </div>
          </div>
          {filteredOrdersData.length !== 0 ? (
            <div className="w-full my-3">
              {filteredOrdersData &&
                Object.values(filteredOrdersData)
                  .sort(function (a, b) {
                    var dateA = new Date(a.orderDate),
                      dateB = new Date(b.orderDate);
                    return dateB - dateA;
                  })
                  .map((data, index) => (
                    <div key={index}>
                      <div className="bg-gray-200 rounded-lg my-3 p-5">
                        <div className="my-3 ">
                          {/* <h1 className="text-center font-bold mb-2">
                      Customer Details
                    </h1> */}
                          <div className="flex justify-between">
                            <p className="font-bold">
                              Name of the Party: {data?.custDetails?.name}
                            </p>
                            <Link to={"/ViewParty/" + data?.custDetails?._id}>
                              <button className="bg-green-600 text-white px-4 py-1 rounded-md">
                                See Full Details of the Party
                              </button>
                            </Link>
                          </div>
                        </div>
                        {/* <div className="bg-black h-0.5 mt-3"></div> */}
                        <div className="flex justify-between items-center">
                          <div className="flex w-full">
                            <label htmlFor="status" className="font-bold">
                              Status &nbsp;&nbsp;{" "}
                            </label>
                            <select
                              id="status"
                              value={data.status}
                              onChange={(e) => {
                                updateOrderStatus(data._id, e.target.value);
                              }}
                            >
                              <option value="Active">Active</option>
                              <option value="On-Hold">On-Hold</option>
                              <option value="Sent">Sent</option>
                            </select>
                          </div>
                          <div
                            className={`${
                              data.status === "Active"
                                ? "bg-red-600"
                                : data.status === "On-Hold"
                                ? "bg-yellow-600"
                                : "bg-green-600"
                            } rounded-xl w-5 h-5`}
                          ></div>
                        </div>
                        <div>
                          <p className="font-bold my-2 w-full">Description:</p>
                          <p className="w-full break-words">
                            {data?.description}
                          </p>
                        </div>
                        <div className="bg-black h-0.5 mt-3"></div>
                        <div>
                          <h1 className="text-center font-bold">
                            Order Details
                          </h1>
                          <p>Order Date: {data.orderDate?.substring(0, 10)}</p>
                          <p>
                            Delivery Requested Date:{" "}
                            {data.deliveryDate?.substring(0, 10)}
                          </p>
                        </div>
                        <table className="w-full my-3">
                          <tr>
                            <th className="border border-black">
                              Name of the stock
                            </th>
                            <th className="border border-black">Quantity</th>
                            <th className="border border-black">
                              Price Per Unit
                            </th>
                            <th className="border border-black">Amount</th>
                          </tr>
                          {data.orderDetails.map((detail, index) => (
                            <tr key={index}>
                              {/* <div className="flex "> */}
                              <td className="text-center border border-black">
                                {detail?.productName}
                              </td>
                              <td className="text-center border border-black">
                                {detail?.quantity || 0}
                              </td>
                              <td className="text-center border border-black">
                                {detail?.pricePerUnit}
                              </td>
                              <td className="text-center border border-black">
                                {detail?.amount}
                              </td>
                              {/* </div> */}
                            </tr>
                          ))}
                        </table>
                        <div className="flex justify-between mt-6">
                          {/* <Link>
                        <button className="bg-green-600 text-white px-4 py-1 rounded-md">
                          Edit
                        </button>
                      </Link> */}
                          <button
                            className="bg-red-600 text-white px-4 py-1 rounded-md"
                            onClick={() => deleteOrder(data._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-2xl font-bold">No orders found.</p>
              <div className="flex justify-center">
                <img src={No_data} alt="" className="w-[400px] h-96 " />
              </div>
            </div>
          )}
          <div>
            <Link to={"/NewOrder"}>
              <button className="px-4 py-2 bg-red-600 fixed bottom-10 right-10 rounded-md text-white hover:bg-red-700">
                New Order
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ViewOrders;
