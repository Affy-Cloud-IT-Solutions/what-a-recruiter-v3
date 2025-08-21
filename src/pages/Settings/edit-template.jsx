import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill-new";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "@/components/dashboard/dashboard-header";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import useHiringStages from "@/lib/api.hook";
import { formatStageLabel } from "@/lib/utils";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import useTemplateById from "@/hooks/useTemplateById";
import toast from "react-hot-toast";
import { token } from "../../lib/utils";
import { MyEditor } from "@/components/dashboard/jobs/MyEditor";

const MAX_FIELDS = 10;

const InterviewTemplateForm = () => {
  const [templateName, setTemplateName] = useState("");
  const [hiringStep, setHiringStep] = useState("New");
  const [duration, setDuration] = useState("20");
  const [format, setFormat] = useState("Other location");
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [hiringRole, setHiringRole] = useState("Anyone on the hiring team");

  const [minimumNumber, setMinimumNumber] = useState("1");
  const [roles, setRoles] = useState([{ role: "", min: "" }]);
  const [reminders, setReminders] = useState([]);
  const [defaults, setDefaults] = useState(true);

  const addReminder = () => {
    if (reminders.length >= 10) return;
    setReminders([...reminders, { message: "", hoursBefore: "" }]);
  };
  const updateReminder = (index, key, value) => {
    const updated = [...reminders];
    updated[index][key] = key === "hoursBefore" ? parseInt(value, 10) : value;
    setReminders(updated);
  };

  const updateRole = (index, field, value) => {
    const updated = [...roles];
    updated[index][field] = value;
    setRoles(updated);
  };

  const addRole = () => {
    if (roles.length < MAX_FIELDS) {
      setRoles([...roles, { role: "", min: "" }]);
    }
  };

  const removeRole = (index) => {
    const updated = [...roles];
    updated.splice(index, 1);
    setRoles(updated);
  };
  const [subject, setSubject] = useState("Let’s Connect for a Quick Chat");
  const [message, setMessage] = useState(
    `Hi [m_applicant_first_name],
We'd like to schedule a conversation with our recruiter to discuss your experience and the [m_job_title] opportunity.

Please use this link to find the time that works best for you:

[self_schedule_url]

We look forward to learning more about you!

Best regards,
[m_brand_name]`
  );
  const id = useParams();
  const navigate = useNavigate();
  const { stages, loading, error } = useHiringStages();

  const jwt = token && jwtDecode(token);

  const handleCreate = async () => {
    const hiringTeamRoleToInterviewerCount = roles.reduce((acc, curr) => {
      if (curr.role && curr.min) {
        acc[curr.role] = parseInt(curr.min, 10);
      }
      return acc;
    }, {});

    const payload = {
      name: templateName,
      hiringStep: hiringStep.split("__")[1],
      hiringStage: hiringStep.split("__")[0], // or dynamic if needed
      duration: parseInt(duration),
      format,
      location,
      privateInterview: isPrivate,
      hiringTeamRoleToInterviewerCount: hiringTeamRoleToInterviewerCount,
      invitation: {
        email: {
          subject,
          content: message,
          bcc: [],
        },
        sms: "Hi, we'd like to schedule a quick interview with you.",
        whatsApp: "Hello, please check your email for interview details.",
        language: "en", // static for now
      },
      reminders: reminders,
      parentId: jwt.claims.id,
      default: defaults,
    };

    // const payload = {
    //   name: "Initial Screening Interview",
    //   hiringStep: "Recruiter Screen",
    //   hiringStage: "INTERVIEW",
    //   duration: 30,
    //   format: "Video",
    //   location: "Zoom / Google Meet",
    //   privateInterview: true,
    //   hiringTeamRoleToInterviewerCount: {
    //     Recruiter: 1,
    //     "Hiring Manager": 1,
    //   },
    //   invitation: {
    //     email: {
    //       subject: "Let's Connect for a Quick Chat",
    //       content:
    //         "Hi [m_applicant_first_name],\nWe'd like to schedule a conversation with our recruiter to discuss your experience and the [m_job_title] opportunity.\n\nPlease use this link to find the time that works best for you:\n[self_schedule_url]\n\nWe look forward to learning more about you!\n\nBest regards,\n[m_brand_name]",
    //       bcc: ["hr@company.com"],
    //     },
    //     sms: "Hi, we'd like to schedule a quick interview with you.",
    //     whatsApp: "Hello, please check your email for interview details.",
    //     language: "en",
    //   },
    //   reminders: [
    //     {
    //       message: "Your interview is scheduled in 24 hours.",
    //       hoursBefore: 24,
    //     },
    //     {
    //       message: "Reminder: Interview in 1 hour.",
    //       hoursBefore: 1,
    //     },
    //   ],
    //   parentId: jwt.claims.id,
    //   default: true,
    // };
    const url = id.templateProcessId
      ? "template/templates/" + id.templateProcessId
      : "template/templates";

    try {
      const res = id.templateProcessId
        ? await axios.put(url, payload)
        : await axios.post(url, payload, {});
      toast.success("Template created successfully");
      navigate(-1);

      // Optional: reset form or show success
    } catch (err) {
      console.error(
        "Error creating template:",
        err.response?.data || err.message
      );
      toast.error(
        "Some Fields are missing or invalid make sure to fill all the fields"
      );
    }
  };

  const { template } = useTemplateById(id.templateProcessId);

  useEffect(() => {
    if (template) {
      setTemplateName(template.name || "");
      setHiringStep(template.hiringStep || "New");
      setDuration(String(template.duration || "20")); // assuming you want a string
      setFormat(template.format || "Other location");
      setLocation(template.location || "");
      setIsPrivate(template.privateInterview || false);
      setDefaults(template.default || false);

      // Convert hiringTeamRoleToInterviewerCount to roles array
      const convertedRoles = Object.entries(
        template.hiringTeamRoleToInterviewerCount || {}
      ).map(([role, min]) => ({
        role,
        min: String(min),
      }));
      setRoles(
        convertedRoles.length > 0 ? convertedRoles : [{ role: "", min: "" }]
      );

      // Set reminders directly
      setReminders(template.reminders || []);
    }
  }, [template]);

  return (
    <>
      <TopBar title={"Recruiter Screen"} back={true} />
      <div className="bg-gray-50 dark:bg-gray-900 py-3 ">
        <Card className="p-3 max-w-7xl mx-auto rounded-none ">
          {/* Template Name */}
          <div className="space-y-2">
            <Label>Template name*</Label>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Initial Screening Interview"
            />
          </div>

          {/* Hiring Step and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="w-full">
              <Label>Preferred hiring step*</Label>
              <Select value={hiringStep} onValueChange={setHiringStep}>
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="Select step" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(
                    (stage) =>
                      stage.customFields.length > 0 && (
                        <SelectGroup key={stage.stage}>
                          <SelectLabel>
                            {formatStageLabel(stage.stage)}
                          </SelectLabel>
                          {stage.customFields.map((field) => (
                            <SelectItem
                              key={field?.id}
                              value={`${stage.stage}__${field?.label}`}
                            >
                              {field?.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label>Duration*</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30"
                className="w-1/2"
              />
            </div>
          </div>

          {/* Format and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="w-full">
              <Label>Format*</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Other location">Other location</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="In-person">In-person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter a location"
                className="w-1/2"
              />
            </div>
          </div>
          {/* Private Invitation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="private-invite"
              checked={isPrivate}
              onCheckedChange={() => setIsPrivate(!isPrivate)}
            />
            <div
              htmlFor="private-invite"
              className={"inline text-sm text-gray-700"}
            >
              Make interview invitations private
            </div>
          </div>

          {/* Hiring Role and Minimum */}
          <div className="space-y-3">
            {roles.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end relative border p-2 rounded-md"
              >
                <div>
                  <Label>Hiring role*</Label>
                  <Select
                    value={item.role}
                    onValueChange={(value) => updateRole(index, "role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anyone on the hiring team">
                        Anyone on the hiring team
                      </SelectItem>
                      <SelectItem value="Recruiter">Recruiter</SelectItem>
                      <SelectItem value="Hiring Manager">
                        Hiring Manager
                      </SelectItem>
                      <SelectItem value="Interviewer">Interviewer</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Coordinator">Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Minimum number*</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Minimum"
                    value={item.min}
                    onChange={(e) => updateRole(index, "min", e.target.value)}
                  />
                </div>

                {roles.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive hover:bg-red-100"
                    onClick={() => removeRole(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {roles.length < MAX_FIELDS && (
              <Button type="button" variant="outline" onClick={addRole}>
                <Plus /> Add another role
              </Button>
            )}
          </div>

          {/* Communication to Candidates */}
          <div className="space-y-2 pt-6 border-t">
            <h3 className="font-[400]">Communication to candidates</h3>
            <Label>Delivery times*</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Label className="mt-2">Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
            />
          </div>

          <div className="space-y-4">
            {reminders.map((reminder, index) => (
              <div
                key={index}
                className="border rounded p-4 shadow-sm bg-white"
              >
                <label className="block font-semibold mb-1">
                  Delivery times*
                </label>
                <Input
                  type="number"
                  className="border px-3 py-2 rounded w-full mb-4"
                  placeholder="Delivery Times"
                  value={reminder.hoursBefore}
                  onChange={(e) =>
                    updateReminder(index, "hoursBefore", e.target.value)
                  }
                />
                <div>
                  {/* <ReactQuill
                    theme="snow"
                    value={reminder.message}
                    onChange={(value) =>
                      updateReminder(index, "message", value)
                    }
                  /> */}
                  <MyEditor   value={reminder.message}
                    onChange={(value) =>
                      updateReminder(index, "message", value)
                    }/>
                </div>
              </div>
            ))}

            {reminders.length < 10 && (
              <Button
                // className="text-destructive hover:bg-red-100"
                variant="outline"
                onClick={addReminder}
              >
                <Plus /> Add reminder
              </Button>
            )}
          </div>

          {/* Submit */}
          <Button className="mt-4" onClick={handleCreate}>
            Save Template
          </Button>
        </Card>
      </div>
    </>
  );
};

export default InterviewTemplateForm;
