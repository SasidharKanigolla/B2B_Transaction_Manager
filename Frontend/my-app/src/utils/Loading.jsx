import React from "react";
import Header from "../components/Header";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white">
      <div className="absolute top-0 left-0 right-0 ">
        <Header />
      </div>
      <div className="mt-20 animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      <div className="mt-4 text-lg font-semibold text-gray-700">Loading...</div>
    </div>
  );
};

export default Loading;
