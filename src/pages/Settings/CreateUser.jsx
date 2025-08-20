import { useState } from "react";
import { MartiniIcon, MoveLeft, UsersRound } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TopBar from "@/components/dashboard/dashboard-header";
import { ReusableInput } from "@/components/ui/reusable-input";
import { BackButton } from "./MyProfile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { token } from "../../lib/utils";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    role: "EMPLOYEE",
  });
  const userData = token && jwtDecode(token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // return;
    try {
      const response = await axios.post(
        "user/create/" + userData.claims.id,
        formData,
        {
          headers: {
            contentType: "application/json",
          },
        }
      );

      if (!response.data.error) {
        toast.success(
          response?.data?.message || "This user is successfully created"
        );
        navigate(-1);
      } else if (response.data.error) {
        toast.error(response?.data?.response || "An error occurred");
      }
    } catch (error) {
      toast.error(error.response?.data?.response || "An error occurred");
    }
  };

  return (
    <div className=" d-flex justify-content-between flex-column">
      <form onSubmit={handleSubmit}>
        <TopBar title={"Create User"} icon={UsersRound} back={true} />
        <div
          className=" d-flex flex-grow-1 md:px-5 px-3 flex-column"
          style={{ height: "100%" }}
        >
          <div>
            <div className="mt-3">
              <div>
                <div>
                  <Label className={"my-2 mx-2"}>Name</Label>
                  <ReusableInput
                    label="Designation"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />

                  <Label className={"my-2 mx-2"}>Phone Number</Label>
                  <ReusableInput
                    label="Location"
                    name="phoneNumber"
                    placeholder="Enter your Phone Number"
                    onChange={handleChange}
                    value={formData.phoneNumber}
                    maxLength="10"
                    required
                  />
                  <Label className={"my-2 mx-2"}>Email Address</Label>
                  <ReusableInput
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                  <Label className={"my-2 mx-2"}>Username</Label>
                  <ReusableInput
                    label="Username"
                    type="text"
                    name="username"
                    placeholder="Enter your Username"
                    onChange={handleChange}
                    value={formData.username}
                    required
                  />
                  <Label className={"my-2 mx-2"}>User Role</Label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option selected value="EMPLOYEE">
                      Employee
                    </option>
                    <option selected value="HIRING_MANAGER">
                      Hiring Manager
                    </option>
                    <option value="RECRUITER">Recruiter</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <Label className={"my-2 mx-2"}>Password</Label>
                  <ReusableInput
                    label="Password"
                    type="text"
                    name="password"
                    placeholder="Enter your Password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button className={"m-5"} type="submit">
          Create Employee
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;
