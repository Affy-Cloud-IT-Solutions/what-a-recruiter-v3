import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JobsPipeline from "./jobs/jobs-pipeline";
import { Calendar } from "../ui/calendar";
import TopBar from "./dashboard-header";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format, addDays, subDays, isSameDay, parse } from "date-fns";
import MonthlyBarChart from "../reusable/barCharts";
import RecruiterDoughnutChart from "../reusable/barCharts";

const data = [
  { name: "In-Review", value: 19, color: "#99A8FF" },
  { name: "Interview", value: 32, color: "#547BFF" },
  { name: "Offered", value: 23, color: "#3457D5" },
  { name: "Hired", value: 41, color: "#1E3AA6" },
];
const interviews = [
  { role: "UI/UX designer", date: "13 May 2025" },
  { role: "Frontend Developer", date: "15 May 2025" },
  { role: "Backend Developer", date: "26 May 2025" },
  { role: "Project Manager", date: "22 May 2025" },
  { role: "Customer Manager", date: "07 May 2025" },
  { role: "UI/UX designer", date: "12 May 2025" },
];

const parseInterviewDate = (str) => parse(str, "dd MMMM yyyy", new Date());
const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const goToPreviousDay = () => setSelectedDate((prev) => subDays(prev, 1));
  const goToNextDay = () => setSelectedDate((prev) => addDays(prev, 1));
  const interviewDates = interviews.map((i) => parseInterviewDate(i.date));
  const filteredJobs = interviews.filter((job) =>
    isSameDay(parseInterviewDate(job.date), selectedDate)
  );
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setOpen(false); // Close the calendar after selecting
  };
  return (
    <div className="">
      <TopBar title={"Dashboard"} />
      <div className="flex-1 bg-gray-100 zoom-out">
        <div className="p-4 md:p-4 lg:p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex flex-col lg:col-span-2">
            <Card className=" shadow-md">
              <CardContent>
                <JobsPipeline />
              </CardContent>
            </Card>
            <div className=" gap-4 mt-4 w-full grid md:grid-cols-2 grid-cols-1 ">
              <Card className="shadow-md md:col-span-1">
                <CardHeader>
                  <h3 className="">New Jobs</h3>
                </CardHeader>
                <CardContent>
                  {[
                    { title: "Frontend Developer", level: "Senior Level" },
                    { title: "UI/UX Designer", level: "Senior Level" },
                    { title: "Backend Developer", level: "Fresher" },
                  ].map((job, index) => (
                    <div
                      key={index}
                      className="flex justify-between  p-2 border-b"
                    >
                      <div>
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-sm text-gray-500 ">{job.level}</p>
                      </div>
                      <Button className="bg-blue-950 text-white cursor-pointer text-xs px-4 py-1">
                        Details
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="shadow-md w-full md:col-span-1">
                <CardHeader>
                  <h3 className=" ">Job Summary</h3>
                </CardHeader>
                <CardContent className={"space-y-3"}>
                  {/* <JobSummaryChart /> */}
                  <div className="flex justify-between">
                    <span>Total Jobs Posted</span>
                    <span className="font-semibold">124</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Jobs</span>
                    <span className="font-semibold">38</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Closed Jobs</span>
                    <span className="font-semibold">86</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Applicants per Job</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Role Posted</span>
                    <span className="font-semibold">Frontend Developer</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div>
            <Card className="lg:col-span-1 h-fit shadow-md w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-base font-medium px-4 rounded-3xl"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "dd MMMM yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        modifiers={{
                          hasInterview: interviewDates,
                        }}
                        modifiersClassNames={{
                          hasInterview: "relative",
                        }}
                        modifiersStyles={{
                          hasInterview: { position: "relative" },
                        }}
                        renderDay={(day) => {
                          const isInterview = interviewDates.some((d) =>
                            isSameDay(d, day)
                          );
                          return (
                            <div className="relative w-full h-full flex justify-center items-center">
                              <span>{format(day, "d")}</span>
                              {isInterview && (
                                <div className="w-1.5 h-1.5 bg-blue-950 rounded-full absolute bottom-1" />
                              )}
                            </div>
                          );
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button variant="ghost" size="icon" onClick={goToNextDay}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="mt-4">
                  <p className="text-md pb-2">Interviews</p>

                  {filteredJobs.length === 0 ? (
                    <p className="text-center text-gray-500 mt-2">
                      No interviews today.
                    </p>
                  ) : (
                    <div className="space-y-2 h-52">
                      {filteredJobs.map((interview, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-xl shadow border-l-4 border border-l-blue-950 border-t border-b border-r text-sm"
                        >
                          <p className="font-medium">{interview.role}</p>
                          <p className="text-xs text-gray-500">
                            07:00PM - 08:00PM
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1 h-fit shadow-md w-full mt-4 px-4">
              <p className="text-md pb-2">Overall Recruitment</p>
              <RecruiterDoughnutChart />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
