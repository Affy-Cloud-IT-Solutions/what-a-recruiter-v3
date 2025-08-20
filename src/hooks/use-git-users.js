import { useState } from "react";
import axios from "axios";
import { aiBaseUrl } from "@/App";

export const useGithubUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async ({ language, location, per_page, page, token }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${aiBaseUrl}search_github_users`, {
        params: { language, location, per_page, page, token },
      });
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { fetchUsers, users, loading, error };
};
