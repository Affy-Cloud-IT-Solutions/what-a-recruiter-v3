import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const useProfileData = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken?.claims?.role;
        const id = decodedToken?.claims?.id;

        let endpoint;
        if (role === "COMPANY") {
          endpoint = `company/${id}`;
        } else if (role === "RECRUITER") {
          endpoint = `recruiter/${id}`;
        } else if (role === "EMPLOYEE") {
          endpoint = `employee/${id}`;
        } else if (role === "ADMIN") {
          endpoint = `admin/${id}`;
        } else {
          throw new Error("Invalid role");
        }

        const response = await axios.get(endpoint);
        setProfileData(response.data.meta);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching profile data.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return { profileData, loading, error };
};
