import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { CalendarApp, createViewWeek } from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import "../../components/custom-calendar.css";
import "../../components/custom-event.css";

interface WeekDates {
  [day: string]: string;
}

const weekDates: WeekDates = {
  Monday: "2025-02-03",
  Tuesday: "2025-02-04",
  Wednesday: "2025-02-05",
  Thursday: "2025-02-06",
  Friday: "2025-02-07",
  Saturday: "2025-02-08",
  Sunday: "2025-02-09",
};

const ManualEdit = () => {
  // Initial events definition
  const initialEvents = [
    {
      id: 1,
      title: "Machine Learning",
      start: `${weekDates.Monday} 08:00`,
      end: `${weekDates.Monday} 10:00`,
      location: "Room 1903",
      people: ["Jessie James Suarez"],
    },
    {
      id: 2,
      title: "Machine Learning",
      start: `${weekDates.Monday} 10:30`,
      end: `${weekDates.Monday} 13:30`,
      location: "Room 1903",
      people: ["Jessie James Suarez"],
    },
    {
      id: 3,
      title: "Operations Research",
      start: `${weekDates.Tuesday} 07:00`,
      end: `${weekDates.Tuesday} 08:30`,
      location: "Room 1911",
      people: ["Jonathan Cabero"],
    },
    {
      id: 4,
      title: "Data Communications and Networking",
      start: `${weekDates.Tuesday} 08:30`,
      end: `${weekDates.Tuesday} 10:00`,
      location: "Room 1902",
      people: ["Ian Luna"],
    },
    {
      id: 5,
      title: "Software Engineering",
      start: `${weekDates.Tuesday} 11:30`,
      end: `${weekDates.Tuesday} 13:00`,
      location: "Room 1813",
      people: ["Lawrence Decamora"],
    },
    {
      id: 6,
      title: "Panimulang Pagsasalin",
      start: `${weekDates.Tuesday} 13:00`,
      end: `${weekDates.Tuesday} 15:30`,
      location: "Room 1807",
      people: ["Josephine Villegas"],
    },
    {
      id: 7,
      title: "Operations System",
      start: `${weekDates.Wednesday} 07:00`,
      end: `${weekDates.Wednesday} 08:30`,
      location: "Room 1902",
      people: ["Rochelle Lyn Lopez"],
    },
  ];

  const calendar: CalendarApp = useCalendarApp({
    views: [createViewWeek()],
    events: initialEvents,
    selectedDate: "2025-02-03",
    dayBoundaries: {
      start: "07:00",
      end: "21:00",
    },
    weekOptions: { eventOverlap: false, nDays: 6 },
    plugins: [createDragAndDropPlugin(30)],
    callbacks: {
      onEventUpdate(updatedEvent) {
        console.log("onEventUpdate", updatedEvent);
      },
      onBeforeEventUpdate(oldEvent, newEvent, $app) {
        // Helper: convert a "YYYY-MM-DD HH:mm" string to a Date.
        const parseDateTime = (dateTimeStr: string) =>
          new Date(dateTimeStr.replace(" ", "T"));

        const newStart = parseDateTime(newEvent.start);
        const newEnd = parseDateTime(newEvent.end);

        // Instead of $app.config.events, access the events from the calendarEvents store.
        const events = $app.calendarEvents.list.value;

        for (const evt of events) {
          // Skip the event that is being updated.
          if (evt.id === oldEvent.id) continue;

          const evtStart = parseDateTime(evt.start);
          const evtEnd = parseDateTime(evt.end);

          // Check for overlapping time intervals.
          if (newStart < evtEnd && newEnd > evtStart) {
            console.log(`Time slot occupied by event id ${evt.id}`);
            return false;
          }
        }
        return true;
      },
    },
  });

  return (
    <div>
      <div className="flex ml-16 mr-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <p className="font-CyGrotesk text-primary text-[40px]">3CSF</p>
          <p className="font-Helvetica-Neue-Heavy bg-custom_yellow px-3 py-1 rounded-3xl">
            Data Science
          </p>
          <button className="">
            <SlArrowLeft />
          </button>
          <button>
            <SlArrowRight />
          </button>
        </div>
        <div className="flex items-center gap-s">
          <div className="bg-primary font-Manrope p-2 space-x-5 text-[13px] rounded-lg">
            <NavLink
              to="/departmentchair/input-ylt"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              By Section
            </NavLink>
            <NavLink
              to="/departmentchair/input-ylt"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              By Professor
            </NavLink>
            <NavLink
              to="/departmentchair/input-ylt"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              By Room
            </NavLink>
          </div>
          <div>
            <Select />
          </div>
        </div>
      </div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default ManualEdit;
