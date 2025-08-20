import React, { useState, useEffect } from "react";
import { ArchiveIcon, CloudUploadIcon, EditIcon, MoveLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TopBar from "@/components/dashboard/dashboard-header";
import { ReusableInput } from "@/components/ui/reusable-input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { token } from "../../lib/utils";

const CreateJobFields = () => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    type: "SELECT",
    category: "JOB",
    visibility: "INTERNAL",
    required: false,
  });
  const { create } = useParams();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      required: e.target.checked,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const createdBy = decodedToken?.claims?.id;

    const updatedFormData = {
      ...formData,
      parentId: createdBy,
      options: [],
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      if (create === "create") {
        await axios.post("custom-fields/create", updatedFormData, config);
        toast.success("Successfully created");
      } else {
        await axios.put(`custom-fields/${create}`, updatedFormData, config);

        toast.success("Successfully updated");
        navigate(-1);
      }

      // navigate(-1); // uncomment if navigation is needed after submission
    } catch (error) {
      console.log(error);
      toast.success("error while submitting updated");
    } finally {
      setLoading(false);
    }
  };

  const [values, setValues] = useState([]);
  const fetchCustomDataById = async () => {
    try {
      const response = await axios.get(
        `custom-fields/by-custom-field/${create}`
      );

      if (!response.data.error) {
        setValues(response.data.meta.values);
        setFields(response.data.meta);
        const customField = response.data.meta.customField;
        setFormData({
          label: customField.label || "",
          type: customField.type || "SELECT",
          category: customField.category || "JOB",
          visibility: customField.visibility || "INTERNAL",
          required: customField.required ?? false,
        });
        if (response.data.meta.parent !== null) {
          fetchDependencyData(response.data.meta.parent.id);
        }
      } else if (response?.data.error) {
        toast.error(`${response?.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
      if (error.response && error.response.status === 404) {
        navigate(-1);
        toast.error(`the file not found`);
      }
    } finally {
    }
  };

  const [parentValue, setParentValue] = useState([]);
  const [childValue, setChildValue] = useState([]);
  const [selectedParent, setselectedParent] = useState(null);

  const fetchDependencyData = async (id) => {
    try {
      const response = await axios.get(
        `custom-fields/values?customFieldId=${id}`
      );

      if (!response.data.error) {
        setParentValue(response.data.meta.values);
        setselectedParent(response.data.meta.values[0].id);
        fetchDependencyValue(id, response.data.meta.values[0].id);
      } else if (response?.data.error) {
        toast.error(`${response?.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
      if (error.response && error.response.status === 404) {
        navigate(-1);
        toast.error("Data Not Found");
      }
    } finally {
    }
  };

  const fetchDependencyValue = async (parentid, valueId) => {
    setselectedParent(valueId);
    try {
      const response = await axios.get(
        `custom-fields/values?customFieldId=${parentid}&valueId=${valueId}`
      );

      if (!response.data.error) {
        const createField = response.data.meta.childFields.find(
          (field) => field.id === create
        );
        // setChildValue(response.data.meta.childFields[0].values);
        if (createField) {
          setChildValue(createField.values);
        } else {
          console.warn("No childField found with id === 'create'");
        }
      } else if (response?.data.error) {
        toast(`${response?.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
      if (error.response && error.response.status === 404) {
        navigate(-1);
        toast.error("Data Not Found");
      }
    } finally {
    }
  };
  const toggleChildValue = async (childValueId) => {
    try {
      const response = await axios.post(`custom-fields/assign-parent-value`, {
        childValueId: childValueId,
        parentValueId: selectedParent,
      });

      if (!response.data.error) {
        toast.success(`${response?.data.message}`);
        fetchDependencyValue(fields.parent.id, selectedParent);
      } else if (response?.data.error) {
        toast.error(`${response?.data.message}`);
      }
    } catch (error) {
      console.error("Error assigning parent value:", error);
      if (error.response && error.response.status === 404) {
        navigate(-1);
        toast.error("Data Not Found");
      }
    }
  };

  useEffect(() => {
    if (create !== "create") {
      fetchCustomDataById();
    }
  }, [create]);

  return (
    <>
      <TopBar title="Create Job Fields" icon={CloudUploadIcon} back={true} />
      <div className="flex justify-between flex-col px-6 mb-5">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-grow-1 flex-col" style={{ height: "100%" }}>
            <div className="my-4 ">
              <h2 className="text-xl flex items-center gap-4 font-semibold text-gray-600 mb-6">
                Field Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Name
                  </label>
                  <ReusableInput
                    name="label"
                    placeholder="Enter field name"
                    onChange={handleChange}
                    value={formData.label}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    style={{ width: "100%" }}
                  >
                    <option value="SELECT">Single Select</option>
                    <option value="TEXT">Free Text</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    style={{ width: "100%" }}
                  >
                    <option value="JOB">Job</option>
                    <option value="ORG">Org</option>
                  </select>
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    required
                    style={{ width: "100%" }}
                  >
                    <option value="INTERNAL">Internal</option>
                    <option value="PUBLIC">Public</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex items-center">
                  <input
                    id="required"
                    type="checkbox"
                    checked={formData.required}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-950 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="required"
                    className="ml-2 text-xs text-gray-700 font-medium"
                  >
                    Required Field
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className=" flex items-center justify-end gap-5 mx-6">
            <Button type="submit" disabled={loading}>
              {!loading
                ? create === "create"
                  ? "Create"
                  : "Save"
                : "Processing..."}
            </Button>
          </div>
        </form>

        {create !== "create" && (
          <div>
            <div>
              <h3>Fields Values</h3>
              <div className="mt-6 border-t border-gray-200 rounded-md overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-6 py-3 flex items-center font-medium text-sm text-gray-600">
                  <div className="flex-1">Value name</div>
                  <div className="w-20 text-right">Actions</div>
                </div>

                {values?.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center px-6 py-4 text-sm ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex-1 font-medium text-gray-800">
                      {item.value}
                    </div>
                    <div className="w-20 flex items-center justify-end gap-2 text-gray-500">
                      <EditIcon
                        className="hover:text-blue-600 cursor-pointer transition"
                        fontSize="small"
                      />
                      <ArchiveIcon
                        className="hover:text-red-500 cursor-pointer transition"
                        fontSize="small"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {fields?.parent && (
              <div className="mt-4">
                <h3 className="text-base font-normal mb-4">
                  Field dependencies
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-normal mb-2">
                      Parent field values:{" "}
                      <span className="font-normal">
                        {fields?.parent?.label}
                      </span>
                    </h4>
                    <div className="border rounded shadow-sm">
                      <div className="border-b p-2">
                        <input
                          type="text"
                          placeholder="Search value"
                          className="w-full p-2 text-sm border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {parentValue.map((company, index) => (
                          <div
                            key={index}
                            className={`p-2 text-sm hover:bg-gray-100 cursor-pointer ${
                              company.id === selectedParent
                                ? "bg-gray-100 font-normal flex justify-between items-center"
                                : ""
                            }`}
                            onClick={() =>
                              fetchDependencyValue(
                                fields?.parent?.id,
                                company.id
                              )
                            }
                          >
                            {company.value}
                            {company.id === selectedParent && (
                              <span className="text-base">&rarr;</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Child field values: Business Unit */}
                  <div>
                    <h4 className="text-sm font-normal mb-2">
                      Child field values:{" "}
                      <span className="font-normal">
                        {fields?.customField?.label}
                      </span>
                    </h4>
                    <div className="border rounded shadow-sm">
                      <div className="border-b p-2">
                        <input
                          type="text"
                          placeholder="Search value"
                          className="w-full p-2 text-sm border rounded focus:outline-none focus:ring focus:border-blue-300"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto p-2 space-y-2 text-sm">
                        {/* <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      Select all {(childValue?.length)}
                    </label>
                    <hr /> */}
                        {childValue?.map((item, index) => (
                          <label
                            key={index}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onClick={() => toggleChildValue(item.id)}
                            />
                            {item.value}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CreateJobFields;
