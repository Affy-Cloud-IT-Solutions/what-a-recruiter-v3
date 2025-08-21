import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

const JobListTable = ({ jobs }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(2);
  return (
    <div className="px-4  ">
      <Table className="w-full border rounded-lg" title={`Jobs (${jobs.length})`} description={"All jobs list"}>
        <TableHeader className="bg-gray-100 text-gray-700 font-semibold">
          <TableRow>
            <TableHead className="px-6 py-3">#Job Code</TableHead>
            <TableHead className="px-6 py-3">Position</TableHead>
            <TableHead className="px-6 py-3">Date</TableHead>
            <TableHead className="px-6 py-3">Email</TableHead>
            <TableHead className="px-6 py-3">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs?.map((job, index) => (
            <TableRow
              key={job.id}
              className="border-b cursor-pointer"
              onClick={() => navigate(`job-profile/${job.id}`)}
            >
              <TableCell className="px-6 py-3">#{job?.jobCode}</TableCell>
              <TableCell className="px-6 py-3">{job?.jobTitle}</TableCell>
              <TableCell className="px-6 py-3">
                {new Date(job?.createdAt).toLocaleDateString()}{" "}
              </TableCell>
              <TableCell className="px-6 py-3">
                {job?.createdBy.email}
              </TableCell>
              <TableCell className="px-6 py-3">{job?.jobLocation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <div className="flex justify-center mt-4">
        <Pagination total={3} current={2} /> */}
    </div>
    // </div>
  );
};

export default memo(JobListTable);
