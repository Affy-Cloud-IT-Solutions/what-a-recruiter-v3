import {
  Edit,
  ListPlus,
  Grip,
  CornerDownRight,
  SquareKanban,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import TopBar from "@/components/dashboard/dashboard-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackButton } from "./MyProfile";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { token } from "../../lib/utils";

const userData = token && jwtDecode(token);

const JobFields = () => {
  const navigate = useNavigate();
  const [customData, setCustomData] = useState([]);

  const buildHierarchy = (items) => {
    const map = new Map();
    const roots = [];

    items.forEach((item) => map.set(item.id, { ...item, children: [] }));

    map.forEach((item) => {
      if (item.fieldParentId && map.has(item.fieldParentId)) {
        map.get(item.fieldParentId).children.push(item);
      } else {
        roots.push(item);
      }
    });

    const sorted = [];
    const traverse = (node, depth = 0) => {
      node.depth = depth;
      sorted.push(node);
      node.children.forEach((child) => traverse(child, depth + 1));
    };
    roots.forEach((root) => traverse(root));
    return sorted;
  };

  const fetchCustomData = async () => {
    try {
      const response = await axios.get(
        `custom-fields/fields?userId=${userData.claims.id}`
      );

      if (!response.data.error) {
        const structured = buildHierarchy(response.data.meta.fields);
        setCustomData(structured);
      } else {
        toast.error(response?.data.message);
      }
    } catch (error) {
      console.error("Error fetching job fields:", error);
      toast.error("Something went wrong while fetching fields.");
    }
  };

  useEffect(() => {
    fetchCustomData();
  }, []);

  const assignParent = async (childFieldId, parentFieldId) => {
    try {
      const response = await axios.post(
        "/custom-fields/assign-parent",
        {
          childFieldId,
          parentFieldId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.error) {
        fetchCustomData();
      } else {
      }
    } catch (error) {
      console.error("Error assigning parent:", error);
    }
  };

  return (
    <div>
      <TopBar icon={SquareKanban} title={"Job Fields"} back={true} />
      <div className="flex w-full items-center justify-between gap-4 px-6 py-4 bg-white shadow-md ">
        <div className="flex gap-4 w-full items-center">
          <Input
            type="text"
            className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none mx-2"
            placeholder="Search by field name..."
          />
        </div>
        <div className="flex items-center">
          <Button
            onClick={() => navigate("create")}
            className={"md:!text-sm text-xs"}
          >
            <Plus
              style={{ width: 20, height: 20 }}
              className="hidden sm:flex"
            />{" "}
            Add Field
          </Button>
        </div>
      </div>

      <div className="mx-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const childFieldId = e.dataTransfer.getData("childFieldId");
            if (childFieldId) {
              // Dropped outside valid rows, remove parent
              assignParent(childFieldId, null);
            }
          }}
          className="overflow-x-auto rounded-lg border border-gray-300 shadow-lg max-w-7xl m-6 mx-auto"
        >
          <table className="w-full border-collapse bg-white text-base ">
            <thead className="text-left font-semibold text-gray-700">
              <tr>
                <th className="px-6 py-4 text-gray-500 w-12"></th>
                <th className="px-6 py-4 text-gray-500">Name</th>
                <th className="px-4 py-4 text-gray-500">Category</th>
                <th className="px-4 py-4 text-gray-500">Visibility</th>
                <th className="px-6 py-4 text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customData?.length > 0 &&
                customData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t text-gray-900 hover:bg-gray-50"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("childFieldId", item.id);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    // onDrop={(e) => {
                    //   const childFieldId =
                    //     e.dataTransfer.getData("childFieldId");
                    //   const parentFieldId = item.id;
                    //   if (
                    //     childFieldId &&
                    //     parentFieldId &&
                    //     childFieldId !== parentFieldId
                    //   ) {
                    //     assignParent(childFieldId, parentFieldId);
                    //   }
                    // }}
                    onDrop={(e) => {
                      const childFieldId =
                        e.dataTransfer.getData("childFieldId");
                      const parentFieldId = item.id;

                      if (!childFieldId || !parentFieldId) return;

                      if (childFieldId === parentFieldId) {
                        // Prevent assigning to self
                        console.warn("Cannot assign item as its own parent.");
                        return;
                      }

                      // Assign as child to this parent
                      assignParent(childFieldId, parentFieldId);
                    }}
                  >
                    <td className="px-4 py-3 text-center">
                      <Grip
                        className="text-gray-400 cursor-pointer"
                        size={18}
                      />
                    </td>
                    {/* <td>
                      {Array(item.depth)
                        .fill(0)
                        .map((_, i) => (
                          <CornerDownRight
                            key={i}
                            className={`inline-block mr-1 text-gray-500 ${
                              i !== item.depth - 1 ? "invisible" : ""
                            }`}
                            size={16}
                          />
                        ))}
                      {item.label}
                    </td> */}
                    <td>
                      {item.depth > 0 &&
                        Array(item.depth + 1)
                          .fill(0)
                          .map((_, i) => (
                            <CornerDownRight
                              key={i}
                              className={`inline-block mr-1 text-gray-500 ${
                                i !== item.depth ? "invisible" : ""
                              }`}
                              size={16}
                            />
                          ))}
                      {item.label}
                    </td>

                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">{item.visibility}</td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <Button variant="outline" size="icon">
                        <ListPlus className="text-gray-700" size={18} />
                      </Button>
                      <Link
                        to={item.id}
                        className={buttonVariants({
                          variant: "outline",
                          size: "icon",
                        })}
                      >
                        <Edit className="text-gray-700" size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobFields;
