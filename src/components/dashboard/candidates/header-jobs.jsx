import { useProfileData } from "@/hooks/use-fetch-profile";
import { formatDateTime } from "@/lib/formatDate";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  User,
  BadgeCheck,
  MapPin,
  Signal,
  Clock,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../../ui/button";
import { AnimatePresence, motion } from "motion/react";

const HeadersJob = ({ id, onJobDetailFetched, onJobHiringProcessFetched }) => {
  const [jobDetail, setJobDetail] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const { profileData } = useProfileData();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "COMPANY") {
      setGeneratedLink(`/careers/${profileData?.id}`);
    } else {
      setGeneratedLink(`/careers/${profileData?.parent?.id}`);
    }
  }, [profileData]);

  const fetchJobData = async () => {
    try {
      const response = await axios.get(`/job/${id}`);
      console.log(response);
      if (!response.data.error) {
        const timeParse = formatDateTime(response.data.meta.createdAt);
        setTime(timeParse);
        setJobDetail(response.data.meta);
        if (onJobDetailFetched) {
          onJobDetailFetched(response.data.meta.customFields);
          onJobHiringProcessFetched(response.data.meta.hiringProcess);
        }
        setStatus(response.data.meta.jobApproval);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, []);

  const changeJobStatus = async (newStatus) => {
    try {
      const response = await axios.patch(
        `/recruiter/${id}/approval?jobApproval=${newStatus}`
      );
      console.log(response);
      if (!response.data.error) {
        toast.success(`Job ${newStatus}`);
        setStatus(newStatus);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-start md:items-center mb-6 bg-blue-900  p-6 sm:flex-row flex-col rounded-2xl shadow-md border border-gray-200 w-full transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-6">
        {/* Left Section */}
        <div className="flex-1">
          {/* Expand/Collapse Toggle */}
          <div className="flex items-start gap-3 mb-5 justify-between">
            <div className="flex gap-1 flex-col">
              <h4 className="text-3xl font-bold !text-gray-100 uppercase">
                {jobDetail?.jobTitle}
                <span className="text-sm text-gray-200 ml-2 font-normal">
                  #{jobDetail?.jobCode}
                </span>
              </h4>
              <h5
                className=" text-gray-100 text-sm font-light"
                dangerouslySetInnerHTML={{
                  __html: jobDetail?.jobDescription,
                }}
              />
            </div>

            <Button
              variant={"outline"}
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-950 hover:text-blue-800 flex items-center gap-1"
            >
              {isExpanded ? "Collapse" : "Expand"}
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
          {/* Content inside toggle */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="space-y-3 text-gray-100 text-sm">
                  <p className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-100" />
                    <span className="font-medium text-gray-200">
                      Hiring Manager:
                    </span>
                    &nbsp;
                    {jobDetail?.createdBy?.name || "-"}
                  </p>
                  <p className="flex items-center">
                    <BadgeCheck className="w-4 h-4 mr-2 text-gray-100" />
                    <span className="font-medium text-gray-100">
                      Recruiter:
                    </span>
                    &nbsp;
                    {jobDetail?.recruiterAssigned?.name || "-"}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-100" />
                    <span className="font-medium text-gray-100">Location:</span>
                    &nbsp;
                    {jobDetail?.jobLocation || "-"}
                  </p>
                  <p className="flex items-center">
                    <Signal className="w-4 h-4 mr-2 text-gray-100" />
                    <span className="font-medium text-gray-100">
                      Current Status:
                    </span>
                    &nbsp;
                    {status || "-"}
                  </p>
                  <p className="flex items-center text-gray-100 text-xs">
                    <Clock className="w-4 h-4 mr-2" />
                    {time}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col gap-3 w-full md:w-52">
          <Button
            variant={
              status === "PUBLISHED"
                ? "destructive"
                : status === "APPROVED" || status === "UNPUBLISHED"
                ? "outline"
                : "outline"
            }
            className="w-full rounded-lg border border-blue-900"
            onClick={() => {
              if (role.includes("RECRUITER") || role.includes("ADMIN")) {
                if (!status) toast.error("Hiring Process isn't exist");
                if (status === "PENDING") {
                  changeJobStatus("APPROVED");
                } else if (status === "PUBLISHED") {
                  changeJobStatus("UNPUBLISHED");
                } else if (status === "APPROVED" || status === "UNPUBLISHED") {
                  changeJobStatus("PUBLISHED");
                }
              } else {
                return toast.error(
                  "Only Recruiter or admin have that authority"
                );
              }
            }}
          >
            {status === "PENDING"
              ? "Approve"
              : status === "PUBLISHED"
              ? "Unpublish"
              : "Publish"}
          </Button>

          {status === "PUBLISHED" && (
            <Button
              className="w-full btn-sm rounded-lg border"
              variant="outline"
              onClick={() => window.open(generatedLink, "_blank")}
            >
              View Job Posting
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeadersJob;
