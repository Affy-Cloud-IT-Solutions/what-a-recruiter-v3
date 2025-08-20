import Navbar from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useJobs from "@/hooks/use-jobs-all";
import { Loader } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CareersPage = () => {
  const { jobs, loading, error } = useJobs();
  return (
    <>
      <Navbar />
      <section className="py-20 bg-gray-50 text-gray-800" id="careers">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Join Our Team</h2>
          <p className="text-center text-gray-600 mb-10">
            We're always looking for creative, talented people to join our team.
          </p>

          {loading ? (
            <div className="text-center py-20 text-lg flex justify-center items-center text-gray-500">
              <Loader className="animte-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              Failed to load jobs. Please try again later.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <JobCard key={index} job={job} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-2">
              Don’t see the role you’re looking for?
            </p>
            <a
              href="mailto:careers@example.com"
              className="text-blue-600 hover:underline"
            >
              Send us your resume
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default CareersPage;

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <Card className="hover:shadow-md transition rounded-2xl p-0 pt-4">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="">
          <h3 className="!text-xl capitalize font-bold text-gray-800">
            {job.jobTitle}
          </h3>
          <p className="text-sm text-gray-500 mb-2">Job Code: {job.jobCode}</p>
          <div
            className="text-gray-700 mb-3 text-xs line-clamp-3 "
            dangerouslySetInnerHTML={{ __html: job.jobDescription }}
          />
          <div className="text-gray-600 space-y-1 mb-4 text-xs">
            <p>
              <span className="font-semibold">Location:</span> {job.jobLocation}
            </p>
            <p className="flex gap-2">
              <span className="font-semibold">Qualification:</span>{" "}
              <span
                dangerouslySetInnerHTML={{ __html: job.jobQualification }}
              />
            </p>
            <p className="flex gap-2">
              <span className="font-semibold">Info:</span>{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: job.jobAdditionalInformation,
                }}
              />
            </p>
          </div>
        </div>
        <div className="mt-auto text-right">
          <Button onClick={() => navigate(`/careers/${job.parentId}`)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
