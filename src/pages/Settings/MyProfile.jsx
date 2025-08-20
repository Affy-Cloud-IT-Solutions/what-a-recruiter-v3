import React, { useState, useEffect } from "react";
import {
  User2,
  MoveLeft,
  Edit,
  File,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TopBar from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { ReusableInput } from "@/components/ui/reusable-input";
import { token } from "../../lib/utils";

const MyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileDetails, setProfileDetails] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = jwtDecode(token);
    const role = decodedToken?.claims?.role;
    const id = decodedToken?.claims?.id;

    const fetchProfileData = async () => {
      try {
        let endpoint;
        if (role === "COMPANY") {
          endpoint = `company/${id}`;
        } else if (role === "RECRUITER") {
          endpoint = `recruiter/${id}`;
        } else if (role === "EMPLOYEE") {
          endpoint = `employee/${id}`;
        } else if (role === "ADMIN") {
          endpoint = `admin/${id}`;
        } else {
          throw new Error("Invalid role");
        }

        const response = await axios.get(endpoint);
        setProfileDetails(response.data.meta);
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditName = async () => {
    const id = jwtDecode(token)?.claims?.id;

    try {
      setLoading(true);

      const response = await axios.put(
        `/employee/${id}`,
        { name: formData.name || profileDetails.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProfileDetails((prev) => ({ ...prev, name: response.data.name }));
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <TopBar title={"My Profile"} icon={User2} back={true} />
      <div className="d-flex justify-content-between flex-column">
        <div className="d-flex flex-grow-1 px-5 flex-column">
          <div>
            <div className="mt-3">
              <div>
                <div className="flex items-center gap-2 justify-between mb-2">
                  {!isEditingName ? (
                    <Edit onClick={() => setIsEditingName(true)} />
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleEditName}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  )}
                </div>
                <div>
                  <div>
                    <div>
                      <label className="mx-2 my-1 fs-5 fw-semibold">Name</label>
                    </div>
                    <div className="align-items-center gap-2">
                      <ReusableInput
                        label="name"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        value={
                          isEditingName
                            ? formData.name || profileDetails.name
                            : profileDetails.name
                        }
                        required
                        disabled={!isEditingName}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mx-2 my-1 fs-5 fw-semibold">Mobile</label>
                    <ReusableInput
                      label="mobile"
                      name="mobile"
                      placeholder="Mobile"
                      value={profileDetails.phoneNumber || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="mx-2 my-1 fs-5 fw-semibold">Email</label>
                    <ReusableInput
                      label="email"
                      name="email"
                      placeholder="Email"
                      value={profileDetails.email || ""}
                      disabled
                    />
                  </div>
                  {profileDetails?.role === "COMPANY" ? (
                    <div>
                      <label className="mx-2 my-1 fs-5 fw-semibold">
                        Company Name
                      </label>
                      <ReusableInput
                        label="position"
                        name="position"
                        placeholder="Position"
                        value={profileDetails.companyName || ""}
                        disabled
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  <div>
                    <label className="mx-2 my-1 fs-5 fw-semibold">
                      Position
                    </label>
                    <ReusableInput
                      label="position"
                      name="position"
                      placeholder="Position"
                      value={
                        profileDetails.role === "RECRUITER"
                          ? "RECRUITMENT MANAGER"
                          : profileDetails.role
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;

export const BackButton = ({ hidden = false }) => {
  const navigate = useNavigate();
  return (
    <Button
      size="icon"
      variant="ghost"
      className={`border w-8 h-8 ${hidden && "hidden md:flex"}`}
      onClick={() => navigate(-1)}
      type="button"
    >
      <ChevronLeft style={{ width: 22, height: 22 }} className="mr-[1px]" />
    </Button>
  );
};
