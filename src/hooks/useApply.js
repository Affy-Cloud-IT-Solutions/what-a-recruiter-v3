import { useState } from "react";
import axios from "axios";

const useApplyToJob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const applyToJob = async (jobApplyDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/job-applications/apply", jobApplyDto);
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    applyToJob,
    loading,
    error,
    response,
  };
};

export default useApplyToJob;
