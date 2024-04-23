import React from "react";
import Success from "../components/Images/Tick mark.png";

const TransactionSaved = () => {
  return (
    <div>
      <div className="w-full flex justify-center">
        <div>
          <img src={Success} alt="" className="w-44" />
        </div>
      </div>
     
    </div>
  );
};

export default TransactionSaved;
