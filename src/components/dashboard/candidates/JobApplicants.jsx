import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { ArrowLeft, Filter, Loader, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams } from "react-router-dom";
import { timeAgo } from "@/lib/formatDate";
import { jwtDecode } from "jwt-decode";
import HeadersJob from "./header-jobs";
import ApplicantDrawer from "./ApplicantDrawer";
import StepCard from "@/components/reusable/step-card";
import toast from "react-hot-toast";
import { useExtractJob } from "../../../hooks/useExtractJob";
import { token } from "../../../lib/utils";
import GithubUserForm from "./FindGitUsers";
import SearchComponent from "../PdlSearch";
import TopBar from "../dashboard-header";

const JobApplicants = () => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [jobApplicant, setJobApplicant] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loadings, setLoadings] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("status");
  const [pageSize, setPageSize] = useState(25);
  const [progressCount, setProgressCount] = useState(0);
  const [status, setStatus] = useState("");
  const { id } = useParams();
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
        `/job-applications/by-jobId/${id}/page?page=${page}&size=${pageSize}`
      );

      if (!response.data.error) {
        setJobApplicant(response?.data.meta.applications);
        setTotalItems(response?.data.meta.totalItems);
        setCurrentPage(response?.data.meta.currentPage);
        setTotalPages(response?.data.meta.totalPages);
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

  const [tab, setTab] = useState("applicants");
  const [jobDetail, setJobDetail] = useState(null);

  const handleJobDetail = (detail) => {
    setJobDetail(detail);
  };
  const hanldeHiringProcess = (detail) => {
    console.log(detail, "detail");
    setColumns(detail.stageFields);
  };
  const [applicantData, setApplicantData] = useState(null);

  const fetchSingleJobApplicant = async (applicantId) => {
    try {
      const response = await axios.get(
        // `/job-applications/by-jobId/${id}/page?page=${page}&size=${pageSize}`
        `/job-applications/${applicantId}`
      );

      if (!response.data.error) {
        setApplicantData(response?.data.meta);
        setStatus(response?.data.meta?.status);
        handleProgress(response?.data.meta?.status);
      } else if (response?.data.error) {
        toast.error(`${response?.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
    } finally {
      setLoadings(false);
    }
  };

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

  const {
    jobData: topApplicantData,
    loading: topApplicantsLoading,
    error,
    refetch,
  } = useExtractJob({
    // companyId: "123e4567-e89b-12d3-a456-426614174000",
    jobId: id,
    // topApplicants: 5,
  });

  const [columns, setColumns] = useState([]);
  const stageLabels = {
    NEW: "New",
    IN_REVIEW: "In-Review",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    HIRED: "Hired",
  };

  return (
    <>
      <TopBar back={true} />

      <div className="relative min-h-screen w-full p-4 md:p-6">
        <HeadersJob
          id={id}
          onJobDetailFetched={handleJobDetail}
          onJobHiringProcessFetched={hanldeHiringProcess}
        />
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              tab === "applicants"
                ? "border-b-2 border-blue-900  text-blue-900 "
                : "text-gray-500"
            }`}
            onClick={() => setTab("applicants")}
          >
            Applicants ({jobApplicant && jobApplicant.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              tab === "jobDetails"
                ? "border-b-2 border-blue-900  text-blue-900 "
                : "text-gray-500"
            }`}
            onClick={() => setTab("jobDetails")}
          >
            Job Details
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              tab === "hiringProcess"
                ? "border-b-2 border-blue-900  text-blue-900 "
                : "text-gray-500"
            }`}
            onClick={() => setTab("hiringProcess")}
          >
            Hiring Process
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              tab === "topApplicants"
                ? "border-b-2 border-blue-900  text-blue-900 "
                : "text-gray-500"
            }`}
            onClick={() => setTab("topApplicants")}
          >
            Top Applicants
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              tab === "gitUsers"
                ? "border-b-2 border-blue-900  text-blue-900 "
                : "text-gray-500"
            }`}
            onClick={() => setTab("gitUsers")}
          >
            Users Search
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              tab === "pdl-search"
                ? "border-b-2 border-blue-900  text-blue-900 "
                : "text-gray-500"
            }`}
            onClick={() => setTab("pdl-search")}
          >
            pdl search
          </button>
        </div>
        {tab === "applicants" && (
          <div
            className={`transition-all duration-300 ${
              selectedApplicant ? "md:w-3/5 w-full" : "w-full"
            }`}
          >
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={page === currentPage ? "def  ault" : "outline"}
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
        )}
        {tab === "pdl-search" && <SearchComponent />}

        {tab === "jobDetails" && jobDetail?.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {jobDetail?.map((field) => (
                <div key={field.customFieldId} className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">
                    {field.customFieldLabel}{" "}
                    {field?.required ? (
                      <sup className="text-red-500">*</sup>
                    ) : (
                      ""
                    )}
                  </span>
                  <span className="text-base text-gray-900 mt-1">
                    {field.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "hiringProcess" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex gap-6 flex-wrap justify-between pb-4 w-full">
              {Object.keys(stageLabels)
                .filter(
                  (columnKey) => columnKey !== "HIRED" && columns[columnKey]
                )
                .map((columnKey, colIdx) => (
                  <div
                    key={colIdx}
                    className={`flex flex-col gap-2 ${
                      columnKey === "NEW"
                        ? "w-20"
                        : "w-full md:w-[calc(30%-18px)]"
                    }`}
                  >
                    <div className="bg-blue-50 w-full text-blue-700 font-medium rounded-md px-3 py-1.5 flex justify-center items-center text-sm">
                      {stageLabels[columnKey]}
                    </div>

                    <div
                      className={`${
                        columnKey === "NEW"
                          ? "flex flex-col gap-2"
                          : "flex flex-wrap gap-2"
                      }`}
                    >
                      {columnKey === "NEW" ? (
                        <StepCard title="New" />
                      ) : (
                        columns[columnKey]
                          ?.filter((stepObj) => stepObj.step !== "HIRED")
                          .map((stepObj) => (
                            <StepCard
                              key={stepObj.fieldId || stepObj.id}
                              title={stepObj.fieldName || stepObj.label}
                            />
                          ))
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {tab === "topApplicants" && (
          <div className="bg-white rounded shadow-md p-6">
            {topApplicantsLoading ? (
              <div className="w-full flex justify-center items-center">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <div>
                {topApplicantData?.length > 0 ? (
                  <table className="min-w-full border divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left">Candidate ID</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Score</th>
                        <th className="px-4 py-2 text-left">Skills</th>
                        <th className="px-4 py-2 text-left">Education</th>
                        <th className="px-4 py-2 text-left">Document</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topApplicantData.map((candidate, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium">
                            {candidate.name}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {candidate.candidate_id}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {candidate.email || "—"}
                          </td>
                          <td className="px-4 py-2">{candidate.score}</td>
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-200 px-2 py-0.5 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.education.map((edu, idx) => (
                                <span
                                  key={idx}
                                  className="border px-2 py-0.5 rounded text-xs"
                                >
                                  {edu}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            {candidate.document ? (
                              <a
                                href={candidate.document}
                                className="text-blue-500 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No match found for this job.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {tab === "gitUsers" && (
          <div className="bg-white rounded shadow-md p-6">
            <GithubUserForm />
          </div>
        )}

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

export default JobApplicants;
