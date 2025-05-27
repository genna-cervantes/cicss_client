import {
  createCalendar,
  createViewWeek,
} from "@schedule-x/calendar";
import { ScheduleXCalendar } from "@schedule-x/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { weekDates } from "../utils/constants";
import TimeGridEvent from "../pages/departmentchair/TimeGridEvent";

export const dayKeysToFull: any = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  TH: "Thursday",
  F: "Friday",
  S: "Saturday",
};

export const transformMilitaryTimeRawToTime = (rawMilitaryTime: string) => {
  if (rawMilitaryTime.length === 3) {
    rawMilitaryTime = "0" + rawMilitaryTime;
  }

  return `${rawMilitaryTime.slice(0, 2)}:${rawMilitaryTime.slice(2)}`;
};

export const getViolations = (rawSchedule: any) => {
  let violations = [];

  const dayKeys = Object.keys(rawSchedule);
  for (let i = 0; i < dayKeys.length; i++) {
    if (dayKeys[i] === "violations" || dayKeys[i] === "units") {
      continue;
    }

    // call the generate function again - error

    let daySched = rawSchedule[dayKeys[i]];
    // let schoolDay = dayKeysToFull[dayKeys[i]];

    for (let j = 0; j < daySched.length; j++) {
      let schedBlock = daySched[j];

      violations.push(...(schedBlock.violations ?? []));
    }
  }

  // console.log(violations)

  return violations;
};

export const transformToScheduleEvents = (
  rawSchedule: any,
  filter: string
) => {
  let transformedEvents = [];

  const dayKeys = Object.keys(rawSchedule);
  for (let i = 0; i < dayKeys.length; i++) {
    if (dayKeys[i] === "violations" || dayKeys[i] === "units") {
      continue;
    }

    let daySched = rawSchedule[dayKeys[i]];
    let schoolDay = dayKeysToFull[dayKeys[i]];

    for (let j = 0; j < daySched.length; j++) {
      let schedBlock = daySched[j];

      let transformedSchedBlock = {
        id: schedBlock.id,
        title:
          filter !== "Section"
            ? schedBlock.course
            : schedBlock.course.subjectCode,
        start: `${weekDates[schoolDay]} ${transformMilitaryTimeRawToTime(schedBlock.timeBlock.start)}`,
        end: `${weekDates[schoolDay]} ${transformMilitaryTimeRawToTime(schedBlock.timeBlock.end)}`,
        location: filter !== "Room" ? schedBlock.room.roomId : "",
        people: [
          filter === "Section"
            ? schedBlock.tas.tas_name
            : `${schedBlock.year}${schedBlock.section}`,
        ], 
        description: JSON.stringify({
          type: schedBlock.course.type,
          category: schedBlock.course.category,
          violations: schedBlock.violations ?? [],
        }),
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

  const calendarRef = useRef<any>(null);

  const [scheduleEvents, setScheduleEvents] = useState<any>();
  const [transformedScheduleEvents, setTransformedScheduleEvents] =
    useState<any>();
  const [_, setError] = useState("");

  // default schedule to show
  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetch("/schedule-api/schedule/class/CS/1/CSA"); // DEFAULT NA SIMULA
      const data = await res.json();
      let sched = data;

      if (data?.error) {
        sched = {};
      }

      if (res.ok) {
        setScheduleEvents(sched);
      } else {
        setError("may error sa pag kuha ng sched");
      }
    };

    if (filter === "Section") {
      fetchSchedule();
    }
  }, []);

  // rendering when schedule is fetched
  useEffect(() => {
    // console.log("raw schedule events");
    // console.log(scheduleEvents);

    // console.log("transformed schedule events");
    // console.log(transformToScheduleEvents(scheduleEvents))

    if (scheduleEvents) {
      let transformedEvents = transformToScheduleEvents(
        scheduleEvents,
        filter
      );
      setTransformedScheduleEvents(transformedEvents);
    }
  }, [scheduleEvents]);

  // update schedule when go to next or previous
  useEffect(() => {
    // console.log("filter", filter);
    // console.log("value", value);

    if (filter === "Section") {
      let year = value.slice(0, 1);
      let section = value.slice(1);

      // console.log(year);
      // console.log(section);

      const fetchSchedule = async () => {
        let department = localStorage.getItem("department") || "CS";
        if (department == 'undefined') {
          department = "CS"
        }
        const res = await fetch(
          `/schedule-api/schedule/class/${department}/${year}/${section}`
        ); // DEFAULT NA CS MUNA
        const data = await res.json();
        let sched = data;

        if (data?.error) {
          sched = {};
        }

        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched");
        }
      };

      fetchSchedule();
    } else if (filter === "Professor") {
      let tasId = value;

      // console.log('tas', tasId)

      const fetchSchedule = async () => {
        const res = await fetch(`/schedule-api/schedule/tas/${tasId}`);
        const data = await res.json();
        let sched = data;

        if (data?.error) {
          sched = {};
        }

        // console.log('data', data)

        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched - tas");
        }
      };

      fetchSchedule();
    } else if (filter === "Room") {
      let roomId = value;

      // console.log('room', roomId)

      const fetchSchedule = async () => {
        const res = await fetch(
          `/schedule-api/schedule/room/${roomId}`
        );
        const data = await res.json();
        let sched = data;

        if (data?.error) {
          sched = {};
        }

        // console.log('data', data)

        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched - tas");
        }
      };

      fetchSchedule();
    }
  }, [filter, value]);

  // let calendar: CalendarApp;
  
  if (!calendarRef.current) {
    calendarRef.current = 
    createCalendar(
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

    // console.log(transformedScheduleEvents)
  } 

  useEffect(() => {
    if (transformedScheduleEvents && calendarRef.current) {
      calendarRef.current.events.set(transformedScheduleEvents);
    }
    // setChangedSchedBlocks(transformedScheduleEvents)
  }, [transformedScheduleEvents]);

  const memoizedCustomComponents = useMemo(() => ({
      timeGridEvent: TimeGridEvent, // Your custom component for the time grid
    }), []);

  return (
    <div>
      {/* <div className="pointer-events-none"> */}
      <div>
        <ScheduleXCalendar
          calendarApp={calendarRef.current}
          customComponents={memoizedCustomComponents}
        />
      </div>
    </div>
  );
};

export default ScheduleView;
