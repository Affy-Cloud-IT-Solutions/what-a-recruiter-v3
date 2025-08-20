import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useAssignTemplateToField = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const assignTemplate = async (processId, fieldId, templateId) => {
    console.log(processId, fieldId, templateId, "foreign minister");

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        "template/processes/assign-template-to-field",
        {
          processId,
          fieldId,
          templateId,
        }
      );
      toast.success("assigning Template To field");
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to assign template to field"
      );
    } finally {
      setLoading(false);
    }
  };

  return { assignTemplate, loading, error, success };
};

export default useAssignTemplateToField;
