// hooks/useCustomFieldOptions.js
import axios from "axios";
import { useEffect, useState } from "react";

export const useCustomFieldOptions = (customFieldId) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customFieldId) return;

    const fetchOptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("custom-fields/child-fields-and-values", {
          params: {
            customFieldId,
            valueId: "", // if needed, add dynamic valueId
          },
        });
        console.log(res.data, "custom field values");
        setOptions(res.data?.values || []);
      } catch (err) {
        console.error("Error fetching options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [customFieldId]);

  return { options, loading };
};
