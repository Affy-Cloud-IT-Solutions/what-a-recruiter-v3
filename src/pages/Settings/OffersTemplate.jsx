import TopBar from "@/components/dashboard/dashboard-header";
import React, { useRef, useState } from "react";
import { FaDownload, FaPen, FaFileAlt } from "react-icons/fa";
import { MergeFieldsModal } from "./MergeFieldsModal";
import {
  useFetchTemplatesByParent,
  useUploadOfferTemplate,
} from "@/hooks/useOffersTemplate";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "@mui/material";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DynamicSelectField from "./DynamicSelected";
import axios from "axios";

const OfferTemplates = () => {
  const fileInputRef = useRef(null);
  // const [templates, setTemplates] = useState([]);
  const { templates, fetchTemplates } = useFetchTemplatesByParent();
  const [customFieldsPayload, setCustomFieldsPayload] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  console.log(templates, "templates");
  // const { createTemplate } = useCreateOfferTemplate();

  const { uploadTemplate, loading, error } = useUploadOfferTemplate();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      toast.success("Please enter Parent ID first.");
      return;
    }

    await uploadTemplate(selectedFile);
    fetchTemplates();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newTemplates = files.map((file) => ({
      name: file.name,
      dateFormat: "MM/DD/YYYY",
      file,
    }));
    setTemplates((prev) => [...prev, ...newTemplates]);
  };

  const handleFieldChange = (fieldId, values, isAllSelected) => {
    setCustomFieldsPayload((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((f) => f.customFieldId === fieldId);

      const newField = {
        customFieldId: fieldId,
        valueIds: values,
        selectAll: isAllSelected,
      };

      if (index > -1) {
        updated[index] = newField;
      } else {
        updated.push(newField);
      }

      return updated;
    });
  };

  const updateOfferTemplate = async (templateId, payload) => {
    try {
      const response = await axios.put(
        `offer-latter/offer-templates/${templateId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update offer template:", error);
      throw error;
    }
  };
  const handleUpdateTemplate = async () => {
    if (!selectedTemplate?.id) {
      toast.error("No template selected");
      return;
    }

    const payload = {
      name: selectedTemplate.name || "Template",
      customFields: customFieldsPayload,
    };

    try {
      await updateOfferTemplate(selectedTemplate.id, payload);
      toast.success("Template updated successfully");
      fetchTemplates(); // refresh list
    } catch (error) {
      toast.error("Failed to update template");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-between items-center w-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <Dialog>
      <TopBar title={"Offers Template"} back={true} />
      <div className=" bg-white shadow-md rounded-md max-w-7xl mx-auto px-4 my-4 py-4">
        {/* <h2 className="text-xl font-semibold mb-4">Offer templates</h2> */}
        <div
          className="border-2 border-dashed border-blue-800 rounded-xl p-8 text-center cursor-pointer text-sm text-gray-600 mb-4"
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept=".doc,.docx,.odt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <p>
            <span className="text-blue-800 font-medium">Upload a template</span>{" "}
            or drop it here
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported files: DOC, DOCX, ODT (10MB size limit)
          </p>
        </div>
        <MergeFieldsModal />
        {/* Search */}
        <input
          type="text"
          placeholder="Search for template"
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Template Table */}
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4">Template Name</th>
              {/* <th className="py-2 px-4">Date Format</th> */}
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{template.name}</td>
                {/* <td className="py-2 px-4">{template.dateFormat}</td> */}

                <td className="py-2 px-4 flex gap-2 justify-center">
                  <Button size={"icon"} title="View" variant={"outline"}>
                    <FaFileAlt className="text-blue-600" />
                  </Button>
                  <Button
                    size={"icon"}
                    title="Download"
                    variant={"outline"}
                    onClick={() => downloadFile(template.file)}
                  >
                    <FaDownload className="text-green-600" />
                  </Button>
                  <DialogTrigger asChild>
                    <Button
                      size={"icon"}
                      title="Edit"
                      variant={"outline"}
                      onClick={() => {
                        console.log(template);
                        setSelectedTemplate(template);
                      }}
                    >
                      <FaPen className="text-gray-700" />
                    </Button>
                  </DialogTrigger>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No templates uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <DialogContent className="flex p-8 pb-0 flex-col gap-0  sm:max-h-[min(640px,80vh)] sm:max-w-4xl [&>button:last-child]:hidden ">
        <div className="  overflow-y-auto max-h-[calc(80vh-100px)] p-2">
          <div className="space-y-4 grid grid-cols-2 gap-3">
            {selectedTemplate?.fieldMappings &&
              selectedTemplate.fieldMappings.map((field) => {
                return (
                  <DynamicSelectField
                    key={field.customFieldId}
                    field={field}
                    onChange={handleFieldChange}
                  />
                );
              })}
          </div>
        </div>
        <DialogFooter className="px-6 pb-6 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleUpdateTemplate}>
              Okay
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper to download file
function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
}

export default OfferTemplates;
