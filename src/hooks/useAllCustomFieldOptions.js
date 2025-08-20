import axios from "axios";
import { useEffect, useState } from "react";

export const useAllCustomFieldOptions = (fieldMappings = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);

      const results = await Promise.all(
        fieldMappings.map(async (field) => {
          const options = await getOptionsForCustomField(field.customFieldId);
          return {
            ...field,
            options,
          };
        })
      );

      setData(results);
      setLoading(false);
    };

    if (fieldMappings.length > 0) {
      loadOptions();
    }
  }, [JSON.stringify(fieldMappings)]); // include stable dependency

  return {
    loading,
    data, // contains field info + options
  };
};

// apiClient should already be your Axios instance
export const getOptionsForCustomField = async (customFieldId) => {
  try {
    const response = await axios.get(`/custom-fields/child-fields-and-values`, {
      params: {
        customField: customFieldId,
      },
    });
    return response.data?.options || []; // Ensure fallback if no options
  } catch (error) {
    console.error("Error fetching options:", error);
    return [];
  }
};
