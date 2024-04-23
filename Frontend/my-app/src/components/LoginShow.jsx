import React from "react";
import { Link } from "react-router-dom";
import Login from "./Login";

const LoginShow = () => {
  return (
    <div>
      {(window.location.href = "/login")}
      <Login />
    </div>
    // <div className="w-full flex flex-col items-center">
    //   <Link to={"/login"}>
    //     <div className="flex justify-center mb-10">
    //       <h1 className="my-4 text-3xl font-bold">Login Required!!</h1>
    //     </div>
    //     <div className="flex justify-center">
    //       <button className="bg-red-600 p-4 text-white rounded-xl">
    //         Login
    //       </button>
    //     </div>
    //   </Link>
    // </div>
  );
};

export default LoginShow;
