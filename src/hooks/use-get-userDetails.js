import { useState } from "react";
import axios from "axios";
import { aiBaseUrl } from "@/App";

export const useGithubUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const fetchUserDetails = async ({ username }) => {
    setLoadingDetails(true);
    setDetailsError(null);
    try {
      const response = await axios.get(aiBaseUrl + "get-github-user-details", {
        params: { username },
        // headers: {
        //   Authorization: token ? `Bearer ${token}` : undefined,
        // },
      });
      setUserDetails(response.data);
    } catch (error) {
      setDetailsError(
        error.response?.data?.message ||
          error.message ||
          "Error fetching details"
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  return { fetchUserDetails, userDetails, loadingDetails, detailsError };
};
