"use client";

import { Plus, SquareKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import toast from "react-hot-toast";
import TopBar from "../dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import useSWR from "swr";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const token = localStorage.getItem("token");
const userData = token ? jwtDecode(token) : null;

const fetcher = async (url) => {
  const response = await axios.get(url);
  if (!response.data || response.data.error) {
    throw new Error(response.data?.message || "Failed to fetch employees");
  }
  return response.data.meta;
};

const Employee = () => {
  const [pageSize] = useState(25);
  const [currentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [parentFilter, setParentFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("nameAsc"); // default sorting

  const navigate = useNavigate();

  const endpoint = `/employee/page/parent/${userData?.claims?.id}?page=${currentPage}&size=${pageSize}`;
  const { data, error, isLoading } = useSWR(endpoint, fetcher);

  const employees = data?.employees ?? [];

  const parents = useMemo(() => {
    // Extract unique parents for filter dropdown (no filtering effect)
    const uniqueParents = Array.from(
      new Set(employees.map((emp) => emp.parent?.name).filter(Boolean))
    );
    return uniqueParents;
  }, [employees]);

  // Filtered by search only (parentFilter does not filter anymore)
  const filteredEmployees = useMemo(() => {
    let result = employees;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((emp) =>
        [emp.name, emp.email, emp.username].join(" ").toLowerCase().includes(q)
      );
    }

    // Sort based on sortOption
    result = result.slice(); // copy to avoid mutating original

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
      default:
        break;
    }

    return result;
  }, [employees, searchQuery, sortOption]);

  return (
    <div>
      <TopBar icon={SquareKanban} title="Employee" />
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2 items-center flex-wrap">
            <Input
              type="search"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />

            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value)}
              className="w-48"
            >
              <SelectTrigger>
                <SelectValue>
                  {{
                    nameAsc: "Name A-Z",
                    nameDesc: "Name Z-A",
                    createdNewest: "Created Newest",
                    createdOldest: "Created Oldest",
                  }[sortOption]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nameAsc">Name A-Z</SelectItem>
                <SelectItem value="nameDesc">Name Z-A</SelectItem>
                <SelectItem value="createdNewest">Created Newest</SelectItem>
                <SelectItem value="createdOldest">Created Oldest</SelectItem>
              </SelectContent>
            </Select>

            {/* Parent filter dropdown remains but no filtering effect */}
       
          </div>

          <Button onClick={() => navigate("create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {isLoading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="p-4 text-sm text-red-500">Error: {error.message}</p>
        ) : (
          <EmployeeTable employees={filteredEmployees} />
        )}
      </div>
    </div>
  );
};

const EmployeeTable = ({ employees }) => {
  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Employee List</CardTitle>
    //     <CardDescription>Manage all registered employees</CardDescription>
    //   </CardHeader>
    //   <CardContent className="overflow-x-auto">
        <Table className={"border"}>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">#</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Mobile</TableHead>
              <TableHead className="text-center">Username</TableHead>
              <TableHead className="text-center">Parent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((emp, index) => (
                <TableRow key={emp.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{emp.name}</TableCell>
                  <TableCell className="text-center">{emp.email}</TableCell>
                  <TableCell className="text-center">{emp.phoneNumber}</TableCell>
                  <TableCell className="text-center">{emp.username}</TableCell>
                  <TableCell className="text-center">{emp.parent?.name ?? "--"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  No Employees Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    //   </CardContent>
    // </Card>
  );
};

export default Employee;
