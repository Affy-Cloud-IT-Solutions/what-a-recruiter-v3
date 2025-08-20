"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { aiBaseUrl } from "@/App";

const ProfileCard = ({ user }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        aiBaseUrl + `get-github-user-details?username=${user.Username}`
      );
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      console.error("Failed to fetch user details", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md border rounded-xl p-0 pt-4">
      <CardContent className="flex items-center gap-4 !py-4">
        <img
          src={`https://github.com/${user?.Username}.png`}
          alt={user.Username}
          className="w-16 h-16 rounded-full border"
        />

        <div className="flex flex-col justify-center">
          <p className="text-lg font-semibold">{user.Username}</p>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            View GitHub Profile
          </a>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={fetchDetails}>
              View Details
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>GitHub User Details</DialogTitle>
            </DialogHeader>

            {loading && <p>Loading...</p>}

            {details && (
              <div className="flex gap-4 mt-4">
                <img
                  src={`https://github.com/${details?.Username}.png`}
                  alt={user.Username}
                  className="w-20 h-20 rounded-full border"
                />
                <div className="space-y-2 font-[400] ">
                  <p>
                    <strong>Username:</strong> {details.Username}
                  </p>
                  <p>
                    <strong>Name:</strong> {details.Name}
                  </p>
                  <p>
                    <strong>Company:</strong> {details.Company}
                  </p>
                  <p>
                    <strong>Location:</strong> {details.Location}
                  </p>
                  <p>
                    <strong>Bio:</strong> {details.Bio}
                  </p>
                  <a
                    href={details.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-900 underline"
                  >
                    Visit GitHub Profile
                  </a>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
