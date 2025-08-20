import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/pages/Settings/MyProfile";

const TopBar = ({ title, value, onChange, back }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  return (
    <div className="flex justify-between zoom-out border-b items-center p-2.5 md:px-4 px-3 bg-white shadow-md">
      <h1 className="md:text-xl text-lg whitespace-nowrap font-semibold text-primary-950 my-auto flex items-center">
        {back == true && (
          <div className="me-4 hidden md:flex">
            <BackButton />
          </div>
        )}
        <div className="me-4 md:hidden">
          <BackButton />
        </div>{" "}
        <span className="text-gray-700">{title}</span>
      </h1>
      <div className="flex items-center gap-4 flex-grow mx-4 w-full justify-end">
        <div className="relative w-full max-w-md md:flex items-center gap-2 hidden ">
          <Input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Search"
          />
          <FaSearch className="cursor-pointer text-gray-500" />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <FaUserCircle className="text-gray-600 text-2xl scale-125" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem>Home</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <FaBell className="text-gray-600 text-xl" /> */}
    </div>
  );
};

export default TopBar;
