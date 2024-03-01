import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen ">
      <div className="flex flex-col">
        <h1 className="text-5xl italic font-bold leading-relaxed text-red">Oops! Something went wrong.</h1>
        <p className="text-[1.8rem] text-red">
          We're sorry, but something went wrong.
          <br />
          Please try again later.
        </p>
        <div className="flex items-center justify-center w-full py-5 mt-4 bg-black rounded-md jc px10">
          <Link className="text-white text-[1.8rem] hover:bg-emerald-400" to="/">go home</Link>
        </div>
      </div>    
    </div>
  );
};
export default ErrorPage;
