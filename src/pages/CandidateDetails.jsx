import ApplicantDrawer from "@/components/dashboard/candidates/ApplicantDrawer";
import TopBar from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useApplicantById from "@/hooks/useCandidateById";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Building,
  Clock,
  CheckCircle,
  Circle,
  Download,
  Edit3,
  Eye,
  ArrowRight,
  Loader,
  Loader2,
  ChevronDown,
} from "lucide-react";

import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const CandidateDetails = () => {
  const { candidateId } = useParams();
  const { candidate, loading, error, mutate } = useApplicantById(candidateId);
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState("");
  const [progressCount, setProgressCount] = useState(0);
  const [loadings, setLoadings] = useState(true);

  const [view, setView] = useState("status");

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
  const updateApplicationStatus = async (newStatus, stageName, hiringStep) => {
    setLoader(true);
    const user = userInfo();
    try {
      const response = await axios.put(
        "job-applications/update-field-mapping",
        {
          applicationId: candidateId,
          fieldId: newStatus,
          updatedBy: user.claims.id,
          currentStage: hiringStep,
        }
      );

      if (!response.data.error) {
        setLoader(false);
        toast.success(`Application moved to ${stageName}`);
        // fetchSingleJobApplicant(selectedApplicant.id);
        mutate()
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
  const stageLabels = {
    NEW: "New",
    IN_REVIEW: "In-Review",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    HIRED: "Hired",
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
        applicationId: candidateId,
        status: payloadStatus,
        updatedBy: userInfo?.claims?.id,
      });
      if (!response.data.error) {
        mutate();
        handleProgress(response?.data?.status);
        // setStatus(response?.data?.status);
      } else if (response.data.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error moving forward", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen w-screen">
        <Loader className="animate-spin" />
      </div>
    );
  if (error) return <p>Error loading candidate data.</p>;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const userInfo = () => {
    const token = localStorage.getItem("token");
    console.log(token);
    return token ? jwtDecode(token) : null;
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_REVIEW":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "INTERVIEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "OFFER":
        return "bg-green-100 text-green-800 border-green-200";
      case "HIRED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const renderHiringStages = () => {
    const allStages = ["NEW", "IN_REVIEW", "INTERVIEW", "OFFER", "HIRED"];
    const currentStageIndex = allStages.indexOf(candidate.currentStage);

    return (
      <div className="flex items-center justify-between mb-6">
        {allStages.map((stage, index) => (
          <div key={stage} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                index <= currentStageIndex
                  ? "bg-yellow-500 border-yellow-600 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {index < currentStageIndex ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm  ${
                  index <= currentStageIndex
                    ? "text-yellow-600"
                    : "text-gray-400"
                }`}
              >
                {stage?.replace("_", " ")}
              </p>
            </div>
            {index < allStages.length - 1 && (
              <ArrowRight
                className={`mx-4 w-4 h-4 ${
                  index < currentStageIndex
                    ? "text-yellow-600"
                    : "text-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  console.log(candidate, "candidate");
 
    const handleMoveForward = () => {
      const currentFieldId = candidate?.currentStatusField?.fieldId;
      const currentStageKey =
        candidate?.currentStatusField?.fieldName ||
        candidate?.currentStage;
      const steps = [];
  
      steps.push({ key: "NEW", fieldId: null, fieldName: "NEW" });
  
      ["IN_REVIEW", "INTERVIEW", "OFFER"].forEach((key) => {
        const fields =
          candidate?.job?.hiringProcess?.stageFields?.[key] || [];
        fields.forEach((field) => {
          steps.push({
            key,
            fieldId: field.fieldId,
            fieldName: field.fieldName,
          });
        });
      });
  
      steps.push({ key: "HIRED", fieldId: null, fieldName: "HIRED" });
  
      const currentIndex = steps.findIndex((step) => {
        if (["NEW", "HIRED"].includes(step.key)) {
          return step.key === currentStageKey;
        }
        return step.fieldId === currentFieldId;
      });
  
      const nextStep = steps[currentIndex + 1];
  
      if (nextStep) {
        updateApplicationStatus(
          nextStep.fieldId,
          nextStep.fieldName,
          nextStep.key
        );
      }
    };
  

  

  return (
    <>
      <TopBar back={true} title={"Applicant Detail"} />
      <div className="min-h-screen bg-blue-50 w-full p-4 zoom-out">
        <div className="">
          {/* Header */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Candidate Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {candidate?.candidateName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-700 ">
                        {candidate.candidateName}
                      </h2>
                      <p className="text-gray-600">
                        Applying for{" "}
                        {candidate.jobTitle || candidate.job?.jobTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedApplicant(candidate);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-neutral-700 text-sm ">
                        {candidate.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-neutral-700 text-sm ">
                        {candidate.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-neutral-700 text-sm ">
                        {candidate.location ||
                          candidate.job?.jobLocation ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Applied</p>
                      <p className="text-neutral-700 text-sm ">
                        {formatDate(candidate.appliedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-blue-950/40 hover:shadow">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className=" text-neutral-700 text-sm">Resume.pdf</p>
                      <p className="text-sm text-gray-500">Uploaded document</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      candidate.resumeUrl &&
                      window.open(candidate.resumeUrl, "_blank")
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-300"
                    disabled={!candidate.resumeUrl}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Hiring Process Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">

                <h3 className="text-xl font-bold text-neutral-700 ">
                  Hiring Process
                </h3>
                <div className="flex gap-2 items-center justify-between">

                 <Button
                    className="bg-[#4C6B8A] text-white shadow-lg"
                    disabled={candidate?.currentStage === "HIRED" || loader}
                    onClick={()=>{
                      console.log("move forward")
                      handleMoveForward()}}
                  >
                    Move Forward
                  </Button>
                       <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            className="bg-[#4C6B8A] text-white px-3"
                                            disabled={loader}
                                          >
                                            {loader ? (
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                              <ChevronDown className="h-4 w-4" />
                                            )}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-64">
                                          {Object.entries(stageLabels).map(([key, label]) => {
                                            const selectedFieldId =
                                              candidate?.currentStatusField?.fieldId;
                                            const isCurrentStage =
                                              candidate?.currentStage === key;
                  
                                            return (
                                              <div key={key}>
                                                {["NEW", "HIRED"].includes(key) ? (
                                                  <DropdownMenuItem
                                                    onClick={() =>
                                                      updateApplicationStatus(null, key, key)
                                                    }
                                                    className={`px-3 py-1 font-semibold text-sm text-black ${
                                                      isCurrentStage
                                                        ? "bg-gray-200 text-green-700"
                                                        : ""
                                                    }`}
                                                  >
                                                    {label}
                                                    {isCurrentStage && (
                                                      <span className="ml-auto text-green-700">
                                                        ✓
                                                      </span>
                                                    )}
                                                  </DropdownMenuItem>
                                                ) : (
                                                  <>
                                                    <div className="px-3 py-1 font-semibold text-sm text-black">
                                                      {label}
                                                    </div>
                                                    {candidate?.job?.hiringProcess?.stageFields?.[
                                                      key
                                                    ]?.map((item) => {
                                                      const isSelected =
                                                        selectedFieldId === item.fieldId;
                                                      return (
                                                        <DropdownMenuItem
                                                          key={item.fieldId}
                                                          onClick={() => {
                                                            if (!isSelected) {
                                                              updateApplicationStatus(
                                                                item.fieldId,
                                                                item.fieldName,
                                                                key
                                                              );
                                                            }
                                                          }}
                                                          className={`pl-6 text-sm text-gray-700 ${
                                                            isSelected
                                                              ? "bg-gray-200 text-green-700 font-semibold"
                                                              : ""
                                                          }`}
                                                        >
                                                          {item.fieldName}
                                                          {isSelected && (
                                                            <span className="ml-auto text-green-700">
                                                              ✓
                                                            </span>
                                                          )}
                                                        </DropdownMenuItem>
                                                      );
                                                    })}
                                                  </>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                </div>
                  
              </div>
                {renderHiringStages()}

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className=" font-semibold text-neutral-700 text-sm">
                      Current Stage Details
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm  border ${getStageColor(
                        candidate.currentStage
                      )}`}
                    >
                      {candidate.currentStage?.replace("_", " ")}
                    </span>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border">
                    <p className=" text-blue-900">
                      {candidate.currentStatusField?.fieldName ||
                        "Current Stage"}
                    </p>
                    <p className="text-sm text-blue-900 mt-1">
                      Currently in progress
                    </p>
                  </div>

                  {candidate.job?.hiringProcess?.stageFields?.INTERVIEW && (
                    <div className="mt-6 ">
                      <h5 className=" text-neutral-700 text-sm mb-3">
                        Interview Rounds
                      </h5>
                      <div className="space-y-2">
                        {candidate.job.hiringProcess.stageFields.INTERVIEW.map(
                          (round, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                            >
                              <span className="text-gray-700 ">
                                {round.fieldName}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs  ${
                                  round?.fieldName ===
                                  candidate.currentStatusField?.fieldName
                                    ? "bg-blue-100 text-blue-900"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                              >
                                {round?.fieldName ===
                                candidate.currentStatusField?.fieldName
                                  ? "Current"
                                  : "Pending"}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Job Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-neutral-700 text-sm mb-4">
                  Job Details
                </h3>
                

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Job Code</p>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {candidate.job?.jobCode || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className=" text-neutral-700 text-sm">
                      {candidate.jobTitle || candidate.job?.jobTitle}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <p className=" text-neutral-700 text-sm">
                        {candidate.job?.customFields?.find(
                          (field) => field.customFieldLabel === "Company"
                        )?.value || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Posted By</p>
                    <p className=" text-neutral-700 text-sm">
                      {candidate.job?.createdBy?.name || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Process</p>
                    <p className=" text-neutral-700 text-sm">
                      {candidate.job?.hiringProcess?.name || "Default Process"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className=" font-bold text-neutral-700 text-sm mb-4">
                    Recent Activity
                  </h3>
                 
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-neutral-700 text-sm">
                        Updated to{" "}
                        <span className="">
                          {candidate.currentStatusField?.fieldName}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        by {candidate.updatedByName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-900 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-neutral-700 text-sm">
                        Application submitted
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(candidate.appliedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-neutral-700 text-sm mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ">
                    Schedule Interview
                  </button>
                  <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ">
                    Move to Next Stage
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ">
                    Add Notes
                  </button>
                  <button className="w-full px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors ">
                    Reject Application
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {selectedApplicant && (
          <ApplicantDrawer
            open={!!selectedApplicant}
            onClose={() => setSelectedApplicant(null)}
            applicantData={candidate}
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

export default CandidateDetails;
