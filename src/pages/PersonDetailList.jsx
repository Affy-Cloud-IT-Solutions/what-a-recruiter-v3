import React, { useState } from "react";
import axios from "axios";

export default function PersonDetailList() {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/pdl-search", {
        "job title": jobTitle,
        skills: skills.split(",").map((s) => s.trim()),
        location_country: "India",
        size: 10,
      });
      setResults(response.data);
    } catch (err) {
      setError("Failed to fetch person details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Search Person Details</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block font-semibold">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. Software Engineer"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">
            Skills (comma separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. React, Node.js"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="mt-6">
        {results.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-2">Results:</h3>
            <ul className="space-y-2">
              {results.map((person, idx) => (
                <li
                  key={idx}
                  className="p-4 border rounded bg-gray-50 shadow-sm"
                >
                  <p>
                    <strong>Name:</strong> {person.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {person.email}
                  </p>
                  <p>
                    <strong>Skills:</strong> {person.skills?.join(", ")}
                  </p>
                  <p>
                    <strong>Location:</strong> {person.location}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
