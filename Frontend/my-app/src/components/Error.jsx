import { useRouteError, Link } from "react-router-dom";
// import Header from "./Header.jsx";

const Error = () => {
  const err = useRouteError();
  console.log(err.data);
  return (
    <div>
      {/* <Header /> */}
      <p>{err.msg}</p>
      <div>
        <button className="flex mx-auto  bg-black text-white m-4 p-4 rounded-full">
          <Link to="/">Back to Home</Link>
        </button>
        <div className="flex items-center justify-center mt-3">
          <img
            className="w-auto h-[80vh]"
            src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?size=626&ext=jpg&ga=GA1.1.1496372692.1704012622&semt=ais"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Error;
