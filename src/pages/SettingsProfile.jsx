import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Fixed import
import { useProfileData } from "@/hooks/use-fetch-profile";
import TopBar from "@/components/dashboard/dashboard-header";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";

// Define roles and fields
const roles = [
  "SUPER_ADMIN",
  "COMPANY",
  "ADMIN",
  "RECRUITER",
  "USER",
  "EMPLOYEE",
];
const fieldsByRole = {
  SUPER_ADMIN: ["My Account", "Configuration", "Permissions"],
  COMPANY: ["My Account", "Configuration", "Permissions"],
  ADMIN: ["My Account", "Configuration", "Permissions"],
  RECRUITER: ["My Account"],
  USER: ["My Account"],
  EMPLOYEE: ["My Account"],
};

const routesByRole = {
  SUPER_ADMIN: {
    myProfile: "my-profile",
    loginPassword: "login-password",
    emailPreferences: "#",
    jobFields: "#",
    screeningQuestions: "#",
    userManagement: "#",
    systemRoles: "#",
  },
  COMPANY: {
    myProfile: "my-profile",
    loginPassword: "login-password",
    emailPreferences: "#",
    jobFields: "job-fields",
    hiringProcess: "hiring-process",
    screeningQuestions: "#",
    userManagement: "user-management",
    systemRoles: "#",
    interviewTemplates: "interview-templates",
    offersTemplates: "offers-templates",
  },
  ADMIN: {
    myProfile: "my-profile",
    loginPassword: "login-password",
    emailPreferences: "#",
    jobFields: "job-fields",
    hiringProcess: "hiring-process",
    screeningQuestions: "#",
    userManagement: "user-management",
    systemRoles: "#",
    interviewTemplates: "interview-templates",
  },
  RECRUITER: {
    myProfile: "my-profile",
    loginPassword: "login-password",
    emailPreferences: "#",
  },
  USER: {
    myProfile: "my-profile",
    loginPassword: "login-password",
    emailPreferences: "#",
  },
  EMPLOYEE: {
    myProfile: "my-profile",
    loginPassword: "login-password",
    emailPreferences: "#",
  },
};

const SettingsProfile = () => {
  const { profileData, loading } = useProfileData();
  const [accessibleFields, setAccessibleFields] = useState([]);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let userData = token && jwtDecode(token);
    setRole(userData?.claims?.role);
    setEmail(userData?.claims?.email);
    if (userData && roles.includes(userData?.claims?.role)) {
      setAccessibleFields(fieldsByRole[userData?.claims?.role] || []);
    } else {
      toast.error("Unauthorized access!");
      navigate("/login");
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="me-md-3">
      <TopBar icon={Settings} title="Settings" />

      <div className="mx-6 my-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Profile Info */}
          <Card>
            <CardContent className="flex gap-4 items-start p-4">
              <img
                className="w-12 h-12 rounded-full"
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="User"
              />
              <div className="space-y-1">
                <div className="text-lg font-semibold text-gray-700">
                  <span className="text-gray-500">Username:</span>{" "}
                  {profileData?.name || "Placeholder"}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Role: {profileData?.role || "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  Email: {email || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Account */}
          {accessibleFields.includes("My Account") && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-bold text-base mb-2">My Account</h4>
                <div className="space-y-2 text-sm text-gray-600 underline cursor-pointer">
                  <div onClick={() => navigate(routesByRole[role]?.myProfile)}>
                    My Profile
                  </div>
                  <div
                    onClick={() => navigate(routesByRole[role]?.loginPassword)}
                  >
                    Login & Password
                  </div>
                  <div
                    onClick={() =>
                      navigate(routesByRole[role]?.emailPreferences)
                    }
                  >
                    Email Preferences
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configuration */}
          {accessibleFields.includes("Configuration") && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-bold text-base mb-2">Configuration</h4>
                <div className="space-y-2 text-sm text-gray-600 underline cursor-pointer">
                  <div onClick={() => navigate(routesByRole[role]?.jobFields)}>
                    Job Fields
                  </div>
                  <div
                    onClick={() => navigate(routesByRole[role]?.hiringProcess)}
                  >
                    Hiring Process
                  </div>
                  <div
                    onClick={() =>
                      navigate(routesByRole[role]?.screeningQuestions)
                    }
                  >
                    Screening Questions
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Permissions */}
          {accessibleFields.includes("Permissions") && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-bold text-base mb-2">Permissions</h4>
                <div className="space-y-2 text-sm text-gray-600 underline cursor-pointer">
                  <div
                    onClick={() => navigate(routesByRole[role]?.userManagement)}
                  >
                    User Management
                  </div>
                  <div
                    onClick={() => navigate(routesByRole[role]?.systemRoles)}
                  >
                    System Roles
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Templates */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold text-base mb-2">Templates</h4>
              <div className="space-y-2 text-sm text-gray-600 underline cursor-pointer">
                <div
                  onClick={() =>
                    navigate(routesByRole[role]?.interviewTemplates)
                  }
                >
                  Interview Templates
                </div>
                <div onClick={() => navigate("offers-template")}>
                  Offers Templates
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;
