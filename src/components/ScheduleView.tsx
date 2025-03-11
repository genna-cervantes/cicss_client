import {
  CalendarApp,
  createCalendar,
  createViewWeek,
} from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import React, { useEffect, useState } from "react";
import { weekDates } from "../utils/constants";
import GenerateButton from "./GenerateButton";
import timeGridEvent from "../pages/departmentchair/TimeGridEvent";

const dayKeysToFull: any = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  TH: "Thursday",
  F: "Friday",
  S: "Saturday",
};

const transformMilitaryTimeRawToTime = (rawMilitaryTime: string) => {
  if (rawMilitaryTime.length === 3) {
    rawMilitaryTime = "0" + rawMilitaryTime;
  }

  return `${rawMilitaryTime.slice(0, 2)}:${rawMilitaryTime.slice(2)}`;
};

const transformToScheduleEvents = (rawSchedule: any) => {
  let transformedEvents = [];

  const dayKeys = Object.keys(rawSchedule);
  for (let i = 0; i < dayKeys.length; i++) {
    let daySched = rawSchedule[dayKeys[i]];
    let schoolDay = dayKeysToFull[dayKeys[i]];

    for (let j = 0; j < daySched.length; j++) {
      let schedBlock = daySched[j];

      console.log('schedBlock')
      console.log(schedBlock)

      let transformedSchedBlock = {
        id: schedBlock.id,
        title: schedBlock.course.subjectCode,
        start: `${weekDates[schoolDay]} ${transformMilitaryTimeRawToTime(schedBlock.timeBlock.start)}`,
        end: `${weekDates[schoolDay]} ${transformMilitaryTimeRawToTime(schedBlock.timeBlock.end)}`,
        location: schedBlock.room.roomId,
        people: [schedBlock.tas.tas_name], // magkaiba pa ung convnetiona mp
        description: JSON.stringify({type: schedBlock.course.type, violations: schedBlock.violations ?? []})
      };

      transformedEvents.push(transformedSchedBlock);
    }
  }

  return transformedEvents;
};

const ScheduleView = ({
  filter = "Section",
  value = "1CSA",
}: {
  filter: string;
  value: string;
}) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Machine Learning",
      start: `${weekDates.Monday} 08:00`,
      end: `${weekDates.Monday} 12:00`,
      location: "Room 1903",
      people: ["Jessie James Suarez"],
    },
  ]);

  const [scheduleEvents, setScheduleEvents] = useState<any>();
  const [transformedScheduleEvents, setTransformedScheduleEvents] =
    useState<any>();
  const [error, setError] = useState("");

  // default schedule to show
  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetch("http://localhost:3000/schedule/class/CS/1/CSA"); // DEFAULT NA SIMULA
      const data = await res.json();

      if (res.ok) {
        setScheduleEvents(data);
      } else {
        setError("may error sa pag kuha ng sched");
      }
    };

    fetchSchedule();
  }, []);

  // rendering when schedule is fetched
  useEffect(() => {
    console.log("raw schedule events");
    console.log(scheduleEvents);

    console.log("transformed schedule events");
    // console.log(transformToScheduleEvents(scheduleEvents))

    if (scheduleEvents) {
      let transformedEvents = transformToScheduleEvents(scheduleEvents);
      setTransformedScheduleEvents(transformedEvents);
    }
  }, [scheduleEvents]);

  // update schedule when go to next or previous
  useEffect(() => {
    console.log("filter", filter);
    console.log("value", value);

    if (filter === "Section") {
      let year = value.slice(0, 1);
      let section = value.slice(1);

      console.log(year);
      console.log(section);

      const fetchSchedule = async () => {
        const res = await fetch(
          `http://localhost:3000/schedule/class/CS/${year}/${section}`
        ); // DEFAULT NA CS MUNA
        const data = await res.json();

        if (res.ok) {
          setScheduleEvents(data);
        } else {
          setError("may error sa pag kuha ng sched");
        }
      };

      fetchSchedule();
    }
  }, [filter, value]);

  let calendar: CalendarApp;
  if (transformedScheduleEvents) {
    calendar = createCalendar(
      {
        views: [createViewWeek()],
        events: transformedScheduleEvents,
        selectedDate: "2025-02-03",
        dayBoundaries: {
          start: "07:00",
          end: "21:00",
        },
        weekOptions: { eventOverlap: false, nDays: 6 },
      }
      // [eventsServicePlugin]
    );

    console.log(transformedScheduleEvents)
  } else {
    return <>waiting...</>;
  }

  return (
    <div>
      <div className="pointer-events-none">
        <ScheduleXCalendar calendarApp={calendar} customComponents={{timeGridEvent: timeGridEvent}}/>
      </div>
    </div>
  );
};

export default ScheduleView;
