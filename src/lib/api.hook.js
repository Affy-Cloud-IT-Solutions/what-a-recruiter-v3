// /api/hiring-custom-fields/filter/stages
// hooks/useHiringStages.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useHiringStages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/hiring-custom-fields/filter/stages");
      setStages(response.data || []);
      setError(null);
    } catch (err) {
      setError(err);
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  return { stages, loading, error, refetch: fetchStages };
}

export const useCompanyTemplates = (id) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "template/company-templates?parentId=" + id
        );
        setTemplates(response.data, "Response comhpany template ");
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
};
