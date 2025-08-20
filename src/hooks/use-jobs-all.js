import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { baseURL } from "@/App";

const useJobs = () => {
  // const [jobs, setJobs] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  const fetchJobs = async (url) => {
    try {
      const response = await axios.get(url);

      return response.data || [];
    } catch (err) {
      //       setError(err.response?.data?.message || "Failed to fetch jobs");
      console.log(err);
      //     } finally {
      //       setLoading(false);
    }
  };

  //   fetchJobs();
  // }, []);

  const {
    data: jobs,
    error,
    isLoading: loading,
  } = useSWR(baseURL + "/job/all", fetchJobs);

  return { jobs, loading, error };
};

export default useJobs;
