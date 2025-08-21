// src/hooks/useCandidateById.js or .ts
import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { baseURL } from "@/App";

const useApplicantById = (id) => {
  // const [candidate, setCandidate] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   if (!id) return;

  //   const fetchCandidate = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`job-applications/${id}`);
  //       setCandidate(response.data.meta);
  //       setError(null);
  //     } catch (err) {
  //       setError(err);
  //       setCandidate(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCandidate();
  // }, [id]);

  const fetcher = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data.meta;
    } catch (err) {
      // setError(err);
      // setCandidate(null);
      console.log(err);
    }
  };
  const {
    data: candidate,
    error,
    isLoading: loading,
    mutate
  } = useSWR(`${baseURL}/job-applications/${id}`, fetcher);

  return { candidate, loading, error ,mutate};
};

export default useApplicantById;
