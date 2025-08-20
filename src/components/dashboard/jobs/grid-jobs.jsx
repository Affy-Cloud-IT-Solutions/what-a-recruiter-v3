import { timeAgo } from "@/lib/formatDate";
import { memo } from "react";
import { FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";
import ApplicationStatusCounts from "./ApplicationStatusCounts";
// import { Badge } from "@mui/material";

const JobList = ({ jobs }) => {
  return (
    <div className="flex min-h-[calc(100vh-100px)] zoom-out mb-12 md:mb-0">
      <div className="flex-1 ">
        <div className=" px-4">
          {jobs.length == 0 && (
            <div className="flex items-center w-full min-h-[70vh] justify-center ">
              <h3>No Jobs Available</h3>
            </div>
          )}
          <div className="grid grid-cols-1 mb-4 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {jobs &&
              jobs?.map((job) => (
                <Link to={"job-profile/" + job.id} className="h-full">
                  <div
                    key={job.id}
                    className="bg-white p-4 shadow-md rounded-lg border hover:shadow-lg cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <h2 className="text-lg md:text-lg font-semibold text-primary-900 capitalize">
                        {job.jobTitle}
                      </h2>
                      <div className="inline-flex items-center rounded-md border border-gray-300 bg-muted px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mt-1 md:mt-0">
                        #{job?.jobCode}
                      </div>
                    </div>
                    <ApplicationStatusCounts
                      counts={job.applicationStatusCounts}
                    />
                    {/* <div className=" border-gray-300 bg-muted px-2.5 py-0.5 text-xs w-fit font-medium text-gray-700 mt-1 md:mt-0">{job.recruiterAssigned.name}</div> */}

                    {/* Job Description */}
                    <div
                      className="line-clamp-1 font-normal text-sm text-blue-950/80 my-2 "
                      dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                    />

                    {/* Created Time */}
                    <div className="flex items-center text-gray-500 text-xs mt-3 gap-1">
                      <FaRegClock className="mr-1" />
                      Created {timeAgo(job?.createdAt)}
                    </div>

                    {/* Location and More Details */}
                    <div className="flex flex-wrap items-center text-gray-500 text-xs mt-2 justify-between">
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="mr-1" />
                        {job?.jobLocation}, {job?.country}
                      </div>
                      {/* <div className="text-primary-600 flex text-sm underline gap-1 items-center">
                        More Details <MdArrowOutward />
                      </div> */}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(JobList);
