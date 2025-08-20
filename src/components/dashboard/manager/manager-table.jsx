import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

export default function ManagerTable({ managers, onDelete }) {
  console.log(managers);
  const sortedManagers = [...managers].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <Table className={"border"}>
      <TableCaption>List of all added managers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>S No.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Username</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedManagers.length > 0 ? (
          sortedManagers.map((manager, index) => (
            <TableRow key={manager.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{manager.name}</TableCell>
              <TableCell>{manager.email}</TableCell>
              <TableCell>{manager.phoneNumber}</TableCell>
              <TableCell>{manager.username}</TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this manager? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      onClick={() => onDelete(manager.id)}
                      className="mt-4"
                      variant="destructive"
                    >
                      Yes, Delete
                    </Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No Manager Found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
