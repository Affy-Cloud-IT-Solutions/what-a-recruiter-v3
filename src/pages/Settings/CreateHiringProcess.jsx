import React, { useEffect, useState } from "react";
import { BackButton } from "./MyProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Autocomplete, TextField } from "@mui/material";
import TopBar from "@/components/dashboard/dashboard-header";
import axios from "axios";
import { useProfileData } from "@/hooks/use-fetch-profile";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const StepCard = ({ title, index, columnKey, handleRemove }) => (
  <div className="bg-white w-20 p-3 rounded-md flex flex-col items-center gap-1 shadow-md border border-gray-200 cursor-move hover:shadow-lg transition-shadow">
    <div className="w-8 h-8 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full text-lg">
      📄
    </div>
    <div className="text-center font-medium text-xs text-gray-800 h-[30px] line-clamp-2 overflow-hidden">
      {title}
    </div>

    <button
      className="text-gray-400 hover:text-red-500 text-xs mt-1"
      onClick={handleRemove}
    >
      ✕
    </button>
  </div>
);

export default function CreateHiringProcess() {
  const [columns, setColumns] = useState({});
  const { hiringProcessId } = useParams();
  const [customData, setCustomData] = useState([]);
  const fetchCustomData = async () => {
    if (!profileData) {
      return;
    }

    const idToUse =
      profileData.role === "COMPANY" ? profileData.id : profileData.parent?.id;
    if (!idToUse) {
      return;
    }

    try {
      const response = await axios.get(
        `custom-fields/fields?userId=${idToUse}`
      );
      if (!response.data.error) {
        setCustomData(response.data.meta.fields);
      } else if (response.data.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching job applicant data:", error);
    }
  };

  const { profileData } = useProfileData();

  const fetchHiringFields = async () => {
    if (!profileData) {
      return;
    }
    const idToUse =
      profileData.role === "COMPANY" ? profileData.id : profileData.parent?.id;

    if (!idToUse) {
      return;
    }

    try {
      const response = await axios.get(
        `hiring-custom-fields/filter/stages?parentId=${idToUse}`
      );

      if (!response.data.error) {
        const stage = stageSteps(response.data);
        setColumns(stage);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching job applicant data:", error);
    }
  };

  useEffect(() => {
    if (profileData) {
      fetchCustomData();
      fetchHiringFields();
      fetchHiringProcess();
    }
  }, [profileData]);

  const navigate = useNavigate();

  const [dropdownOptions, setDropdownOptions] = useState({});
  const [loadedOptions, setLoadedOptions] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const handleDropdownOpen = async (id) => {
    if (loadedOptions[id]) return;

    try {
      const response = await axios.get(`custom-fields/by-custom-field/${id}`);
      if (!response.data.error) {
        const data = response?.data?.meta?.values || [];
        const enabledValues = data
          .filter((item) => item.enabled)
          .map((item) => ({ id: item.id, value: item.value }));
        setDropdownOptions((prev) => ({
          ...prev,
          [id]: ["All selected", ...enabledValues],
        }));
        if (!hiringProcessId) {
          setSelectedValues((prev) => ({
            ...prev,
            [id]: enabledValues,
          }));

          setLoadedOptions((prev) => ({
            ...prev,
            [id]: true,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching values:", error);
    }
  };

  const stageSteps = (data) => {
    const formatted = {};

    data.forEach((item) => {
      if (item.stage === "HIRED") {
        return;
      }

      let stageName = "";
      switch (item.stage) {
        case "NEW":
          stageName = "New";
          break;
        case "IN_REVIEW":
          stageName = "In-Review";
          break;
        case "INTERVIEW":
          stageName = "Interview";
          break;
        case "OFFER":
          stageName = "Offer";
          break;
        default:
          stageName = item.stage;
      }

      formatted[stageName] = item.customFields.map((field) => ({
        id: field.id,
        label: field.label,
      }));
    });

    return formatted;
  };
  const prepareCustomFieldsPayload = () => {
    const payload = [];

    customData.forEach((field) => {
      const fieldId = field.id;
      const selected = selectedValues[fieldId] || [];
      const options =
        dropdownOptions[fieldId]?.filter((opt) => opt !== "All selected") || [];

      const allSelected = selected.length === options.length;

      if (allSelected && !hiringProcessId) {
        payload.push({
          customFieldId: fieldId,
          selectAll: true,
        });
      } else {
        const valueIds = selected.map((selectedOption) => selectedOption.id);
        payload.push({
          customFieldId: fieldId,
          valueIds: valueIds,
          selectAll: false,
        });
      }
    });

    if (
      customData.length === Object.keys(selectedValues).length &&
      !hiringProcessId
    ) {
      payload.forEach((field) => {
        field.selectAll = false;
      });
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (!profileData) {
      return;
    }

    const idToUse =
      profileData.role === "COMPANY" ? profileData.id : profileData.parent?.id;

    if (!idToUse) {
      return;
    }

    const customFields = prepareCustomFieldsPayload();
    const payload = generatePayload(processName);

    const finalPayload = {
      ...payload,
      parentId: idToUse,
      customFields: customFields,
      type: "CUSTOM",
    };
    try {
      let response;

      if (hiringProcessId) {
        response = await axios.put(
          `hiring-custom-fields/hiring-process/${hiringProcessId}`,
          finalPayload
        );
      } else {
        response = await axios.post(
          "hiring-custom-fields/hiring-process",
          finalPayload
        );
      }
      if (!response.data.error) {
        toast.success("Hiring process saved successfully!");
      }
      toast.success("Created Hiring successfully");
      navigate(-1);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save hiring process."
      );
    }
  };

  const [selectedSteps, setSelectedSteps] = useState({});

  const handleAddStep = (columnKey, stepObj) => {
    setSelectedSteps((prevSelectedSteps) => {
      const currentColumnSteps = prevSelectedSteps[columnKey] || [];
      if (!currentColumnSteps.find((s) => s.id === stepObj.id)) {
        return {
          ...prevSelectedSteps,
          [columnKey]: [...currentColumnSteps, stepObj],
        };
      }
      return prevSelectedSteps;
    });
  };

  const handleRemoveStep = (columnKey, stepObj) => {
    setSelectedSteps((prevSelectedSteps) => ({
      ...prevSelectedSteps,
      [columnKey]: prevSelectedSteps[columnKey].filter(
        (s) => s.id !== stepObj.id
      ),
    }));
  };
  const [processName, setProcessName] = useState("");

  const generatePayload = (name) => {
    const stageFields = {};

    Object.keys(selectedSteps).forEach((stageKey) => {
      if (stageKey === "New") return;

      const steps = selectedSteps[stageKey] || [];
      stageFields[stageKey.toUpperCase().replace("-", "_")] = steps.map(
        (step, idx) => ({
          fieldId: step.id,
          sequence: idx,
        })
      );
    });

    return {
      name,
      stageFields,
    };
  };

  const fetchHiringProcess = async () => {
    if (!profileData) {
      return;
    }

    const idToUse =
      profileData.role === "COMPANY" ? profileData.id : profileData.parent?.id;
    if (!idToUse) {
      return;
    }

    if (hiringProcessId) {
      try {
        const response = await axios.get(
          `hiring-custom-fields/hiring-process/${hiringProcessId}`
        );
        if (!response.data.error) {
          const customFields = response.data.meta.hiringProcess.customFields;
          const formattedSelectedValues = {};

          customFields.forEach((field) => {
            if (field.customFieldId && Array.isArray(field.values)) {
              formattedSelectedValues[field.customFieldId] = field.values.map(
                (val) => ({
                  id: val.id,
                  value: val.value,
                })
              );
            }
          });

          setSelectedValues(formattedSelectedValues);
          setProcessName(response.data.meta.hiringProcess.name);
          const convertStageFieldsToStageSteps = (stageFields) => {
            return Object.entries(stageFields).map(([stage, customFields]) => ({
              stage,
              customFields,
            }));
          };

          const formatted = stageSteps(
            convertStageFieldsToStageSteps(
              response.data.meta.hiringProcess.stageFields
            )
          );

          setSelectedSteps(formatted);
        } else if (response.data.error) {
          toast("error", { description: response.data.message });
        }
      } catch (error) {
        console.error("Error fetching job applicant data:", error);
      }
    }
  };
  const [customLabel, setCustomLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const mapStageToApiValue = (stageLabel) => {
    switch (stageLabel) {
      case "New":
        return "NEW";
      case "In-Review":
        return "IN_REVIEW";
      case "Interview":
        return "INTERVIEW";
      case "Offer":
        return "OFFER";
      default:
        return stageLabel.toUpperCase().replace(/\s/g, "_");
    }
  };

  const handleCreateCustomStep = async (columnKey, label) => {
    if (!label.trim()) return;
    if (!profileData) {
      return;
    }

    const idToUse =
      profileData.role === "COMPANY" ? profileData.id : profileData.parent?.id;
    if (!idToUse) {
      return;
    }
    try {
      setCreating(true);
      const response = await axios.post("hiring-custom-fields/create", {
        stage: mapStageToApiValue(columnKey),
        label,
        fieldType: "CUSTOME",
        parentId: idToUse,
      });

      const newStep = {
        id: response.data.id || Date.now().toString(),
        label,
      };

      setSelectedSteps((prev) => ({
        ...prev,
        [columnKey]: [...(prev[columnKey] || []), newStep],
      }));

      setCustomLabel(""); // Clear input
    } catch (error) {
      console.error("Error creating custom step:", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopBar icon={Plus} title="Hiring Process" />
      <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white shadow-md">
        <div className="flex gap-4 items-center">
          <BackButton hidden />
          <h5 className="text-lg font-semibold">
            {hiringProcessId ? "Edit" : "Create"} Hiring Process ({processName})
          </h5>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-sm border-gray-300">
            Cancel
          </Button>
          <Button
            className="text-sm bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleSubmit()}
          >
            Save hiring process
          </Button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-md shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name*</label>
            <Input
              placeholder="Hiring process name"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
            />
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {Object.keys(columns).map((columnKey, colIdx) => (
              <div
                key={colIdx}
                className={`flex flex-col gap-3 ${
                  columnKey === "New" ? "w-20" : "flex-1"
                }`}
              >
                <div className="bg-blue-50 text-blue-700 font-medium rounded-md px-3 py-1.5 flex justify-between items-center text-sm">
                  <span>{columnKey}</span>

                  {columnKey !== "New" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-xs bg-white border rounded px-2 py-0.5 text-blue-600 hover:bg-blue-100">
                          + Add step
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96">
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            ...columns[columnKey].filter(
                              (stepObj) =>
                                !(selectedSteps[columnKey] || []).some(
                                  (selected) => selected.id === stepObj.id
                                )
                            ),
                            {
                              id: "custom",
                              label: "Create Custom",
                              isCustom: true,
                            },
                          ].map((stepObj) =>
                            stepObj.isCustom ? (
                              <Popover key="custom-create">
                                <PopoverTrigger asChild>
                                  <div className="bg-white p-3 rounded-md flex flex-col items-center gap-1 shadow-md border border-dashed border-blue-300 hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center rounded-full text-lg">
                                      ➕
                                    </div>
                                    <div className="text-center font-medium text-xs text-gray-800">
                                      {stepObj.label}
                                    </div>
                                    <button
                                      className="text-gray-400 hover:text-blue-500 text-xs mt-1"
                                      type="button"
                                    >
                                      + Create
                                    </button>
                                  </div>
                                </PopoverTrigger>

                                <PopoverContent className="w-64 p-4">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                      Step Label
                                    </label>
                                    <input
                                      type="text"
                                      value={customLabel}
                                      onChange={(e) =>
                                        setCustomLabel(e.target.value)
                                      }
                                      placeholder="Enter step name"
                                      className="border rounded px-3 py-1 text-sm w-full"
                                    />
                                    <button
                                      onClick={() =>
                                        handleCreateCustomStep(
                                          columnKey,
                                          customLabel
                                        )
                                      }
                                      disabled={creating}
                                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                      {creating ? "Creating..." : "Create Step"}
                                    </button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <div
                                key={stepObj.id}
                                className="bg-white p-3 rounded-md flex flex-col items-center gap-1 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                              >
                                <div className="w-8 h-8 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full text-lg">
                                  📄
                                </div>
                                <div className="text-center font-medium text-xs text-gray-800">
                                  {stepObj.label}
                                </div>
                                <button
                                  className="text-gray-400 hover:text-blue-500 text-xs mt-1"
                                  onClick={() =>
                                    handleAddStep(columnKey, stepObj)
                                  }
                                >
                                  + Add
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <div
                  className={`${
                    columnKey === "New"
                      ? "flex flex-col gap-2"
                      : "grid grid-cols-2 md:grid-cols-4 gap-2"
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {(selectedSteps[columnKey] || []).map((stepObj, stepIdx) => (
                    <div
                      key={stepObj.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          "text/plain",
                          JSON.stringify({ stepIdx, columnKey })
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const { stepIdx: fromIdx, columnKey: fromColumn } =
                          JSON.parse(e.dataTransfer.getData("text/plain"));
                        if (fromColumn === columnKey && fromIdx !== stepIdx) {
                          const updated = [...selectedSteps[columnKey]];
                          const [movedItem] = updated.splice(fromIdx, 1);
                          updated.splice(stepIdx, 0, movedItem);

                          setSelectedSteps((prev) => ({
                            ...prev,
                            [columnKey]: updated,
                          }));
                        }
                      }}
                    >
                      <StepCard
                        title={stepObj.label}
                        index={stepIdx}
                        columnKey={columnKey}
                        handleRemove={() =>
                          handleRemoveStep(columnKey, stepObj)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customData.map((label, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium mb-1">
                  {label.label}*
                </label>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  onOpen={() => handleDropdownOpen(label.id)}
                  options={dropdownOptions[label.id] || []}
                  value={
                    selectedValues[label.id]?.length ===
                    (dropdownOptions[label.id]?.filter(
                      (o) => o !== "All selected"
                    ).length || 0)
                      ? ["All selected", ...selectedValues[label.id]]
                      : selectedValues[label.id] || ["All selected"]
                  }
                  onChange={(_, value) => {
                    const options = dropdownOptions[label.id] || [];
                    const allOptions = options.filter(
                      (opt) => opt !== "All selected"
                    );

                    const previouslySelected = selectedValues[label.id] || [];
                    const isAllSelectedClicked =
                      value.includes("All selected") &&
                      !previouslySelected.includes("All selected");

                    if (isAllSelectedClicked) {
                      setSelectedValues((prev) => ({
                        ...prev,
                        [label.id]: allOptions,
                      }));
                    } else if (
                      previouslySelected.length === allOptions.length &&
                      !value.includes("All selected")
                    ) {
                      setSelectedValues((prev) => ({
                        ...prev,
                        [label.id]: [],
                      }));
                    } else {
                      const cleaned = value.filter((v) => v !== "All selected");
                      setSelectedValues((prev) => ({
                        ...prev,
                        [label.id]: cleaned,
                      }));
                    }
                  }}
                  renderOption={(props, option) => {
                    const allOptions =
                      dropdownOptions[label.id]?.filter(
                        (o) => o !== "All selected"
                      ) || [];
                    const allSelected =
                      selectedValues[label.id]?.length === allOptions.length;

                    const isChecked =
                      option === "All selected"
                        ? allSelected
                        : selectedValues[label.id]?.some(
                            (selectedOption) => selectedOption.id === option.id
                          );

                    return (
                      <li {...props}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          style={{ marginRight: 8 }}
                          readOnly
                        />
                        {option === "All selected"
                          ? "Select All"
                          : option.value}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      variant="outlined"
                      placeholder={`Select ${label.label}`}
                    />
                  )}
                  getOptionLabel={(option) =>
                    option === "All selected" ? "All" : option.value
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
