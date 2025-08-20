import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { navLinks } from "@/lib/utils";

const Navbar = () => {
  const [showUser, setShowUser] = useState(false);
  const userPanelRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toggleUser();
    navigate("/login");
  };

  const linksToDisplay = role ? navLinks[role][0] : [];

  const toggleUser = () => {
    setShowUser((prev) => !prev);
  };
  const userInfo = token && jwtDecode(token);
  useEffect(() => {
    // Click outside logic
    const handleClickOutside = (event) => {
      if (
        userPanelRef.current &&
        !userPanelRef.current.contains(event.target)
      ) {
        setShowUser(false);
      }
    };

    // Add click event listener when the user panel is open
    if (showUser) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUser]);

  return (
    <div className="w-full bg-blue-950 fixed top-0 left-0 w z-[20]  ">
      <div className="sticky  main-navbar p-2 position-relative top-0 border-bottom shadow-amber-100 shadow-lg w-full">
        <div className="w-full max-w-7xl mx-auto rounded-4xl flex justify-between px-4 items-center ">
          <Link to={"/"} className="text-primary-950 text-decoration-none fs-2">
            {/* <img className="logo" src={logo} alt="logo" /> */}
            <h4 className="my-0 !text-white">What A Recruiter</h4>
          </Link>
          <ul className="mx-auto flex items-center gap-6 text-sm">
            <li>
              <NavLink
                to="/careers"
                className="text-neutral-300 hover:text-white transition"
              >
                Careers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/jobs"
                className="text-neutral-300 hover:text-white transition"
              >
                Jobs
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="text-neutral-300 hover:text-white transition"
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="text-neutral-300 hover:text-white transition"
              >
                Contact
              </NavLink>
            </li>
          </ul>
          {/* User Icon */}
          <div className="">
            <Sheet>
              <SheetTrigger asChild>
                <User className="cursor-pointer text-white  " />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>User profile</SheetTitle>
                  <div className="flex flex-col items-start">
                    {userInfo && (
                      <>
                        <div className="max-w-md mx-auto py-6 rounded-2xl ">
                          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Profile Information
                          </h2>
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-700">
                              <span className="font-medium w-32">Email:</span>
                              <span>{userInfo?.claims?.email || "N/A"}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <span className="font-medium w-32">Name:</span>
                              <span>{userInfo?.claims?.name || "N/A"}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <span className="font-medium w-32">
                                Phone Number:
                              </span>
                              <span>
                                {userInfo?.claims?.phone_number || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <NavLink
                            to={linksToDisplay.path}
                            className={buttonVariants}
                            onClick={toggleUser} // Close dropdown when clicked
                          >
                            {linksToDisplay.name}
                          </NavLink>
                          <NavLink
                            to="/profile"
                            className={buttonVariants}
                            onClick={toggleUser} // Close dropdown when clicked
                          >
                            View Profile
                          </NavLink>
                          <NavLink
                            to="/settings"
                            className={buttonVariants}
                            onClick={toggleUser} // Close dropdown when clicked
                          >
                            Settings
                          </NavLink>
                        </div>
                        <Button
                          onClick={handleLogout} // Close dropdown when clicked
                          className={"w-full"}
                        >
                          Logout
                        </Button>
                      </>
                    )}
                    {!userInfo && (
                      <>
                        <div className="text-black p-2 fs-6 text-center w-100 fs-4">
                          Hello! You are New Here
                        </div>
                        {/* <Button> */}
                        <div className="flex items-center flex-col w-full gap-3">
                          <Button asChild>
                            <Link to={"/login"} className="w-full">
                              Login
                            </Link>
                          </Button>

                          {/* <Button asChild>
                            <Link to={"/signup"} >
                              Sign Up
                            </Link>
                          </Button> */}
                        </div>
                        {/* </Button> */}
                      </>
                    )}
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
