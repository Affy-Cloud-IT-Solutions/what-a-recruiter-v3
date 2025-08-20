import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, BaggageClaimIcon } from "lucide-react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TopBar from "@/components/dashboard/dashboard-header";
import { formatDateTime } from "@/lib/formatDate";
import { useProfileData } from "@/hooks/use-fetch-profile";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { role } from "../lib/utils";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function JobProfile() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobDetail, setJobDetail] = useState("");
  const [jobApplicant, setJobApplicant] = useState([]);
  const [time, setTime] = useState("-");
  const [status, setStatus] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [generatedLink, setGeneratedLink] = useState("");
  const { profileData } = useProfileData();
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
      if (!response.data.error) {
        const timeParse = formatDateTime(response.data.meta.createdAt);

        setTime(timeParse);
        setJobDetail(response.data.meta);
        setStatus(response.data.meta.jobApproval);
      } else if (response.data.error) {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  const fetchJobApplicant = async () => {
    try {
      const response = await axios.get(
        `/job-applications/by-jobId/${id}/page?page=${currentPage}&size=${pageSize}`
      );

      if (!response.data.error) {
        setJobApplicant(response.data.meta.applications);
        setTotalItems(response.data.meta.totalItems);
        setCurrentPage(response.data.meta.currentPage);
        setTotalPages(response.data.meta.totalPages);
      } else if (response.data.error) {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Add a new `useEffect` to handle page or pageSize changes
  useEffect(() => {
    fetchJobApplicant();
    fetchJobData();
  }, [currentPage, pageSize]);

  const changeJobStatus = async (newStatus) => {
    try {
      const response = await axios.patch(
        `/recruiter/${id}/approval?jobApproval=${newStatus}`
      );

      if (!response.data.error) {
        toast.success(`Job ${newStatus}`);

        setStatus(newStatus);
      } else if (response.data.error) {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Profile Header */}
      <TopBar icon={BaggageClaimIcon} title="Job-profile" back={true} />
      {/* Job Detail Card */}
      <div className="mt-6 rounded-2xl border bg-gradient-to-br  p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {jobDetail?.jobTitle}
                <span className="text-gray-500 font-normal">
                  {" "}
                  #{jobDetail?.jobCode}
                </span>
              </h2>
              <p className="text-sm text-gray-700 mt-1">
                Hiring Manager:{" "}
                <span className="font-medium">
                  {jobDetail?.createdBy?.name}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Recruiter:{" "}
                <span className="font-medium">
                  {jobDetail?.recruiterAssigned?.name}
                </span>
              </p>
              <p className="text-sm text-gray-700">{jobDetail?.jobLocation}</p>
              <p className="text-sm text-gray-500">
                Current Status: {status || "-"}
              </p>
              <p className="text-sm text-gray-400">{time}</p>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="w-full sm:w-48 flex flex-col gap-2">
            <Button
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                status === "PENDING"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : status === "PUBLISHED"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "border border-gray-500 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                console.log("publish");
                if (status === "PENDING") changeJobStatus("APPROVED");
                else if (status === "PUBLISHED") changeJobStatus("UNPUBLISHED");
                else changeJobStatus("PUBLISHED");
              }}
            >
              {status === "PENDING"
                ? "Approve"
                : status === "PUBLISHED"
                ? "Unpublish"
                : "Publish"}
            </Button>

            {status === "PUBLISHED" && (
              <button
                className="py-2 px-4 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 transition-colors"
                onClick={() => window.open(generatedLink, "_blank")}
              >
                See Job
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Applicant List Table */}
      {jobApplicant?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Job Applicants ({jobApplicant.length})
          </h3>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">Candidate Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Experience</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Resume</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {jobApplicant.map((applicant) => (
                  <tr key={applicant.id}>
                    <td className="py-3 px-4">{applicant.candidateName}</td>
                    <td className="py-3 px-4">{applicant.email}</td>
                    <td className="py-3 px-4">{applicant.phone}</td>
                    <td className="py-3 px-4">
                      {applicant.experience || "N/A"}
                    </td>
                    <td className="py-3 px-4">{applicant.location || "N/A"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          applicant.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : applicant.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
