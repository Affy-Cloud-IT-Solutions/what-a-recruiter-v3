import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import { useProfileData } from "./use-fetch-profile";
import { jwtDecode } from "jwt-decode";

// 1. Create Offer Template (POST /offer-templates)
// hooks/useUploadOfferTemplate.js
const token = localStorage.getItem("token");
const user = token && jwtDecode(token);
export const useUploadOfferTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadTemplate = useCallback(async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `/offer-latter/offer-templates?parentId=${
          !user?.claims?.parent
            ? user.claims.id
            : user?.claims?.parent?.parentId
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadTemplate, loading, error };
};

// 2. Update Offer Template (PUT /offer-templates/{templateId})
export const useUpdateOfferTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTemplate = useCallback(async (templateId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(
        `/offer-latter/offer-templates/${
          !user?.claims?.parent
            ? user.claims.id
            : user?.claims?.parent?.parentId
        }`,
        updatedData
      );
      return res.data;
    } catch (err) {
      setError(err);
      console.error("Error updating offer template:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTemplate, loading, error };
};

// 3. Fetch Templates by Parent ID (GET /offer-templates/by-parent/{parentId})
export const useFetchTemplatesByParent = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const { profileData } = useProfileData()
  // c;

  console.log(user);
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `offer-latter/offer-templates/by-parent/${
          !user?.claims?.parent
            ? user.claims.id
            : user?.claims?.parent?.parentId
        }`
      );
      setTemplates(res.data.meta.templates);
    } catch (err) {
      setError(err);
      console.error("Error fetching templates by parent:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // if (!parentId) return;

    fetchTemplates();
  }, []);

  return { templates, loading, error, fetchTemplates };
};
