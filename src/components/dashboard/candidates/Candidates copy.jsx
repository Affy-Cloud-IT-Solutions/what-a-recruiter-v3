import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HiOutlineVideoCamera,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineBriefcase,
} from "react-icons/hi";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Filter,
  MailCheck,
  MoreVertical,
  PhoneCall,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatDateTime, timeAgo } from "@/lib/formatDate";
import { jwtDecode } from "jwt-decode";
import { Progress } from "@/components/ui/progress";
import { ActionPanel, StatusPanel } from "../jobs/applicants-profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HeadersJob from "./header-jobs";
import { useProfileData } from "@/hooks/use-fetch-profile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User, Mail, Phone, FileText, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { role, token } from "../../../lib/utils";

const ApplicantList = () => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [jobApplicant, setJobApplicant] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("details");
  const [pageSize, setPageSize] = useState(25);
  const [progressCount, setProgressCount] = useState(0);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [status, setStatus] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const { id } = useParams();

  const userInfo = token && jwtDecode(token);

  const updateApplicationStatus = async (newStatus) => {
    try {
      const response = await axios.put("/job-applications/status", {
        applicationId: selectedApplicant.id,
        status: newStatus,
        updatedBy: userInfo.claims.id,
      });

      if (!response.data.error) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
        setStatus(newStatus);
        // handleProgress(newStatus);
        fetchJobApplicant();
      } else if (response.data.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

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
        applicationId: selectedApplicant.id,
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

  const fetchJobApplicant = async (page = 1) => {
    try {
      const response = await axios.get(
        // `/job-applications/by-jobId/${id}/page?page=${page}&size=${pageSize}`
        `/job-applications/by-parent-id/39ab461a-b6d5-47cd-8673-e2f1b676452c`
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
      } else if (response?.data.error) {
        toast.error(`${response?.data.message}`);
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
      setStatus(selectedApplicant.status);
      handleProgress(selectedApplicant.status);
    }
  }, [selectedApplicant]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const { profileData } = useProfileData();

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
    <div className="relative min-h-screen w-full p-4 md:p-6">
      <div
        className={`transition-all duration-300 ${
          selectedApplicant ? "w-full" : "w-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {jobApplicant && jobApplicant.length} Applicants
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            Filter <Filter size={16} />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full border rounded-lg">
            <TableHeader className="bg-gray-100 text-gray-700 font-semibold">
              <TableRow>
                <TableHead />
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Application Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobApplicant &&
                jobApplicant.map((applicant) => (
                  <TableRow key={applicant.id} className="border-b">
                    <TableCell>
                      {/* <Input
                        type="checkbox"
                        onChange={() => setSelectedApplicant(applicant)}
                        checked={selectedApplicant?.id === applicant.id}
                        className="w-4 h-4"
                      /> */}
                      <Input
                        type="checkbox"
                        onChange={() => {
                          setSelectedApplicant(applicant);
                          fetchSingleJobApplicant(applicant.id);
                        }}
                        checked={selectedApplicant?.id === applicant.id}
                        className="w-4 h-4"
                      />
                    </TableCell>
                    <TableCell>{applicant.candidateName}</TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>{applicant.status}</TableCell>
                    <TableCell>{applicant.location || "-"}</TableCell>
                    <TableCell>{timeAgo(applicant.appliedAt)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center  absolute bottom-5 mx-auto left-1/2 -translate-x-1/2 items-center mt-4 text-sm flex-col gap-2">
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
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

      {/* {selectedApplicant && (
        <div className="fixed md:absolute top-0 right-0 w-full md:w-2/5 h-screen bg-white border-l shadow-lg p-4">
          <div className="flex border-b my-3">
            <button
              className={`px-4 py-2 w-1/3 text-center ${
                view === "details"
                  ? "border-b-2 border-blue-950 text-blue-950 font-bold"
                  : ""
              }`}
              onClick={() => setView("details")}
            >
              Details
            </button>
            <button
              className={`px-4 py-2 w-1/3 text-center ${
                view === "resume"
                  ? "border-b-2 border-blue-950 text-blue-950 font-bold"
                  : ""
              }`}
              onClick={() => setView("resume")}
            >
              Resume
            </button>
            <button
              className={`px-4 py-2 w-1/3 text-center ${
                view === "meeting"
                  ? "border-b-2 border-blue-950 text-blue-950 font-bold"
                  : ""
              }`}
              onClick={() => setView("meeting")}
            >
              Meeting
            </button>
          </div>
          <div className="bg-blue-100 p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">
                {selectedApplicant.candidateName}
              </h3>
              <p className="text-gray-600">{selectedApplicant.jobTitle}</p>
              <p className="text-gray-500">{selectedApplicant.email}</p>
            </div>
            <X
              className="text-red-600 cursor-pointer"
              onClick={() => setSelectedApplicant(null)}
            />
          </div>

          {view === "details" && (
            <div>
              <div className="flex flex-col justify-between my-4">
                <div className="text-sm mb-4 bg-yellow-400 font-semibold px-3 py-1 rounded w-fit">
                  Applicant Status
                </div>

                <div className="flex flex-col items-start">
                  <Progress
                    value={progressCount}
                    label={
                      (progressCount === 10 && "New") ||
                      (progressCount === 25 && "In-Review") ||
                      (progressCount === 50 && "Interview") ||
                      (progressCount === 75 && "Offered") ||
                      (progressCount === 100 && "Hired")
                    }
                    variant="primary"
                    className="mb-3 w-full"
                  />
                  <div className="flex justify-between w-full mb-4 text-sm text-gray-700 font-medium">
                    <span>New</span>
                    <span>In-Review</span>
                    <span>Interview</span>
                    <span>Offered</span>
                    <span>Hired</span>
                  </div>
                </div>

                <div className="flex justify-between mt-auto items-center">
                  <div className="flex gap-3">
                    <Button
                      className="bg-[#444B8C] whitespace-nowrap text-white px-4 py-2 rounded-lg text-sm font-medium"
                      onClick={() =>
                        setShowCandidateDetails(!showCandidateDetails)
                      }
                    >
                      {showCandidateDetails
                        ? "Hide Details"
                        : "Candidate Details"}
                    </Button>

                    <div className="relative flex items-center gap-2">
                      <button
                        className="bg-[#444B8C] whitespace-nowrap text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                        onClick={onMoveForward}
                        disabled={status === "HIRED"}
                      >
                        Move Forward
                      </button>

                      <div className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <button
                              className="bg-[#444B8C] text-white px-3 py-2 rounded-lg text-sm font-medium"
                              type="button"
                            >
                              ▼
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => updateApplicationStatus("PENDING")}
                            >
                              New
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateApplicationStatus("IN_REVIEW")
                              }
                            >
                              In-Review
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateApplicationStatus("INTERVIEW")
                              }
                            >
                              Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateApplicationStatus("OFFERED")}
                            >
                              Offered
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateApplicationStatus("HIRED")}
                            >
                              Hired
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Reject
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <HiOutlineDotsVertical size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Add to community</DropdownMenuItem>
                      <DropdownMenuItem>Add to job</DropdownMenuItem>
                      <DropdownMenuItem>Mark as withdrawn</DropdownMenuItem>
                      <DropdownMenuItem>Remove from this job</DropdownMenuItem>
                      <DropdownMenuItem>Defer</DropdownMenuItem>
                      <DropdownMenuItem>Add employee badge</DropdownMenuItem>
                      <DropdownMenuItem>Delete candidate</DropdownMenuItem>
                      <DropdownMenuItem>
                        Delete job application
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {showCandidateDetails && (
                  <div className="border text-[#364153] mt-8 p-4 rounded-lg mb-4">
                    <p className="text-sm capitalize">
                      <strong>Name:</strong> {selectedApplicant.candidateName}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {selectedApplicant.email}
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> {selectedApplicant.phone}
                    </p>
                    <p className="text-sm">
                      <strong>Profile:</strong> {selectedApplicant.jobTitle}
                    </p>
                    <p className="text-sm ">
                      <strong>Candidate ID:</strong>{" "}
                      {selectedApplicant.candidateId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {view === "resume" && (
            <>
              {selectedApplicant?.resumeUrl ? (
                <iframe
                  src={selectedApplicant.resumeUrl}
                  width="100%"
                  title="Applicant Resume"
                  className="h-[calc(100vh-200px)]"
                />
              ) : (
                <p>No Resume found for this candidate yet.</p>
              )}
            </>
          )}

          {view === "meeting" && (
            <div>
              <h3 className="text-lg my-4 font-semibold">Interview</h3>
              <div className="border text-[#364153] p-4 rounded-lg">
                <p>
                  Interviewer: {selectedApplicant.meeting?.interviewer || "N/A"}
                </p>
                <p>Round: {selectedApplicant.meeting?.round || "N/A"}</p>
                <p>
                  Hiring Manager: {selectedApplicant.hiringManager || "N/A"}
                </p>
                <p>Recruiter: {selectedApplicant.recruiter || "N/A"}</p>
                <p>Date: {selectedApplicant.date || "N/A"}</p>
                <p>Time: {selectedApplicant.meeting?.time || "N/A"}</p>
                <p>Position: {selectedApplicant.meeting?.position || "N/A"}</p>
              </div>

              <div className="mt-4 gap-2 flex">
                <input
                  type="text"
                  className="border w-full p-2 rounded-l"
                  value={selectedApplicant.meeting?.link}
                  readOnly
                />
                <Button className="bg-[#2d82b5] cursor-pointer text-white px-4">
                  JOIN
                </Button>
              </div>
            </div>
          )}
        </div>
      )} */}
      {selectedApplicant && (
        <Sheet
          open={!!selectedApplicant}
          onOpenChange={() => setSelectedApplicant(null)}
        >
          <SheetContent
            side="right"
            className="w-full md:w-2/5 overflow-y-auto px-6 py-4"
          >
            <SheetHeader className="border-b pb-4 px-0">
              <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg shadow-md">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {selectedApplicant.candidateName}
                  </h3>
                  <p className="text-lg text-gray-700">
                    {selectedApplicant.jobTitle}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <MailCheck size={18} />
                    <p>{selectedApplicant.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <PhoneCall size={18} />
                    <p>{selectedApplicant.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center">
                  <span className="text-gray-500 text-xl font-semibold">
                    {selectedApplicant.candidateName
                      ? selectedApplicant.candidateName
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .join("")
                          .toUpperCase()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex border-b mt-4">
                {["details", "resume", "meeting"].map((item) => (
                  <button
                    key={item}
                    className={`px-6 py-3 text-base w-1/3 text-center transition-all ${
                      view === item
                        ? "border-b-4 border-blue-600 text-blue-600 font-semibold"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => setView(item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </SheetHeader>

            <div>
              {view === "details" && (
                <>
                  <div className="text-sm mb-4 bg-yellow-300 font-semibold px-4 py-2 rounded-full w-fit">
                    Applicant Status
                  </div>

                  <div className="flex flex-col items-start">
                    <Progress
                      value={progressCount}
                      label={
                        (progressCount === 10 && "New") ||
                        (progressCount === 25 && "In-Review") ||
                        (progressCount === 50 && "Interview") ||
                        (progressCount === 75 && "Offered") ||
                        (progressCount === 100 && "Hired")
                      }
                      variant="primary"
                      className="mb-4 w-full"
                    />
                    <div className="flex justify-between w-full mb-4 text-sm text-gray-700 font-medium">
                      <span>New</span>
                      <span>In-Review</span>
                      <span>Interview</span>
                      <span>Offered</span>
                      <span>Hired</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex gap-3 flex-wrap">
                      {/* <Button
                        className="bg-[#4C6B8A] text-white shadow-lg"
                        onClick={() =>
                          setShowCandidateDetails(!showCandidateDetails)
                        }
                      >
                        {showCandidateDetails
                          ? "Hide Details"
                          : "Candidate Details"}
                      </Button> */}

                      <div className="flex gap-2 items-center">
                        <Button
                          className="bg-[#4C6B8A] text-white shadow-lg"
                          onClick={onMoveForward}
                          disabled={status === "HIRED"}
                        >
                          Move Forward
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="bg-[#4C6B8A] text-white px-3">
                              ▼
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {[
                              "PENDING",
                              "IN_REVIEW",
                              "INTERVIEW",
                              "OFFERED",
                              "HIRED",
                            ].map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => updateApplicationStatus(status)}
                              >
                                {status.replace("_", "-")}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        Reject
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {[
                          "Add to community",
                          "Add to job",
                          "Mark as withdrawn",
                          "Remove from this job",
                          "Defer",
                          "Add employee badge",
                          "Delete candidate",
                          "Delete job application",
                        ].map((item, i) => (
                          <DropdownMenuItem key={i}>{item}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* {showCandidateDetails && (
                    <div className="border border-gray-300 mt-8 p-6 rounded-lg mb-4 space-y-3 bg-gray-50">
                      <p className="text-sm capitalize">
                        <strong>Name:</strong> {selectedApplicant.candidateName}
                      </p>
                      <p className="text-sm">
                        <strong>Email:</strong> {selectedApplicant.email}
                      </p>
                      <p className="text-sm">
                        <strong>Phone:</strong> {selectedApplicant.phone}
                      </p>
                      <p className="text-sm">
                        <strong>Profile:</strong> {selectedApplicant.jobTitle}
                      </p>
                      <p className="text-sm">
                        <strong>Candidate ID:</strong>{" "}
                        {selectedApplicant.candidateId}
                      </p>
                    </div>
                  )} */}
                </>
              )}

              {view === "resume" && (
                <>
                  {selectedApplicant?.resumeUrl ? (
                    <iframe
                      src={selectedApplicant.resumeUrl}
                      width="100%"
                      className="h-[calc(100vh-200px)]"
                      title="Resume Viewer"
                    />
                  ) : (
                    <p className="text-lg text-center text-gray-600">
                      No Resume found for this candidate yet.
                    </p>
                  )}
                </>
              )}

              {view === "meeting" && (
                <>
                  {dummyMeetings.map((meeting, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded-lg shadow-sm mb-3 bg-white flex flex-col space-y-3"
                    >
                      {/* Header with Icon and Position */}
                      <div className="flex items-center gap-3 mb-3">
                        <HiOutlineVideoCamera
                          size={28}
                          className="text-blue-600"
                        />
                        <h4 className="text-lg font-semibold text-gray-800">
                          {meeting.position}
                        </h4>
                      </div>

                      {/* Meeting Details in Side-by-Side Layout */}
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <HiOutlineUser size={18} className="text-gray-600" />
                          <p>{meeting.interviewer}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <HiOutlineBriefcase
                            size={18}
                            className="text-gray-600"
                          />
                          <p>{meeting.round}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <HiOutlineUser size={18} className="text-gray-600" />
                          <p>{meeting.hiringManager}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <HiOutlineUser size={18} className="text-gray-600" />
                          <p>{meeting.recruiter}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <HiOutlineCalendar
                            size={18}
                            className="text-gray-600"
                          />
                          <p>{meeting.date}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <HiOutlineClock size={18} className="text-gray-600" />
                          <p>{meeting.time}</p>
                        </div>
                      </div>

                      {/* Join Meeting Section */}
                      <div className="flex gap-3 items-center justify-between w-full mt-3">
                        <a
                          href={meeting.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <HiOutlineVideoCamera size={18} className="mr-1" />
                          Join Meeting
                        </a>
                        <Button
                          className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600"
                          variant="contained"
                        >
                          JOIN
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default ApplicantList;
