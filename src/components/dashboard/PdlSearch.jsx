import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import React, { useState } from "react";
import usePdlSearch from "@/hooks/usePdlSearch";
import { Check, ChevronsUpDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const techSkills = [
  "JavaScript",
  "React",
  "Vue.js",
  "Angular",
  "TypeScript",
  "Node.js",
  "Express",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "Kotlin",
  "Swift",
  "PHP",
  "Laravel",
  "Ruby on Rails",
  "C#",
  ".NET",
  "C++",
  "Go",
  "Rust",
  "HTML",
  "CSS",
  "SASS",
  "Tailwind CSS",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "REST API",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Firebase",
  "Redux",
  "Next.js",
  "Jest",
  "CI/CD",
  "Git",
  "Webpack",
  "Expo",
];

const SearchComponent = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [searchParams, setSearchParams] = useState(null);

  const { data, loading, error } = usePdlSearch(searchParams);

  const handleSearch = () => {
    setSearchParams({
      job_title: jobTitle,
      skills,
      location_country: "India",
      size: 3,
    });
  };

  return (
    <>
      <div className=" mx-auto space-y-4 p-4 flex justify-start items-start gap-4 ">
        <div className="space-y-1">
          <Label htmlFor="job">Job Title</Label>
          <Input
            id="job"
            className={"min-w-72"}
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter job title"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="skills">Skills</Label>
          <MultiSelect
            options={techSkills}
            selected={skills}
            setSelected={setSkills}
            placeholder="Select tech skills"
          />
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 ">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center bg-blue-50 text-neutral-700 text-xs font-medium px-2 py-1 rounded-full border border-blue-300"
                >
                  {skill}
                  <button
                    onClick={() =>
                      setSkills((prev) => prev.filter((s) => s !== skill))
                    }
                    className="ml-2 text-blue-900 hover:text-red-500 transition"
                    aria-label={`Remove ${skill}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center py-4">
          Something went wrong
        </p>
      )}
      {console.log(data?.results, "data")}
      <div className="grid grid-cols-3 gap-2">
        {data?.results &&
          data?.results.map((engineer, index) => (
            <EngineerCard key={index} engineer={engineer} />
          ))}
      </div>
    </>
  );
};

export default SearchComponent;

export const MultiSelect = ({
  options,
  selected,
  setSelected,
  placeholder = "Select...",
}) => {
  const [open, setOpen] = useState(false);

  const toggleSelect = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between min-w-72"
        >
          {selected.length > 0 ? selected.join(", ") : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => toggleSelect(option)}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selected.includes(option) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const EngineerCard = ({ engineer }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleSkills = showAll ? engineer.skills : engineer.skills.slice(0, 4);

  return (
    <Card className="w-full h-full bg-background text-foreground  shadow-sm border border-neutral-500/10">
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold capitalize">
            {engineer.full_name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {engineer.job_title} @ {engineer.job_company_name}
          </p>
          <a
            href={`https://${engineer.linkedin_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 text-sm hover:underline"
          >
            LinkedIn
          </a>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill, idx) => (
              <div
                key={idx}
                className="text-xs capitalize border px-3 py-1 bg-blue-50"
              >
                {skill}
              </div>
            ))}
          </div>

          {engineer.skills.length > 4 && (
            <Button
              onClick={() => setShowAll((prev) => !prev)}
              variant="link"
              size="sm"
              className="mt-2 p-0 text-xs"
            >
              {showAll ? "Show Less" : "Show More"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
