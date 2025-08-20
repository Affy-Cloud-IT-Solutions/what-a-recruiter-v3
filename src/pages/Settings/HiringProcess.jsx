import TopBar from "@/components/dashboard/dashboard-header";
import React, { useEffect, useState } from "react";
import { BackButton } from "./MyProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "@/hooks/use-fetch-profile";
import axios from "axios";
import { formatDateTime } from "@/lib/formatDate";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import Loader from "@/components/ui/loader";
import { set } from "date-fns";
import { token } from "../../lib/utils";

export default function HiringProcess() {
  const navigate = useNavigate();
  const { profileData } = useProfileData();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchHiringProcess = async () => {
    if (!profileData) {
      return;
    }

    const idToUse =
      profileData.role === "COMPANY" ? profileData.id : profileData.parent.id;
    if (!idToUse) {
      return;
    }

    try {
      const response = await axios.get(
        `hiring-custom-fields/hiring-process/by-parent?parentId=${idToUse}`
      );
      if (!response.data.error) {
        setData(response.data.meta.hiringProcesses);
        // setLoading(false);
      } else if (response.data.error) {
        toast.error("error", { description: response.data.message });
      }
    } catch (error) {
      console.error("Error fetching job applicant data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData) {
      fetchHiringProcess();
    }
  }, [profileData]);

  const deleteHiringProcess = async (hiringProcessId) => {
    try {
      const response = await axios.delete(
        `hiring-custom-fields/hiring-process/${hiringProcessId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Hiring process deleted successfully");
      if (!response.data.error) {
        fetchHiringProcess();
      }
    } catch (error) {
      console.error("Error deleting hiring process:", error);
      toast.error("Failed to delete hiring process");
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      <TopBar icon={Plus} title="Hiring Process" back={true} />
      <div className="flex w-full items-center justify-between gap-4 px-6 py-4 bg-white shadow-md">
        <div className="flex gap-4 w-full items-center">
          <h5 className="text-lg font-semibold">Custom Hiring Process</h5>
        </div>
        <div className="flex items-center">
          <Button onClick={() => navigate("create")} className="text-sm">
            <Plus className="w-5 h-5 hidden sm:inline-block mr-2" />
            Create New Hiring Process
          </Button>
        </div>
      </div>

      <div className="px-6 py-4">
        <Input placeholder="Search" className="w-full max-w-md mb-4" />

        <div className="bg-white shadow-md border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-4 border-b text-sm font-semibold bg-gray-50 text-gray-800">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Created At</div>
            <div className="col-span-3">Updated At</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {data.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-2 p-4 border-b hover:bg-gray-50 transition-all text-sm"
            >
              <div className="col-span-3 font-medium text-gray-900">
                {item.name}
              </div>
              <div className="col-span-3 text-gray-700">
                {item.createdAt ? formatDateTime(item.createdAt) : "-"}
              </div>
              <div className="col-span-3 text-gray-700">
                {item.updatedAt ? formatDateTime(item.updatedAt) : "-"}
              </div>
              <div className="col-span-3 flex justify-end gap-4">
                <Calendar
                  className="w-5 h-5 text-gray-500 hover:text-primary cursor-pointer"
                  onClick={() => navigate(`${item.id}/interview-template`)}
                />
                {/* <FileText className="w-5 h-5 text-gray-500 hover:text-primary cursor-pointer" /> */}
                <Pencil
                  onClick={() => navigate(`${item.id}`)}
                  className="w-5 h-5 text-gray-500 hover:text-primary cursor-pointer"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer" />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete Hiring Process?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Are you sure you want to
                        delete this hiring process?
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => deleteHiringProcess(item.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
