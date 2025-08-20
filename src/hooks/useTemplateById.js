import { useState, useEffect } from "react";
import axios from "axios";

const useTemplateById = (id) => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`template/${id}`);
        setTemplate(response.data);
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  return { template, loading, error };
};

export default useTemplateById;
