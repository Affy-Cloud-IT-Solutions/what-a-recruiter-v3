import React from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MailCheck,
  PhoneCall,
  MoreVertical,
  Loader2,
  ChevronDown,
  FilePlus,
  SearchCheck,
  Mic,
  BadgeCheck,
  UserCheck,
  HelpCircle,
} from "lucide-react";
import {
  HiOutlineVideoCamera,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi2";
import { Progress } from "@/components/ui/progress";

const ApplicantDrawer = ({
  open,
  onClose,
  applicantData,
  selectedApplicant,
  view,
  setView,
  progressCount,
  onMoveForward,
  updateApplicationStatus,
  status,
  dummyMeetings,
  stageLabels,
  loader,
}) => {
  const stageValueMap = {
    NEW: 10,
    IN_REVIEW: 25,
    INTERVIEW: 50,
    OFFER: 75,
    HIRED: 100,
  };
  const handleMoveForward = () => {
    const currentFieldId = applicantData?.currentStatusField?.fieldId;
    const currentStageKey =
      applicantData?.currentStatusField?.fieldName ||
      applicantData?.currentStage;
    const steps = [];

    steps.push({ key: "NEW", fieldId: null, fieldName: "NEW" });

    ["IN_REVIEW", "INTERVIEW", "OFFER"].forEach((key) => {
      const fields =
        applicantData?.job?.hiringProcess?.stageFields?.[key] || [];
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

  const getStageIcon = (stage) => {
    switch (stage) {
      case "NEW":
        return <FilePlus className="w-4 h-4 inline-block mr-2" />;
      case "IN_REVIEW":
        return <SearchCheck className="w-4 h-4 inline-block mr-2" />;
      case "INTERVIEW":
        return <Mic className="w-4 h-4 inline-block mr-2" />;
      case "OFFER":
        return <BadgeCheck className="w-4 h-4 inline-block mr-2" />;
      case "HIRED":
        return <UserCheck className="w-4 h-4 inline-block mr-2" />;
      default:
        return <HelpCircle className="w-4 h-4 inline-block mr-2" />;
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case "NEW":
        return "bg-blue-300";
      case "IN_REVIEW":
        return "bg-yellow-300";
      case "INTERVIEW":
        return "bg-purple-300";
      case "OFFER":
        return "bg-green-300";
      case "HIRED":
        return "bg-emerald-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full md:w-2/5 overflow-y-auto px-6 py-4"
      >
        <SheetHeader className="border-b pb-4 px-0">
          <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg shadow-md">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {applicantData?.candidateName}
              </h3>
              <p className="text-lg text-gray-700">{applicantData?.jobTitle}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <MailCheck size={18} />
                <p>{applicantData?.email}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <PhoneCall size={18} />
                <p>{applicantData?.phone || "N/A"}</p>
              </div>
            </div>
            <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center">
              <span className="text-gray-500 text-xl font-semibold">
                {applicantData?.candidateName
                  ? applicantData.candidateName
                      .split(" ")
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="flex border-b mt-4">
            {["status", "details", "resume", "meeting"].map((item) => (
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
          {view === "status" && (
            <>
              <div
                className={`text-sm mb-4 font-semibold px-4 py-2 rounded-full w-fit flex items-center ${getStageColor(
                  applicantData?.currentStage
                )}`}
              >
                {getStageIcon(applicantData?.currentStage)}
                Applicant Status:{" "}
                {applicantData?.currentStatusField?.fieldName ||
                  applicantData?.currentStage}
              </div>

              <div className="flex flex-col items-start">
                <Progress
                  value={stageValueMap[applicantData?.currentStage] || 0}
                  label={applicantData?.currentStage || ""}
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
                  <div className="flex gap-2 items-center">
                    <Button
                      className="bg-[#4C6B8A] text-white shadow-lg"
                      disabled={
                        applicantData?.currentStage === "HIRED" || loader
                      }
                      onClick={handleMoveForward}
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
                            applicantData?.currentStatusField?.fieldId;
                          const isCurrentStage =
                            applicantData?.currentStage === key;

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
                                  {applicantData?.job?.hiringProcess?.stageFields?.[
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

                    {/* <DropdownMenu>
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
                            applicantData?.currentStatusField?.fieldId;

                          return (
                            <div key={key}>
                              {["NEW", "HIRED"].includes(key) ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateApplicationStatus(null, key, key)
                                  }
                                  className={`px-3 py-1 font-semibold text-sm text-black ${
                                    selectedFieldId === key
                                      ? "bg-gray-200 text-green-700"
                                      : ""
                                  }`}
                                >
                                  {label}
                                  {selectedFieldId === key && (
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
                                  {applicantData?.job?.hiringProcess?.stageFields?.[
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
                    </DropdownMenu> */}
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
            </>
          )}

          {view === "resume" && (
            <>
              {selectedApplicant?.resumeUrl ? (
                <iframe
                  src={applicantData?.resumeUrl}
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
                  <div className="flex items-center gap-3 mb-3">
                    <HiOutlineVideoCamera size={28} className="text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-800">
                      {meeting.position}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <HiOutlineUser size={18} />
                      <p>{meeting.interviewer}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineBriefcase size={18} />
                      <p>{meeting.round}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineUser size={18} />
                      <p>{meeting.hiringManager}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineUser size={18} />
                      <p>{meeting.recruiter}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineCalendar size={18} />
                      <p>{meeting.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiOutlineClock size={18} />
                      <p>{meeting.time}</p>
                    </div>
                  </div>

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
                    <Button className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600">
                      JOIN
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}

          {view === "details" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {applicantData?.job?.customFields?.map((field) => (
                <div key={field.customFieldId} className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">
                    {field.customFieldLabel}{" "}
                    <sup className="text-red-500">
                      {field.required ? "*" : ""}
                    </sup>
                  </span>
                  <span className="text-base text-gray-900 mt-1">
                    {field.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ApplicantDrawer;
