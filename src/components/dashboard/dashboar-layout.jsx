import {
  BaggageClaim,
  Factory,
  Grid2x2Check,
  Grid2x2CheckIcon,
  LogOut,
  User2,
  BriefcaseBusiness,
  Settings,
  FileUser,
  LogOutIcon,
  Users,
  UserIcon,
  UsersIcon,
  LucideUserCog,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
const DashboardLayout = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  const navLinks = {
    SUPER_ADMIN: [
      {
        path: "/superadmin",
        name: "Dashboard",
        icon: (
          <Grid2x2Check
            className={` icon-size cursor-pointer ${
              location.pathname === "/superadmin" ? "text-yellow" : "text-white"
            } `}
          />
        ),
      },
      {
        path: "/superadmin/users",
        name: "School",
        icon: (
          <User2
            className={` icon-size cursor-pointer ${
              location.pathname === "/superadmin/users"
                ? "text-yellow"
                : "text-white"
            } `}
          />
        ),
      },
      {
        path: "/superadmin/jobs",
        name: "School",
        icon: (
          <BaggageClaim
            className={` icon-size cursor-pointer ${
              location.pathname === "/superadmin/jobs"
                ? "text-yellow"
                : "text-white"
            } `}
          />
        ),
      },
      {
        path: "/superadmin/company",
        name: "School",
        icon: (
          <Factory
            className={` icon-size cursor-pointer ${
              location.pathname === "/superadmin/company"
                ? "text-yellow"
                : "text-white"
            } `}
          />
        ),
      },
    ],
    COMPANY: [
      {
        path: "/company",
        name: "Dashboard",
        icon: <Grid2x2CheckIcon className="icon-size" />,
      },
      // {
      //   path: "/company/sub-company",
      //   name: "Sub-company",
      //   icon: <UserIcon className="icon-size" />,
      // },
      
      {
        path: "/company/candidates",
        name: "Candidates",
        icon: <FileUser className="icon-size" />,
      },
      {
        path: "/company/jobs",
        name: "Jobs",
        icon: <BriefcaseBusiness className="icon-size" />,
      },

      // {
      //   path: "/company/employee",
      //   name: "employee",
      //   icon: <LucideUserCog className="icon-size" />,
      // },
      {
        path: "/company/settings",
        name: "Settings",
        icon: <Settings className="icon-size" />,
      },
    ],
    ADMIN: [
      {
        path: "/admin",
        name: "Dashboard",
        icon: <Grid2x2CheckIcon className="icon-size" />,
      },
      {
        path: "/admin/candidates",
        name: "Candidates",
        icon: <FileUser className="icon-size" />,
      },
      // {
      //   path: "/admin/sub-admin",
      //   name: "Sub-admin",
      //   icon: <UserIcon className="icon-size" />,
      // },    

      {
        path: "/admin/jobs",
        name: "Jobs",
        icon: <BriefcaseBusiness className="icon-size" />,
      },
      {
        path: "/admin/settings",
        name: "Settings",
        icon: <Settings className="icon-size" />,
      },
      // {
      //   path: "/admin/employee",
      //   name: "employee",
      //   icon: <Settings className="icon-size" />,
      // },
    ],
    RECRUITER: [
      {
        path: "/recruiter",
        name: "Dashboard",
        icon: <Grid2x2CheckIcon className="icon-size" />,
      },
      {
        path: "/recruiter/jobs",
        name: "Jobs",
        icon: <BriefcaseBusiness className="icon-size" />,
      },
      // {
      //   path: "/recruiter/employee",
      //   name: "Employee",
      //   icon: <Users className="icon-size" />,
      // },
      {
        path: "/recruiter/settings",
        name: "Settings",
        icon: <Settings className="icon-size" />,
      },
    ],
    // RECRUITMENT_MANAGER: [
    //   {
    //     path: "/recruiter",
    //     name: "Dashboard",
    //     icon: <Grid2x2CheckIcon className="icon-size" />,
    //   },
    //   {
    //     path: "/recruiter/jobs",
    //     name: "Jobs",
    //     icon: <BriefcaseBusiness className="icon-size" />,
    //   },
    //   {
    //     path: "/recruiter/employee",
    //     name: "Employee",
    //     icon: <Users className="icon-size" />,
    //   },
    //   {
    //     path: "/recruiter/settings",
    //     name: "Settings",
    //     icon: <Settings className="icon-size" />,
    //   },
    // ],
    EMPLOYEE: [
      {
        path: "/employee",
        name: "Dashboard",
        icon: <Grid2x2CheckIcon className="icon-size" />,
      },
      {
        path: "/employee/jobs",
        name: "Jobs",
        icon: <BriefcaseBusiness className="icon-size" />,
      },
      {
        path: "/employee/candidates",
        name: "Candidates",
        icon: <Users className="icon-size" />,
      },
    ],
  };

  const linksToDisplay = role ? navLinks[role] : navLinks[0];

  return (
    <div className="h-screen flex w-full fixed  ">
      <div className="bg-blue-950 items-center flex-col relative p-3 none w-20 md:block h-full hidden rounded-r">
        <div
          className="logo mb-2 text-center w-full flex items-center  justify-center  text-white font-semibold fs-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          W.A.R
        </div>
        <ul className="nav flex-col mb-auto w-full mx-auto  ">
          {linksToDisplay.map((link, index) => {
            const isActive =
              location.pathname === link.path ||
              (location.pathname.startsWith(`${link.path}/`) &&
                link.path !== navLinks[role]?.[0]?.path);

            return (
                <li
        key={index}
        className="nav-item my-6  flex items-center justify-center"
      >
        <Link
          to={link.path}
          className={`fs-6 d-flex align-items-center justify-content-start  text-decoration-none ${
            isActive ? "text-yellow-600" : "text-white"
          }`}
        >
            <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild >
                <span
                  className={`${
                    isActive ? "text-yellow-400" : "text-cyan-400"
                  }`}
                >
                  {link.icon}
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-sm">
                {link.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </Link>
          </li>
            );
          })}
        </ul>
        <div
          className=" left-6 flex items-center justify-center  z-[100]"
          style={{ position: "absolute", bottom: 40 }}
        >
          <button
            className={
              "text-yellow btn text-center w-full text-white cursor-pointer"
            }
            onClick={handleLogout}
          >
            <LogOut />
          </button>
        </div>
      </div>

      <div className="w-full dashboard-pages">
        <div className="px-4 md:hidden  p-2 bg-blue-950 items-center justify-between flex">
          <div className="text-2xl text-blue-50 font-bold">WAR</div>
          <div className="flex gap-4 items-center justify-between">
            <div className="">
              <ul className="nav flex gap-4 mb-auto w-full ">
                {linksToDisplay.map((link, index) => (
                  <li
                    key={index}
                    className="nav-item flex align-items-center justify-content-center "
                  >
                    <Link
                      to={link.path}
                      className={`fs-6 d-flex align-items-center justify-content-start  text-decoration-none ${
                        location.pathname === link.path
                          ? "text-blue-950"
                          : "text-blue-300"
                      }`}
                    >
                      <span
                        className={`${
                          location.pathname === link.path
                            ? "text-yellow-500"
                            : "text-lime-500"
                        }`}
                      >
                        {link.icon}
                      </span>
                    </Link>
                  </li>
                ))}
                {/* LOGOUT */}
              </ul>
            </div>
            <Button
              size={"icon"}
              onClick={handleLogout}
              className={"border bg-blue-950 "}
            >
              <LogOutIcon />
            </Button>
          </div>
        </div>
        <div className="h-screen overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
