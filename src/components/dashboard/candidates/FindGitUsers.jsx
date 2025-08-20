import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGithubUsers } from "@/hooks/use-git-users";
import { User } from "lucide-react";
import { useState } from "react";
import ProfileCard from "./ProfileCard";

export default function GithubUserForm() {
  const [formData, setFormData] = useState({
    language: "django",
    location: "india",
    per_page: 5,
    page: 1,
    token: "",
  });

  const { fetchUsers, users, loading, error } = useGithubUsers();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "per_page" || name === "page" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUsers(formData);
  };

  const handleCancel = () => {
    setFormData({
      language: "django",
      location: "india",
      per_page: 5,
      page: 1,
      token: "",
    });
  };

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-2xl font-bold mb-4">Search GitHub Users</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-4 w-full"
      >
        <div className="flex flex-col">
          <Label htmlFor="language">Language *</Label>
          <Input
            id="language"
            name="language"
            type="text"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="per_page">Results/Page</Label>
          <Input
            id="per_page"
            name="per_page"
            type="number"
            min={1}
            max={100}
            value={formData.per_page}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="page">Page</Label>
          <Input
            id="page"
            name="page"
            type="number"
            min={1}
            value={formData.page}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {users.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Results:</h3>
          <ul className="list-disc grid grid-cols-3  mt-2 space-y-1 gap-2">
            {users?.map((user, index) => (
              <ProfileCard user={user} key={index} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
