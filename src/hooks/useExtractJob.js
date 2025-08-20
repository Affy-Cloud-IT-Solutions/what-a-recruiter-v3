import axios from "axios";
import { useEffect, useState } from "react";

export const useExtractJob = ({ companyId, jobId, topApplicants }) => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExtractJob = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (companyId) params.companyId = companyId;
      if (jobId) params.jobId = jobId;
      if (topApplicants) params.topApplicants = topApplicants;

      const res = await axios.get("/job/extract", { params });
      setJobData(res.data?.meta || null);
      console.log(res.data.meta);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId || companyId || topApplicants) {
      fetchExtractJob();
    }
  }, [jobId, companyId, topApplicants]);

  return { jobData, loading, error, refetch: fetchExtractJob };
};
