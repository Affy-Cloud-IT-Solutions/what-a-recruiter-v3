import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Templates = ({ templates, setSelectedTemplate, selectedTemplate }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-auto h-screen space-y-3 p-4 me-8">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => {
            setSelectedTemplate(template.id);
          }}
          className={` ${
            selectedTemplate == template.id && "border border-primary"
          } flex items-center justify-between border px-4 py-3 hover:bg-gray-50`}
        >
          <div>
            <p className=" text-gray-900">{template.name}</p>
            <p className="text-xs text-gray-500 flex gap-2">
              <div>{template.hiringStage}</div> |
              <div>{template.hiringStep}</div>
              <p className="text-xs">
                {template.duration} mins |{template.format}
              </p>
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Eye
                size={16}
                onClick={() => {}}
                className="w-5 h-5 cursor-pointer"
              />
            </AlertDialogTrigger>
            <AlertDialogContent className="min-w-3xl ">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-semibold">
                  {/* {field.label} */}
                </AlertDialogTitle>
              </AlertDialogHeader>

              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 overflow-y-auto min-h-[70vh] h-80 md:h-96">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Template Details
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <p>{/* <>Template name:</> {field.label} */}</p>
                    <p>{/* <>Step:</> {field.label} */}</p>
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
                    Hi [m_applicant_first_name], We’d like to schedule a
                    conversation with our recruiter to discuss your experience
                    and the [m_job_title] opportunity. Please use this link to
                    find the time that works best for you: [self_schedule_url]
                    We look forward to learning more about you! Best regards,
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
                    navigate(`${template.id}/edit`);
                  }}
                >
                  Edit Template
                </Button>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
};

export default Templates;
