import React from "react";
import { Link } from "react-router-dom";

const NotOwner = () => {
  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-center text-3xl font-semibold">
          You are not the owner of this Field
        </h1>
        <div>
          <Link to={"/"}>
            <button className="bg-red-600 text-white p-4 my-4 rounded-lg">
              Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotOwner;
