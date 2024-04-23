// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import Header from "./components/Header.jsx";
// import Search from "./components/customers/Search";
// import Error from "./components/Error.jsx";
// import Home from "./components/Home.jsx";
// import CustomerHome from "./components/customers/CustomerHome.jsx";
// import NewTransaction from "./components/customers/NewTransaction.jsx";
// import Customers from "./components/customers/Customers.jsx";
// import NewCustomer from "./components/customers/NewCustomer.jsx";
// import ViewCustomer from "./components/customers/ViewCustomer.jsx";
// import ViewTransaction from "./components/customers/ViewTransaction.jsx";
// import EditCustomer from "./components/customers/EditCustomer.jsx";
// import EditTransaction from "./components/customers/EditTransaction.jsx";
// import Suppliers from "./components/suppliers/Suppliers.jsx";
// import NewSupplier from "./components/suppliers/NewSupplier.jsx";
// import SupplierTransaction from "./components/suppliers/SupplierTransaction.jsx";
// import ViewSupplier from "./components/suppliers/ViewSupplier.jsx";
// import EditSupplier from "./components/suppliers/EditSupplier.jsx";
// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import EditSupplierTransaction from "./components/suppliers/EditSupplierTransaction.jsx";
// import ViewSupplierTransaction from "./components/suppliers/ViewSupplierTransaction.jsx";
// import SuppliersHome from "./components/suppliers/SuppliersHome.jsx";
// import UserContext from "./utils/UserContext.js";
// import Login from "./components/Login";
// import Signup from "./components/Signup.jsx";
// import Cookies from "js-cookie";
// import ViewStocks from "./components/stock/ViewStocks.jsx";
// import ViewStock from "./components/stock/ViewStock.jsx";
// import NewStockItem from "./components/stock/NewStockItem.jsx";

// const AppLayout = () => {
//   // const [custInvoice, setCustInvoice] = useState(0);
//   const [userInfo, setUserInfo] = useState(() => {
//     const userData = Cookies.get("userData");
//     // const userData = sessionStorage.getItem("userData");
//     return userData ? JSON.parse(userData) : null;
//   });

//   useEffect(() => {
//     const expires = new Date(Date.now() + 30 * 60 * 1000); // Current time + 30 mins
//     Cookies.set("userData", JSON.stringify(userInfo), { expires });
//     // sessionStorage.setItem("userData", JSON.stringify(userInfo));
//   }, [userInfo]);

//   return (
//     <UserContext.Provider
//       value={{
//         loggedInUserId: userInfo,
//         setUserInfo,
//       }}
//     >
//       <div>
//         <Header />
//         <Outlet />
//       </div>
//     </UserContext.Provider>
//   );
// };

// const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <AppLayout />,
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/signup",
//         element: <Signup />,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       // Customers
//       {
//         path: "/Customers",
//         element: <Customers />,
//       },
//       {
//         path: "/customerHome",
//         element: <CustomerHome />,
//       },
//       {
//         path: "/supplierHome",
//         element: <SuppliersHome />,
//       },
//       {
//         path: "/addNewTransaction",
//         element: <NewTransaction />,
//       },
//       {
//         path: "/addNewCustomer",
//         element: <NewCustomer />,
//       },
//       {
//         path: "/viewCustomer/:id",
//         element: <ViewCustomer />,
//       },
//       {
//         path: "/viewTransaction/:id",
//         element: <ViewTransaction />,
//       },
//       {
//         path: "/editCustomer/:id",
//         element: <EditCustomer />,
//       },
//       {
//         path: "/editTransaction/:id",
//         element: <EditTransaction />,
//       },
//       {
//         path: "/search",
//         element: <Search />,
//       },
//       // Suppliers
//       {
//         path: "/Suppliers",
//         element: <Suppliers />,
//       },
//       {
//         path: "/newSupplier",
//         element: <NewSupplier />,
//       },
//       {
//         path: "/supplierTransaction",
//         element: <SupplierTransaction />,
//       },
//       {
//         path: "/viewSupplier/:id",
//         element: <ViewSupplier />,
//       },
//       {
//         path: "/editSupplier/:id",
//         element: <EditSupplier />,
//       },
//       {
//         path: "/editSupplierTransaction/:id",
//         element: <EditSupplierTransaction />,
//       },
//       {
//         path: "/viewSupplierTransaction/:id",
//         element: <ViewSupplierTransaction />,
//       },
//       //Stocks
//       {
//         path: "/ViewStocks",
//         element: <ViewStocks />,
//       },
//       {
//         path: "/ViewStock/:id",
//         element: <ViewStock />,
//       },
//       {
//         path: "/NewStock",
//         element: <NewStockItem />,
//       },
//     ],

//     errorElement: <Error />,
//   },
// ]);

// const root = ReactDOM.createRoot(document.getElementById("root")); //Creating the root element where the code is replaced
// root.render(<RouterProvider router={appRouter} />);

import React, { useEffect, useState, lazy, Suspense } from "react";
import CryptoJS from "crypto-js";
import ReactDOM from "react-dom/client";
import "./index.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Error from "./components/Error.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import UserContext from "./utils/UserContext.js";
import Cookies from "js-cookie";
import Loading from "./utils/Loading.jsx";

const Search = lazy(() => import("./components/Search"));
const Home = lazy(() => import("./components/Home.jsx"));
const CustomerHome = lazy(() =>
  import("./components/customers/CustomerHome.jsx")
);
const NewTransaction = lazy(() =>
  import("./components/customers/NewTransaction.jsx")
);
const AllParty = lazy(() => import("./components/AllParty.jsx"));
const NewParty = lazy(() => import("./components/NewParty.jsx"));
const ViewParty = lazy(() => import("./components/ViewParty.jsx"));
const ViewTransaction = lazy(() =>
  import("./components/customers/ViewTransaction.jsx")
);
const EditParty = lazy(() => import("./components/EditParty.jsx"));
const EditTransaction = lazy(() =>
  import("./components/customers/EditTransaction.jsx")
);
const SupplierTransaction = lazy(() =>
  import("./components/suppliers/SupplierTransaction.jsx")
);
const EditSupplierTransaction = lazy(() =>
  import("./components/suppliers/EditSupplierTransaction.jsx")
);
const ViewSupplierTransaction = lazy(() =>
  import("./components/suppliers/ViewSupplierTransaction.jsx")
);
const SuppliersHome = lazy(() =>
  import("./components/suppliers/SuppliersHome.jsx")
);
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup.jsx"));
const Reset = lazy(() => import("./components/Reset.jsx"));
const ChangePass = lazy(() => import("./components/ChangePass.jsx"));
const ViewStocks = lazy(() => import("./components/stock/ViewStocks.jsx"));
const ViewStock = lazy(() => import("./components/stock/ViewStock.jsx"));
const NewStockItem = lazy(() => import("./components/stock/NewStockItem.jsx"));
const ViewOrders = lazy(() => import("./components/orders/ViewOrders.jsx"));
const NewOrder = lazy(() => import("./components/orders/NewOrder.jsx"));
const secretKey = "your-secret-key"; // Replace with your actual secret key

function encryptData(data) {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

function decryptData(encryptedData) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    // Convert the bytes to a UTF-8 encoded string
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Return null or handle error as needed
  }
}

const AppLayout = () => {
  // const [userInfo, setUserInfo] = useState(() => {
  //   const userData = Cookies.get("userData");
  //   return userData ? JSON.parse(userData) : null;
  // });

  // useEffect(() => {
  //   const expires = new Date(Date.now() + 30 * 60 * 1000); // Current time + 30 mins
  //   Cookies.set("userData", JSON.stringify(userInfo), { expires });
  // }, [userInfo]);

  const [userInfo, setUserInfo] = useState(() => {
    const encryptedUserData = Cookies.get("userData");
    if (encryptedUserData) {
      const decryptedData = decryptData(encryptedUserData);
      return JSON.parse(decryptedData);
    }
    return null;
  });

  useEffect(() => {
    if (userInfo) {
      const encryptedData = encryptData(JSON.stringify(userInfo));
      const expires = new Date(Date.now() + 30 * 60 * 1000); // Current time + 30 mins
      Cookies.set("userData", encryptedData, { expires });
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        loggedInUserId: userInfo,
        setUserInfo,
      }}
    >
      <div className=" ">
        <Header />
        <Suspense fallback={<Loading />}>
          <Outlet className="background" />
        </Suspense>
        {/* <Footer /> */}
      </div>
    </UserContext.Provider>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/reset",
        element: <Reset />,
      },
      {
        path: "/changePass",
        element: <ChangePass />,
      },
      // Customers
      {
        path: "/AllParty",
        element: <AllParty />,
      },
      {
        path: "/customerHome",
        element: <CustomerHome />,
      },
      {
        path: "/supplierHome",
        element: <SuppliersHome />,
      },
      {
        path: "/addNewTransaction",
        element: <NewTransaction />,
      },
      {
        path: "/NewParty",
        element: <NewParty />,
      },
      {
        path: "/ViewParty/:id",
        element: <ViewParty />,
      },
      {
        path: "/viewTransaction/:id",
        element: <ViewTransaction />,
      },
      {
        path: "/EditParty/:id",
        element: <EditParty />,
      },
      {
        path: "/editTransaction/:id",
        element: <EditTransaction />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      // Suppliers
      {
        path: "/supplierTransaction",
        element: <SupplierTransaction />,
      },
      {
        path: "/editSupplierTransaction/:id",
        element: <EditSupplierTransaction />,
      },
      {
        path: "/viewSupplierTransaction/:id",
        element: <ViewSupplierTransaction />,
      },
      //Stocks
      {
        path: "/ViewStocks",
        element: <ViewStocks />,
      },
      {
        path: "/ViewStock/:id",
        element: <ViewStock />,
      },
      {
        path: "/NewStock",
        element: <NewStockItem />,
      },
      // Orders
      {
        path: "/ViewOrders",
        element: <ViewOrders />,
      },
      {
        path: "/NewOrder",
        element: <NewOrder />,
      },
    ],
    errorElement: <Error />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
