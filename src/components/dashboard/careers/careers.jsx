import React, { useState, useEffect } from "react";
import { MapPin, CalendarFold, Loader, X } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { aiBaseUrl } from "@/App";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(false);
  const { parentId } = useParams();
  const [formData, setFormData] = useState({ resume: null });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    axios
      .get(`/job/published/byParent/${parentId}`)
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    setFormData({ ...formData, resume: file });
    setIsUploading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("pdf_doc", file);
    try {
      const response = await axios.post(
        aiBaseUrl + "process-resume",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const cvData = response.data.data;
      console.log("CV Data:", cvData);
      reset({
        firstName: cvData.Full_Name?.split(" ")[0] || "",
        lastName: cvData.Full_Name?.split(" ").slice(1).join(" ") || "",
        email: cvData.Email || "",
        phone: cvData.Phone || "",
        address: cvData.Address || "",
        professionalSummary: cvData.Professional_Summary || "",
        profileTitle: cvData.Profile_Title || "",
        skills: cvData.Skills?.join(", ") || "",
        education: JSON.stringify(cvData.Education.flat() || []),
      });
    } catch (error) {
      console.error("Error uploading CV:", error);
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const values = getValues();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", data.firstName);
    formDataToSend.append("lastName", data.lastName);
    formDataToSend.append("email", data.email);
    formDataToSend.append("phone", data.phone);
    formDataToSend.append("resume", formData.resume);
    formDataToSend.append("jobId", selectedJob?.id);
    formDataToSend.append("profileTitle", data.profileTitle || "");
    formDataToSend.append("address", data.address || "");
    formDataToSend.append("companyId", data || "");
    formDataToSend.append(
      "professionalSummary",
      data.professionalSummary || ""
    );

    // Handle skills (comma separated string)
    const skillsArray = data?.skills?.split(",").map((s) => s.trim()) || [];
    skillsArray.forEach((skill) => formDataToSend.append("skills", skill));

    // Handle education (JSON string input)
    try {
      const educationArray = JSON.parse(data.education);
      educationArray.forEach((edu) =>
        formDataToSend.append("education", edu.join(","))
      );
    } catch (e) {
      console.warn("Invalid education format");
    }
    console.log(formData);
    try {
      const response = await axios.post(
        "/job-applications/apply",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Application submitted successfully!");
      setFormData({});
      setShowSuccess(true);
      navigate(-1);
      handleApplyClick();
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyClick = (job) => {
    if (job) setSelectedJob(job);
    if (!isSelected) setIsSelected(true);
    if (isSelected) setIsSelected(false);
  };

  return (
    <>
      <Navbar />
      <Dialog open={isSelected}>
        <DialogContent
          className="!max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto p-6 rounded-lg"
          xOn={false}
        >
          <DialogHeader>
            <X onClick={handleApplyClick} className="ms-auto" />
            <div className="container min-[80vh] overflow-auto p-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedJob?.jobTitle}
              </h3>
              <div className="text-gray-700 flex justify-between mb-4">
                <p>
                  <strong>Posted On:</strong>{" "}
                  {new Date(selectedJob?.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Location:</strong> {selectedJob?.jobLocation}
                </p>
              </div>
              {loading ? (
                <div className="h-full py-20  flex items-center justify-between w-full">
                  <Loader className="animate-spin mx-auto" />
                </div>
              ) : (
                <form
                  className="card p-4 bg-white shadow"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="mb-3">
                    <Label>Resume/CV</Label>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      // required
                      disabled={isUploading || isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        {...register("firstName", { required: true })}
                        disabled={isUploading || isSubmitting}
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        {...register("lastName")}
                        disabled={isUploading || isSubmitting}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        {...register("email", { required: true })}
                        disabled={isUploading || isSubmitting}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        {...register("phone", { required: true })}
                        maxLength={10}
                        disabled={isUploading || isSubmitting}
                      />
                    </div>
                    <div>
                      <Label>Profile Title</Label>
                      <Input
                        {...register("profileTitle")}
                        disabled={isUploading || isSubmitting}
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input
                        {...register("address")}
                        disabled={isUploading || isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="mb-3 mt-4">
                    <Label>Professional Summary</Label>
                    <textarea
                      className="form-control w-full border px-3 py-2 rounded"
                      rows={3}
                      {...register("professionalSummary")}
                      disabled={isUploading || isSubmitting}
                    />
                  </div>

                  <div className="mb-3">
                    <Label>Skills (comma separated)</Label>
                    <Input
                      {...register("skills")}
                      disabled={isUploading || isSubmitting}
                    />
                  </div>

                  <div className="mb-3">
                    <Label>Education (JSON format)</Label>
                    <textarea
                      rows={3}
                      className="form-control w-full border px-3 py-2 rounded"
                      placeholder='e.g. ["PostGraduation,IITBombay,2014","Graduation,DAVV,2012"]'
                      {...register("education")}
                      disabled={isUploading || isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="mt-4 w-full"
                    disabled={isUploading || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
        <div className="max-w-7xl mx-auto mt-16">
          <div className="my-2 text-center mx-auto">
            <h4 className="text-3xl mb-4">Careers</h4>
            <div className="careers flex justify-center">
              <ul className="flex gap-4">
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    All
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Full Time
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Part Time
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Remote
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 mb-4 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {jobs.map((item, index) => (
              <div
                className="bg-white p-4 shadow-md rounded-lg border-[1px]"
                key={item.id || index}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="mb-0">{item?.jobTitle}</h4>
                    <p className="f-15 mb-0 flex items-center">
                      <MapPin size={15} />
                      <span>{item?.jobLocation}</span>
                    </p>
                  </div>
                  <div className="text-xs">
                    <p className="f-15 mb-0 flex items-center">
                      <CalendarFold size={15} />
                      <span className="ml-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <DialogTrigger className={""}>
                    <Button size="sm" onClick={() => handleApplyClick(item)}>
                      Apply
                    </Button>
                  </DialogTrigger>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
}
