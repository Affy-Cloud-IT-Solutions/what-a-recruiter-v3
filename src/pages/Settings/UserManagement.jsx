import {
  SquareKanban,
  Trash2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import TopBar from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";

// Import ShadCN UI Select Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserManagement = () => {
  const token = localStorage.getItem("token");
  const userData = token && jwtDecode(token);
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortOption, setSortOption] = useState("createdNewest");
  const [roleFilter, setRoleFilter] = useState("all");
  const navigate = useNavigate();

  const fetchCompanies = async (page = 1, size = 25) => {
    try {
      const response = await axios.get(
        `/user/page/parent/${userData.claims?.id}?page=${page}&size=${size}`
      );

      if (!response.data.error) {
        const employees = response.data.meta.employees;
        setManagers(employees);
        setTotalItems(response.data.meta.totalItems);
        setCurrentPage(response.data.meta.currentPage);
        setTotalPages(response.data.meta.totalPages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    let result = [...managers];

    if (roleFilter !== "all") {
      result = result.filter((emp) => emp.role === roleFilter);
    }

    switch (sortOption) {
      case "nameAsc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "createdNewest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "createdOldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
    }

    setFilteredManagers(result);
  }, [managers, sortOption, roleFilter]);

  const goToPage = (page) => {
    setCurrentPage(page);
    fetchCompanies(page, pageSize);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar icon={SquareKanban} title="User Management" back={true} />

      <div className="p-4 space-y-4 flex-1">
        <div className="flex flex-wrap items-center gap-4">
          {/* Page Size Select */}
          {/* <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="75">75</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select> */}

          {/* Sort Select */}
          <Select value={sortOption} onValueChange={(value) => setSortOption(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdNewest">Created (Newest)</SelectItem>
              <SelectItem value="createdOldest">Created (Oldest)</SelectItem>
              <SelectItem value="nameAsc">Name (A–Z)</SelectItem>
              <SelectItem value="nameDesc">Name (Z–A)</SelectItem>
            </SelectContent>
          </Select>

          {/* Role Filter Select */}
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="EMPLOYEE">Employee</SelectItem>
              <SelectItem value="RECRUITER">Recruiter</SelectItem>
              
            </SelectContent>
          </Select>

          <div className="ms-auto">
            <Button onClick={() => navigate("create-user")}>Create User</Button>
          </div>
        </div>

        {/* Table */}
        <JobTable
          jobs={filteredManagers}
          fetchCompanies={fetchCompanies}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
};

export function JobTable({
  jobs = [],
  fetchCompanies,
  currentPage,
  totalPages,
  goToPage,
}) {
  const navigate = useNavigate();
  let employeeIdToDelete = null;

  const setEmployeeIdToDelete = (id) => {
    employeeIdToDelete = id;
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    const userData = token && jwtDecode(token);

    try {
      const response = await axios.delete(
        `/employee/${employeeIdToDelete}/parent/${userData.claims?.id}`
      );
      if (!response.data.error) {
        toast.success("Employee deleted successfully");
        fetchCompanies();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }

    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("deleteModal")
    );
    if (modal) modal.hide();
  };

  return (
    <div>
      <div className="table-data ">
        <Table className="table text-center">
          <TableHeader>
            <TableRow>
              <TableHead>S No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>System Role</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
      <TableBody>
  {jobs.length > 0 ? (
    jobs.map((job, index) => (
      <TableRow key={job.id || index}>
        <TableCell className={"text-start"}>{index + 1}</TableCell>
        <TableCell className={"text-start"}>{job?.name}</TableCell>
        <TableCell className={"text-start"}>{job?.email}</TableCell>
        <TableCell className={"text-start"}>{job?.role}</TableCell>
        <TableCell className={"text-start"}>
          <Button
            size="icon"
            variant="destructive"
            className="my-1"
            onClick={() => setEmployeeIdToDelete(job?.id)}
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5} className="text-center">
        No Employees Found
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <nav className="flex justify-center items-center my-6">
        <ul className="flex flex-wrap gap-2 items-center">
          <li>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
          </li>

          {currentPage > 1 && (
            <li>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
              >
                {currentPage - 1}
              </Button>
            </li>
          )}

          <li>
            <Button variant="default" size="sm" disabled>
              {currentPage}
            </Button>
          </li>

          {currentPage < totalPages && (
            <li>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
              >
                {currentPage + 1}
              </Button>
            </li>
          )}

          <li>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default UserManagement;
