import { jwtDecode } from "jwt-decode";
// import { useProfileData } from "./use-fetch-profile";
import useSWR from "swr";
import { baseURL } from "@/App";
import axios from "axios";

export const useGetJobs = () => {
  // const { profileData } = useProfileData();

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const { id, role } = decodedToken.claims;
  console.log(decodedToken);
  const endpoint =
    role === "COMPANY"
      ? `job/byParent/${id}`
      : role === "ADMIN" || role === "EMPLOYEE" || role == "RECRUITER"
      ? `job/byParent/${decodedToken.claims.parent.id}`
      : `/job/jobs/by-recruiter-or-creator/${id}`;
  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url);
      return data.meta;
    } catch (error) {
      console.log(error);
    }
  };
  const {
    data: jobs,
    error,
    isLoading: loading,
  } = useSWR(baseURL + "/" + endpoint, fetcher);
  console.log(jobs, "jobs");
  // const [jobs, setJobs] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  // console.log(token);
  // const getJobs = useCallback(
  //   async (toast) => {
  //     if (!token) {
  //       setError("No authentication token found");
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const decodedToken = jwtDecode(token);
  //       console.log(decodedToken, "decoded token");
  //       const { id, role } = decodedToken.claims;

  //       if (!id || !role) {
  //         throw new Error("Invalid token structure");
  //       }

  //       if (role === "ADMIN" && !profileData?.parent?.id) {
  //         setError("Waiting for profile data");
  //         setLoading(false);
  //         return;
  //       }

  //       const endpoint =
  //         role === "COMPANY"
  //           ? `job/byParent/${id}`
  //           : role === "ADMIN" || role === "EMPLOYEE" || role == "RECRUITER"
  //           ? `/job/byParent/${profileData.parent.id}`
  //           : `/job/jobs/by-recruiter-or-creator/${id}`;

  //       const { data } = await axios.get(endpoint);

  //       if (data?.error === "false") {
  //         setJobs(data?.meta || []);
  //         setError(null);
  //       } else {
  //         throw new Error(data?.message || "Unknown error occurred");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching jobs:", err);
  //       setError(err?.response?.data?.message || err.message);
  //       setJobs([]);
  //       toast &&
  //         toast("Failed to fetch jobs", {
  //           description: err?.response?.data?.message || "An error occurred",
  //           variant: "destructive",
  //         });
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [profileData] // keep minimal and stable
  // );

  // useEffect(() => {
  //   if (token && (profileData || jwtDecode(token).claims?.role !== "ADMIN")) {
  //     getJobs();
  //   }
  // }, [getJobs, profileData]);

  return { jobs, error, loading };
};
