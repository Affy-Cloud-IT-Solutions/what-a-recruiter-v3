import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TopBar from "../dashboard-header";
import {
  LucideBold,
  LucideItalic,
  LucideList,
  LucideListOrdered,
  LucideUnderline,
  MoveLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import CustomData from "./CustomData";
import { MyEditor } from "./MyEditor";
import { baseURL } from "@/App";
import toast from "react-hot-toast";
import { role, token } from "../../../lib/utils";

const CreateJob = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [customFields, setCustomFields] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobLocation: "",
    companyDescription: "",
    jobQualification: "",
    jobAdditionalInformation: "",
    assignedRecruiter: "",
    hiringManager: "",
  });

  const steps = [
    { number: 1, label: "Create" },
    { number: 2, label: "Details" },
    { number: 3, label: "Hiring Team" },
    { number: 4, label: "Advertise" },
    { number: 5, label: "Share" },
  ];

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const decodedToken = jwtDecode(token);
    const createdBy = decodedToken?.claims?.id;
    console.log(decodedToken);
    const url =
      role === "EMPLOYEE"
        ? `/employee/job/create/${createdBy}`
        : role === "RECRUITER"
        ? `/recruiter/job/create/${createdBy}`
        : `/admin/job/create/${
            role === "ADMIN"
              ? decodedToken.claims.parent.id
              : role == "COMPANY" && decodedToken.claims.id
          }`;

    try {
      const requestData = {
        ...formData,
        customFields: customFields,
      };

      const response = await axios.post(baseURL + url, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      navigate(-1);
      return;
    } catch (error) {
      console.error("Job creation error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const [allManager, setAllManager] = useState([]);
  useEffect(() => {
    const decodedToken = jwtDecode(token);
    const parentId = decodedToken?.claims?.id;
    const fetchCompanyManagers = async () => {
      try {
        const response = await axios.get(`/recruiter/parent/${parentId}`);
        setAllManager(response.data.meta);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCompanyManagers();
  }, []);

  const [fieldData, setFieldData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/custom-fields/child-fields-and-values`
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createEditor = (fieldName) =>
    useEditor({
      extensions: [
        StarterKit,
        Underline,
        Heading.configure({ levels: [1, 2, 3] }),
      ],
      content: formData[fieldName],
      onUpdate: ({ editor }) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: editor.getHTML(),
        }));
      },
    });

  const handleCustomFieldsChange = (fields) => {
    setCustomFields(fields);
  };

  const jobDescriptionEditor = createEditor("jobDescription");
  const companyDescriptionEditor = createEditor("companyDescription");
  const jobAdditionalInfoEditor = createEditor("jobAdditionalInformation");
  const jobQualificationEditor = createEditor("jobQualification");

  const renderToolbar = (editor) => (
    <div className="flex flex-wrap gap-2 p-2 mb-2 items-center">
      <Button
        type="button"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "outline"}
      >
        <LucideBold />
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "outline"}
      >
        <LucideItalic />
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        variant={editor.isActive("underline") ? "default" : "outline"}
      >
        <LucideUnderline />
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "outline"}
      >
        <LucideList />
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "outline"}
      >
        <LucideListOrdered />
      </Button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="w-full mt-4">
              <Label>Select Recruiter</Label>

              <select
                name="assignedRecruiter"
                value={formData.assignedRecruiter}
                onChange={handleChange}
                required
                className="!w-full border rounded p-2"
              >
                <option value="">Select a Recruiter</option>
                {allManager.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2">
              <Label>Job Title</Label>
              <Input
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>

            <div className="mt-2">
              <Label>Job Description</Label>

              <MyEditor
                value={formData.jobDescription}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    jobDescription: value,
                  }))
                }
              />
            </div>

            <div className="mt-2">
              <Label>Job Location</Label>
              <Input
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleChange}
              />
            </div>

            <div className="mt-2">
              <Label>Company Description</Label>
              <MyEditor
                value={formData.companyDescription}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyDescription: value,
                  }))
                }
              />
            </div>

            <div className="mt-2">
              <Label>Job Additional Information</Label>

              <MyEditor
                value={formData.jobAdditionalInformation}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    jobAdditionalInformation: value,
                  }))
                }
              />
            </div>

            <div className="mt-2">
              <Label>Job Qualification or Required Skills</Label>

              <MyEditor
                value={formData.jobQualification}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    jobQualification: value,
                  }))
                }
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <CustomData onCustomFieldsChange={handleCustomFieldsChange} />
          </>
        );
      case 3:
        return (
          <>
            <Label>Hiring Manager</Label>
            <Input
              name="hiringManager"
              value={formData.hiringManager}
              onChange={handleChange}
              className="mb-2"
            />

            <Label>Job Qualification</Label>

            <MyEditor
              value={formData.jobQualification}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  jobQualification: value,
                }))
              }
            />
          </>
        );
      case 4:
        return (
          <>
            <Label>Job Additional Information</Label>

            <MyEditor
              value={formData.jobAdditionalInformation}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  jobAdditionalInformation: value,
                }))
              }
            />
          </>
        );
      case 5:
        return (
          <p>Final review step (Optional: Add sharing logic or summary here)</p>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TopBar title="Create Job" back={true} />
      <div className="min-h-screen p-4">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Stepper */}
          <div className=" flex items-center ">
            <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full
                ${currentStep > step.number ? "bg-green-600 text-white" : ""}
                ${currentStep === step.number ? "bg-green-600 text-white" : ""}
                ${
                  currentStep < step.number
                    ? "border border-green-600 text-green-600"
                    : ""
                }`}
                    >
                      {currentStep > step.number ? "✓" : step.number}
                    </div>
                    <span
                      className={`text-sm
                ${currentStep === step.number ? "font-semibold text-black" : ""}
                ${currentStep < step.number ? "text-gray-500" : ""}
                ${currentStep > step.number ? "text-gray-700" : ""}`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2
                ${currentStep > step.number ? "bg-green-400" : "bg-gray-300"}`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <hr />

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Prev
            </Button>
            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Job"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateJob;
