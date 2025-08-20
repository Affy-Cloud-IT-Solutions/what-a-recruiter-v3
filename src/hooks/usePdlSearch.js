import { useState, useEffect } from "react";
import axios from "axios";
import { aiBaseUrl } from "@/App";

const usePdlSearch = (searchParams) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchParams) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(searchParams);
        const response = await axios.post(
          aiBaseUrl + "pdl-search",
          searchParams,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  return { data, loading, error };
};

export default usePdlSearch;
