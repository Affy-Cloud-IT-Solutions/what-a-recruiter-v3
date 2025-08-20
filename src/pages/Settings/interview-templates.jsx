import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Eye, Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import ManageStepsModal from "./manage-steps";
import TopBar from "@/components/dashboard/dashboard-header";
import { useNavigate, useParams } from "react-router-dom";
import { FaToggleOn } from "react-icons/fa";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCompanyTemplates } from "@/lib/api.hook";
import { jwtDecode } from "jwt-decode";
import Templates from "./templates";
import useAssignTemplateToField from "@/hooks/use-assign-fields";
import toast from "react-hot-toast";
import { token } from "../../lib/utils";
const InterviewTemplates = () => {
  const [savedSteps, setSavedSteps] = useState(["New", "Recruiter Screen"]);
  // Temporary steps for modal editing
  const [tempSteps, setTempSteps] = useState([]);
  const [fieldId, setFieldId] = useState();

  const [data, setData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState();

  const { hiringProcessId } = useParams();
  const fetchHiringCustomFields = async (hiringProcessId) => {
    try {
      const response = await axios.get(
        `hiring-custom-fields/hiring-process/${hiringProcessId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching hiring custom fields:", error);
      throw error;
    }
  };

  const { assignTemplate, loading, error, success } =
    useAssignTemplateToField();

  const handleClick = async () => {
    if (!fieldId || !selectedTemplate) {
      return toast.error("didnt select any field or template id");
    }
    await assignTemplate(hiringProcessId, fieldId, selectedTemplate);
    getFields();
  };

  async function getFields() {
    try {
      const data = await fetchHiringCustomFields(hiringProcessId);

      setData(data.meta.hiringProcess);
    } catch (err) {
      console.error("Failed to load custom fields", err);
    }
  }

  useEffect(() => {
    if (!hiringProcessId) return;

    getFields();
  }, [hiringProcessId]);
  const jwt = token && jwtDecode(token);
  const { templates } = useCompanyTemplates(jwt?.claims?.id);

  const navigate = useNavigate();
  return (
    <>
      <TopBar title={"Interview templates"} back={true} />
      <div className="p-4 space-y-4 border min-h-screen shadow-md bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-[400]">{data.name}</h2>
          <ManageStepsModal
            sections={data.stageFields}
            tempSteps={tempSteps}
            setTempSteps={setTempSteps}
            savedSteps={savedSteps}
            setSavedSteps={setSavedSteps}
          />
        </div>
        <div>
          {data?.stageFields &&
            Object.entries(data?.stageFields).map(([stageName, fields]) => (
              <div key={stageName} className=" rounded">
                <h2 className="font-semibold mb-3">{stageName}</h2>
                <ul>
                  {fields?.map((field) => (
                    <li
                      key={field.id}
                      className="border p-4 rounded mb-4 bg-muted dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between tracking-wide">
                        <div className="space-y-1 text-sm font-medium">
                          <div>
                            <span className="text-gray-500 font-medium">
                              Label:
                            </span>{" "}
                            <span className=" text-gray-700">
                              {field.label}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 ">Type:</span>{" "}
                            <span className="text-gray-700">
                              {field.fieldType}
                            </span>
                          </div>
                          {/* <div>
                            <span className="text-gray-500 font-medium">
                              Sequence:
                            </span>{" "}
                            <span className="text-gray-700">
                              {field.sequence}
                            </span>
                          </div> */}
                          {field.interviewTemplate ? (
                            <div>
                              <span className="text-gray-500 font-medium">
                                Assign Template:
                              </span>{" "}
                              <span className="text-gray-700">
                                {field.interviewTemplate.name}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span>No Template Assign</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              {field.interviewTemplate && (
                                <Eye
                                  size={16}
                                  onClick={() => {}}
                                  className="w-5 h-5 cursor-pointer"
                                />
                              )}
                            </AlertDialogTrigger>
                            <AlertDialogContent className="min-w-3xl ">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-semibold">
                                  {field.label}
                                </AlertDialogTitle>
                              </AlertDialogHeader>

                              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 overflow-y-auto min-h-[70vh] h-80 md:h-96">
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Template Details
                                  </h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    <p>
                                      <>Template name:</> {field.label}
                                    </p>
                                    <p>
                                      <>Step:</> {field.label}
                                    </p>
                                    <p>
                                      <>Duration:</> 30 minutes
                                    </p>
                                    <p>
                                      <>Format:</> Other location
                                    </p>
                                    <p>
                                      <>Location:</> —
                                    </p>
                                    <p>
                                      <>Host:</> —
                                    </p>
                                    <p>
                                      <>Private invitations:</> No
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Interviewers
                                  </h3>
                                  <p>Anyone on the hiring team</p>
                                  <p>1</p>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Communication
                                  </h3>
                                  <p>
                                    <>Subject:</> Let’s Connect for a Quick Chat
                                  </p>
                                  <p>
                                    <>Message:</>
                                  </p>
                                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md whitespace-pre-wrap">
                                    Hi [m_applicant_first_name], We’d like to
                                    schedule a conversation with our recruiter
                                    to discuss your experience and the
                                    [m_job_title] opportunity. Please use this
                                    link to find the time that works best for
                                    you: [self_schedule_url] We look forward to
                                    learning more about you! Best regards,
                                    [m_brand_name]
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Interview reminders
                                  </h3>
                                  <p>No reminders</p>
                                </div>
                              </div>

                              <AlertDialogFooter className="flex justify-between items-center pt-6">
                                <Button
                                  variant="yellow"
                                  onClick={() => {
                                    navigate(
                                      `${field.interviewTemplate.id}/edit`
                                    );
                                  }}
                                >
                                  Edit Template
                                </Button>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Sheet>
                            <SheetTrigger asChild>
                              <FaToggleOn
                                size={16}
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => setFieldId(field.id)}
                              />
                            </SheetTrigger>
                            <SheetContent>
                              <Templates
                                templates={templates}
                                selectedTemplate={selectedTemplate}
                                setSelectedTemplate={setSelectedTemplate}
                              />
                              <SheetFooter className={"!flex gap-2"}>
                                {/* <Button variant={"outline"}>Cancel</Button> */}
                                <Button onClick={handleClick}>Replace</Button>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        <div className="border p-4 rounded-lg">
          <p className="text-lg font-semibold">
            Overwrite job interview settings
          </p>
          <p className="text-sm text-gray-600 mt-1">
            By default, changes above apply to new jobs. Click below to
            overwrite modified jobs.
          </p>
          <Button variant="destructive" className="mt-2">
            Overwrite modified jobs
          </Button>
        </div>
      </div>
    </>
  );
};

export default InterviewTemplates;
