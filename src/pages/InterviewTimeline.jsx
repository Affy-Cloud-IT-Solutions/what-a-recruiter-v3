import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";
import { format, parse, startOfWeek, getDay } from "date-fns";
import TopBar from "@/components/dashboard/dashboard-header";
import { Settings } from "lucide-react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Interviews with specific times
const interviews = [
  { role: "UI/UX Designer", date: "02 May 2025", startTime: "14:00", endTime: "15:00" },
  { role: "Frontend Developer", date: "02 May 2025", startTime: "17:00", endTime: "18:00" },
  { role: "Backend Developer", date: "03 May 2025", startTime: "11:00", endTime: "12:00" },
  { role: "Project Manager", date: "04 May 2025", startTime: "13:30", endTime: "14:30" },
  { role: "Customer Manager", date: "05 May 2025", startTime: "10:00", endTime: "10:30" },
  { role: "UI/UX Designer", date: "06 May 2025", startTime: "15:00", endTime: "16:00" },
];

// Convert interview data into calendar events
const events = interviews.map((item) => {
  const [day, monthName, year] = item.date.split(" ");
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const [startHour, startMin] = item.startTime.split(":").map(Number);
  const [endHour, endMin] = item.endTime.split(":").map(Number);
  const month = months[monthName.slice(0, 3)];

  const start = new Date(parseInt(year), month, parseInt(day), startHour, startMin);
  const end = new Date(parseInt(year), month, parseInt(day), endHour, endMin);

  return {
    title: item.role,
    start,
    end,
  };
});

function InterviewTimeline() {
  return (
    <div className="me-md-3">
      <TopBar icon={Settings} title={"Settings"} />
      <div className="mx-6 my-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={{ month: true, week: true, day: true }}
          defaultView={Views.WEEK}
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
}

export default InterviewTimeline;
