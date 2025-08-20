import TopBar from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Copy, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const InterviewTemplatePage = () => {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get("template");

      setTemplates(res.data || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar back={true} title={"Interview Templates"} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Interview templates</h2>

          <Button
            asChild
            //   onClick={() => }
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <Link to={"create"}>Add template</Link>
          </Button>
        </div>

        <input
          type="text"
          placeholder="Search templates"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <div className="bg-white shadow rounded">
          <div className="grid grid-cols-3 p-3 font-semibold border-b">
            <span>Template name</span>
            <span>Hiring step</span>
            <span className="text-right">Actions</span>
          </div>

          {filteredTemplates.map((template, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center p-3 border-b hover:bg-gray-50"
            >
              <div>
                <div className="font-medium">{template.name}</div>
                <div className="text-xs bg-gray-200 inline-block mt-1 px-2 py-0.5 rounded">
                  Default
                </div>
              </div>
              <div>
                <div>{template.hiringStep}</div>
                <div className="text-xs text-gray-500">Interview</div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => alert("Copy clicked")}>
                  <Copy />
                </button>
                <button onClick={() => navigate(`${template.id}/edit`)}>
                  <Pencil />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InterviewTemplatePage;
