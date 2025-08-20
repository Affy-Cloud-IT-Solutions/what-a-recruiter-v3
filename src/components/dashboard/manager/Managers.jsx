import { SquareKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import TopBar from "../dashboard-header";
import ManagerTable from "./manager-table";
import toast from "react-hot-toast";
import useSWR from "swr";

const token = localStorage.getItem("token");
const userData = token && jwtDecode(token);

const fetcher = async (url) => {
  const res = await axios.get(url);
  if (!res.data || res.data.error) {
    throw new Error(res.data?.message || "Fetch error");
  }
  return res.data.meta;
};

const Managers = () => {
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const endpoint = `/recruiter/page/parent/${userData.claims?.id}?page=${currentPage}&size=${pageSize}`;
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher);

  const managers = data?.employees ?? [];
  const totalPages = data?.totalPages ?? 1;

  const goToPage = (page) => setCurrentPage(page);
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="me-md-3">
      <TopBar icon={SquareKanban} title={"Recruiters"} />

      <div className="flex w-full gap-4 p-4 items-center justify-between">
        <div className="flex gap-2">
          {/* Optional filters (static for now) */}
          <select className="form-select rounded-3">
            <option>Job Shows</option>
          </select>
          <select className="form-select rounded-3">
            <option>Department</option>
          </select>
          <select className="form-select rounded-3">
            <option>Location</option>
          </select>

          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>

        <Button onClick={() => navigate("create")}>Create Recruiter</Button>
      </div>

      {isLoading ? (
        <p className="p-4">Loading...</p>
      ) : error ? (
        <p className="text-red-500 p-4">Error: {error.message}</p>
      ) : (
        <JobTable
          jobs={managers}
          mutate={mutate}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      )}
    </div>
  );
};

export function JobTable({
  jobs = [],
  mutate,
  currentPage,
  totalPages,
  goToPage,
}) {
  const navigate = useNavigate();

  const confirmDelete = async (employeeId) => {
    const parentId = userData.claims.id;
    try {
      const res = await axios.delete(
        `/recruiter/${employeeId}/parent/${parentId}`
      );
      if (!res.data.error) {
        toast.success("Employee deleted successfully");
        mutate(); // Refresh
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <div className="table-data p-4 w-full">
        <ManagerTable managers={jobs} onDelete={(id) => confirmDelete(id)} />
      </div>

      {jobs.length > 0 && (
        <nav className="Page navigation justify-center gap-2 items-center">
          <ul className="pagination flex justify-center gap-2 items-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <Button
                className="page-link"
                onClick={() => goToPage(currentPage - 1)}
              >
                Prev
              </Button>
            </li>

            {currentPage > 1 && (
              <li className="page-item">
                <Button
                  className="page-link"
                  onClick={() => goToPage(currentPage - 1)}
                >
                  {currentPage - 1}
                </Button>
              </li>
            )}

            <li className="page-item active">
              <span className="page-link">{currentPage}</span>
            </li>

            {currentPage < totalPages && (
              <li className="page-item">
                <Button
                  className="page-link"
                  onClick={() => goToPage(currentPage + 1)}
                >
                  {currentPage + 1}
                </Button>
              </li>
            )}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <Button
                className="page-link"
                disabled={currentPage == totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default Managers;
