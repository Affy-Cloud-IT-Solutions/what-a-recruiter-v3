import { useState } from "react";
import { MoveLeft, UsersRound } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TopBar from "../dashboard-header";
import { Button } from "@/components/ui/button";
import { ReusableInput } from "@/components/ui/reusable-input";
import toast from "react-hot-toast";
import { token } from "../../../lib/utils";

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
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
    try {
      const response = await axios.post(
        "/employee/create/" + userData.claims.id,
        formData
      );

      if (!response.data.error) {
        // showToast("success", response.data.message);
        toast.success(
          `${response.data.message || "Employee Created successfully"}`
        );
        navigate(-1);
      } else if (response.data.error) {
        toast.error(`${response.data.response || "Something went wrong"}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.response?.data?.message || "An error occurred"}`);
    }
  };

  return (
    <div className=" flex justify-between flex-col" style={{ zIndex: 100 }}>
      <form onSubmit={handleSubmit}>
        <TopBar title={"Create Employee"} icon={UsersRound} back={true} />

        <div className="flex flex-1 px-5 flex-col">
          <div>
            <div className="mt-3">
              <div>
                <div>
                  <label className="mx-2 my-1 fs-5 fw-semibold">Name</label>
                  <ReusableInput
                    label="Designation"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />

                  <label className="mx-2 my-1 fs-5 fw-semibold">
                    Phone Number
                  </label>
                  <ReusableInput
                    label="Location"
                    name="phoneNumber"
                    placeholder="Enter your Phone Number"
                    onChange={handleChange}
                    value={formData.phoneNumber}
                    maxLength="10"
                    required
                  />
                  <label className="mx-2 my-1 fs-5 fw-semibold">
                    Email Address
                  </label>
                  <ReusableInput
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                  <label className="mx-2 my-1 fs-5 fw-semibold">Username</label>
                  <ReusableInput
                    label="Username"
                    type="text"
                    name="username"
                    placeholder="Enter your Username"
                    onChange={handleChange}
                    value={formData.username}
                    required
                  />
                  <label className="mx-2 my-1 fs-5 fw-semibold">Password</label>
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
        <div className="  flex items-center justify-end gap-5 m-5">
          <Button type="submit" className="fw-semibold">
            Create Employee
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
