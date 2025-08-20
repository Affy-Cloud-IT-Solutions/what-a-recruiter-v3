import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div>
      {" "}
      <Link
        to="/"
        className="md:text-xl text-xl tracking-tighter text-decoration-none  absolute top-2 leading-none left-2 drop-shadow-lg bg-transparent text-white p-2 inline-block z-20 font-[400]"
      >
        What a Recruiter
      </Link>
    </div>
  );
};

export default Logo;
