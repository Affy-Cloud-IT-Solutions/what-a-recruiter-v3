import { Plus, Grid, List } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import TopBar from "@/components/dashboard/dashboard-header";
import JobList from "@/components/dashboard/jobs/grid-jobs";
import JobListTable from "@/components/dashboard/jobs/job-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/ui/loader";
import { useGetJobs } from "@/hooks/use-get-jobs";

const Jobs = () => {
  const { jobs, loading, error } = useGetJobs();
  const [isGrid, setIsGridView] = useState(
    JSON.parse(localStorage.getItem("isGrid") || "false")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("date-desc"); // Default: latest to oldest

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const handleSetIsGridView = () => {
    localStorage.setItem("isGrid", JSON.stringify(!isGrid));
    setIsGridView((prev) => !prev);
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="p-4 text-center text-red-600">Error: {error.message}</div>
    );

  // Filter & sort without useMemo:
  let filteredJobs = [...jobs];

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(q) ||
        job.jobLocation.toLowerCase().includes(q) ||
        job.recruiterAssigned?.name?.toLowerCase().includes(q)
    );
  }

  // Status filter
  if (statusFilter !== "ALL") {
    filteredJobs = filteredJobs.filter(
      (job) => job.applicationStatusCounts?.[statusFilter] > 0
    );
  }

  // Sort by selected option
  filteredJobs.sort((a, b) => {
    switch (sortOption) {
      case "title-asc":
        return a.jobTitle.localeCompare(b.jobTitle);
      case "title-desc":
        return b.jobTitle.localeCompare(a.jobTitle);
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "date-desc":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <TopBar />
      <div className="px-4 py-1 border-b  bg-white shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2 overflow-auto p-2">
          <h2 className="text-xl md:text-xl font-bold whitespace-nowrap">
         { `Jobs (${currentJobs && currentJobs.length})`}
          </h2>

          <Input
            placeholder="Search by title, location or recruiter..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[200px]"
          />

          <Select
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            value={statusFilter}
          >
            <SelectTrigger className="w-36">
              <SelectValue>
                {statusFilter === "ALL" ? "All Statuses" : statusFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="INTERVIEW">Interview</SelectItem>
              <SelectItem value="OFFERED">Offered</SelectItem>
              <SelectItem value="HIRED">Hired</SelectItem>
            </SelectContent>
          </Select>

          {/* Combined Sort Dropdown */}
          <Select
            onValueChange={(value) => {
              setSortOption(value);
              setCurrentPage(1);
            }}
            value={sortOption}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title: A to Z</SelectItem>
              <SelectItem value="title-desc">Title: Z to A</SelectItem>
              <SelectItem value="date-desc">Date: New to Old</SelectItem>
              <SelectItem value="date-asc">Date: Old to New</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {[
            "EMPLOYEE",
            "COMPANY",
            "ADMIN",
            "RECRUITMENT_MANAGER",
            "RECRUITER",
          ].includes(role || "") && (
              <Button asChild>
                <Link to="create-jobs" className="flex items-center gap-2">
                  <Plus /> Create Job
                </Link>
              </Button>
            )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleSetIsGridView}>
                  {isGrid ? (
                    <Grid className="h-5 w-5" />
                  ) : (
                    <List className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isGrid ? "Switch to List View" : "Switch to Grid View"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {currentJobs && (
        <div className="mt-6">
          {!isGrid ? <JobList jobs={currentJobs} /> : <JobListTable jobs={currentJobs} />}
        </div>
      )}

      <div className="flex flex-col items-center mt-10 pb-8 gap-3 zoom-out">
        <div className="text-gray-600 text-sm">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Jobs;
