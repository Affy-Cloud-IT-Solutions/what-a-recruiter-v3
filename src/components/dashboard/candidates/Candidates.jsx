import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { Eye, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { timeAgo } from "@/lib/formatDate";
import { jwtDecode } from "jwt-decode";

import { useProfileData } from "@/hooks/use-fetch-profile";

import ApplicantDrawer from "./ApplicantDrawer";
import toast from "react-hot-toast";
import TopBar from "../dashboard-header";
import useSWR from "swr";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ApplicantList = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [jobApplicant, setJobApplicant] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("status");
  const [pageSize, setPageSize] = useState(25);
  const [progressCount, setProgressCount] = useState(0);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [status, setStatus] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const { id } = useParams();
  const { profileData } = useProfileData();
  const [loader, setLoader] = useState(false);
  const stageLabels = {
    NEW: "New",
    IN_REVIEW: "In-Review",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    HIRED: "Hired",
  };

  const userInfo = token && jwtDecode(token);
  const updateApplicationStatus = async (newStatus, stageName, hiringStep) => {
    setLoader(true);
    try {
      const response = await axios.put(
        "job-applications/update-field-mapping",
        {
          applicationId: selectedApplicant.id,
          fieldId: newStatus,
          updatedBy: userInfo.claims.id,
          currentStage: hiringStep,
        }
      );

      if (!response.data.error) {
        setLoader(false);
        toast.success(`Application moved to ${stageName}`);
        fetchSingleJobApplicant(selectedApplicant.id);
      } else if (response.data.error) {
        toast.error(response.data.message);
        setLoader(false);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    } finally {
      setLoader(false);
    }
  };

  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest"); // "latest" or "oldest"

  // const updateApplicationStatus = async (newStatus) => {
  //   try {
  //     const response = await axios.put("/job-applications/status", {
  //       applicationId: applicantData?.id,
  //       status: newStatus,
  //       updatedBy: userInfo.claims.id,
  //     });

  //     if (!response.data.error) {
  //       setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
  //       setStatus(newStatus);
  //       fetchSingleJobApplicant(applicantData?.id);
  //     } else if (response.data.error) {
  //       toast("error", { description: response.data.message });
  //     }
  //   } catch (error) {
  //     console.error("Error updating application status:", error);
  //   }
  // };

  const handleProgress = (status) => {
    const statusProgress = {
      NEW: 10,
      IN_REVIEW: 25,
      INTERVIEW: 50,
      OFFERED: 75,
      HIRED: 100,
    };
    setProgressCount(statusProgress[status] || 10);
  };

  const onMoveForward = async () => {
    try {
      const payloadStatus =
        status == "PENDING"
          ? "IN_REVIEW"
          : status == "IN_REVIEW"
            ? "INTERVIEW"
            : status == "INTERVIEW"
              ? "OFFERED"
              : status == "OFFERED"
                ? "HIRED"
                : status == ""
                  ? "PENDING"
                  : "";

      const response = await axios.put("/job-applications/status", {
        applicationId: applicantData?.id,
        status: payloadStatus,
        updatedBy: userInfo?.claims?.id,
      });

      if (!response.data.error) {
        handleProgress(response?.data?.status);
        // setStatus(response?.data?.status);
        fetchJobApplicant();
      } else if (response.data.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error moving forward", error);
    }
  };

  const fetchJobApplicant = async (page = 1, url) => {
    try {
      let id;
      if (role === "ADMIN" || role === "COMPANY") {
        id = `${userInfo.claims?.id}`;
      } else {
        id = `${userInfo?.claims?.parent?.id}`;
      }
      const response = await axios.get(
        // `/job-applications/by-jobId/${id}/page?page=${page}&size=${pageSize}`
        `/job-applications/by-parent-id/${id}`
      );

      // return
      if (!response.data.error) {
        setJobApplicant(response?.data.meta);
        // setTotalItems(response?.data.meta);
        // setCurrentPage(response?.data.meta);
        // setTotalPages(response?.data.meta);
      } else if (response?.data.error) {
        toast.error(`${response?.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
    } finally {
      setLoadings(false);
    }
  };
  useSWR();
  const [applicantData, setApplicantData] = useState(null);
  const fetchSingleJobApplicant = async (applicantId) => {
    try {
      const response = await axios.get(
        // `/job-applications/by-jobId/${id}/page?page=${page}&size=${pageSize}`
        `/job-applications/${applicantId}`
      );

      // return
      if (!response.data.error) {
        setApplicantData(response?.data.meta);
        setStatus(response?.data.meta?.status);
        handleProgress(response?.data.meta?.status);
      } else if (response?.data.error) {
        toast.error("warn", `${response?.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    fetchJobApplicant(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedApplicant) {
      setStatus(applicantData?.status);
      handleProgress(applicantData?.status);
    }
  }, [selectedApplicant]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (role === "ADMIN") {
      setGeneratedLink(`/careers/${profileData?.id}`);
    } else {
      setGeneratedLink(`/careers/${profileData?.parent?.id}`);
    }
  }, [profileData]);

  const dummyMeetings = [
    {
      interviewer: "John Doe",
      round: "First Round",
      hiringManager: "Sarah Lee",
      recruiter: "Alice Green",
      date: "2025-04-25",
      time: "10:00 AM",
      position: "Software Engineer",
      link: "https://zoom.us/j/123456789",
    },
    {
      interviewer: "Jane Smith",
      round: "Second Round",
      hiringManager: "Michael Brown",
      recruiter: "David Gray",
      date: "2025-04-26",
      time: "2:00 PM",
      position: "Product Manager",
      link: "https://zoom.us/j/987654321",
    },
  ];

  return (
    <>
      <TopBar title={"Candidate"} />
      <div className="relative min-h-screen w-full p-4 md:p-4 zoom-out">
        <div
          className={`transition-all duration-300  ${selectedApplicant ? "w-full" : "w-full"
            }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">
              {jobApplicant && jobApplicant.length} Applicants
            </h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Select onValueChange={(value) => setStatusFilter(value)} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                  <SelectItem value="OFFERED">Offered</SelectItem>
                  <SelectItem value="HIRED">Hired</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setSortOrder(value)} defaultValue="latest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest to Oldest</SelectItem>
                  <SelectItem value="oldest">Oldest to Latest</SelectItem>
                </SelectContent>
              </Select>

            </div>

          </div>
          <div className="overflow-x-auto">
            <Table className="w-full border rounded-lg">
              <TableHeader className="bg-gray-100 text-gray-800 font-semibold">
                <TableRow>
                  {/* <TableHead /> */}
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobApplicant && jobApplicant
                  .filter((applicant) =>
                    statusFilter === "all"
                      ? true
                      : applicant.currentStage === statusFilter
                  )
                  .sort((a, b) => {
                    const dateA = new Date(a.appliedAt).getTime();
                    const dateB = new Date(b.appliedAt).getTime();
                    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
                  })
                  .map((applicant) => <TableRow key={applicant.id} className="border-b">
                    {/* <TableCell>
                      <Input
                        type="checkbox"
                        onChange={() => {
                          setSelectedApplicant(applicant);
                          fetchSingleJobApplicant(applicant.id);
                        }}
                        checked={selectedApplicant?.id === applicant.id}
                        className="w-4 h-4"
                      />
                    </TableCell> */}
                    <TableCell>
                      {" "}
                      <Link to={applicant.id} className="hover:underline">
                        {applicant.candidateName}
                      </Link>
                    </TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>{applicant.location || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-[2px] rounded-full border capitalize text-xs 
                        ${applicant.currentStage === "HIRED"
                            ? "bg-green-100 text-green-800"
                            : applicant.currentStage === "INTERVIEW"
                              ? "bg-yellow-100 text-yellow-800"
                              : applicant.currentStage === "NEW"
                                ? "bg-blue-100 text-blue-800"
                                : applicant.currentStage === "OFFERED"
                                  ? "bg-purple-100 text-purple-800"
                                  : applicant.currentStage === "IN_REVIEW"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-100 text-gray-800"
                          }
    `}
                      >
                        {applicant.currentStage
                          ? applicant.currentStage.charAt(0).toUpperCase() + applicant.currentStage.slice(1).toLowerCase()
                          : "-"
                        }
                      </span>
                    </TableCell>
                    <TableCell>{timeAgo(applicant.appliedAt)}</TableCell>
                    <TableCell><Button asChild size={"icon"} className={"bg-blue-400 text-white"}>
                     

                       <Link to={applicant.id} className="hover:underline">
                         <Eye />
                      </Link>
                    </Button></TableCell>
                  </TableRow>
                  )}
              </TableBody>
            </Table>

          </div>
           <div className="flex justify-center   mx-auto items-center mt-4 text-sm  w-full gap-2">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>


        {selectedApplicant && (
          <ApplicantDrawer
            open={!!selectedApplicant}
            onClose={() => setSelectedApplicant(null)}
            applicantData={applicantData}
            selectedApplicant={selectedApplicant}
            view={view}
            setView={setView}
            progressCount={progressCount}
            onMoveForward={onMoveForward}
            updateApplicationStatus={updateApplicationStatus}
            status={status}
            dummyMeetings={dummyMeetings}
            stageLabels={stageLabels}
            loader={loader}
          />
        )}
      </div>
    </>
  );
};

export default ApplicantList;
