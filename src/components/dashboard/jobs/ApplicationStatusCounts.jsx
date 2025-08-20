import { Card, CardContent } from "@/components/ui/card";
import React from "react";

// Define color styles for each status
const statusColors = {
  PENDING: "bg-amber-100 text-amber-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  INTERVIEW: "bg-blue-100 text-blue-800",
  OFFERED: "bg-purple-100 text-purple-800",
  HIRED: "bg-green-100 text-green-800",
};

// Define display labels for selected statuses
const statusLabels = {
  PENDING: "Pending",
  // IN_REVIEW: "In Review",
  INTERVIEW: "Interview",
  // OFFERED: "Offered",
  HIRED: "Hired",
};

const ApplicationStatusCounts = ({ counts }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
      {Object.entries(counts).map(([key, value]) => {
        // Only render statuses that have labels defined
        if (!statusLabels[key]) return null;

        return (
          <div
            key={key}
            className={`rounded-full text-[10px] flex items-center h-fit w-fit pe-2 ${statusColors[key]}`}
          >
            <div className="px-3 py-1">{statusLabels[key]}</div>
            <span>{value}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationStatusCounts;
