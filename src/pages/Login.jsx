import { useEffect, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/shared/Logo";
import toast from "react-hot-toast";

const Login = () => {
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toggleShow = () => {
    setShow((prev) => !show);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigateByRole = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        navigate("/superadmin");
        break;
      case "ADMIN":
        navigate("/admin");
        break;
      case "RECRUITMENT_MANAGER":
        navigate("/recruitment_manager");
        break;
      case "USER":
        navigate("/user");
        break;
      case "EMPLOYEE":
        navigate("/employee");
        break;
      default:
        navigate("/");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/login", data);
      if (response.data.error) {
        toast.success(
          response?.data?.response || "Something went wrong"
          // description: response?.data?.response,
          //
        );
      } else if (!response?.data?.error) {
        const token = response.data.response;
        const decoded = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", decoded?.claims?.role);
        const role = localStorage.getItem("role");
        navigateByRole(role);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response || "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      navigateByRole(role);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-hidden bg-blue-950  flex items-center  justify-center flex-col relative text-primary-50 bg-primary-950 bg-no-repeat bg-center bg-contain">
      <img src={"bg-auth.png"} className="absolute inset-0 z-0 object-cover" />
      <Logo />
      <div className="z-[100] -mt-8">
        <div>
          <div className=" z-[100] md:text-4xl text-2xl text-white mx-auto text-center mb-4">
            What a recruiter
          </div>
          <div>
            <Card className=" md:w-[350px] rounded-none bg-slate-100 relative">
              <CardHeader>
                <CardTitle className={"text-2xl"}>Login</CardTitle>
                <CardDescription>
                  Welcome to what a recruiter <brr />
                  Enter your credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmit)} // React Hook Form's handleSubmit
                >
                  {/* Email Field */}
                  <div className="mb-3">
                    <div className="py-2 mt-3">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...register("email", {
                          required: "Email is required",
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-danger">{errors.email.message}</p>
                    )}
                  </div>
                  {/* Password Field */}
                  <div className="mb-3">
                    <Label>password</Label>
                    <div className=" flex align-items-center ">
                      <Input
                        type={show ? "password" : "text"}
                        placeholder="Password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <div
                        className="flex items-center text-blue-950 justify-center transition duration-150  cursor-pointer px-2 "
                        onClick={toggleShow}
                      >
                        {show ? <Eye /> : <EyeClosed />}
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-danger">{errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    className="w-full rounded"
                    type="submit"
                    disabled={loading}
                  >
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
