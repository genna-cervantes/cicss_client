import {
  CalendarApp,
  createCalendar,
  createViewWeek,
} from "@schedule-x/calendar";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import React, { useEffect, useState } from "react";
import { weekDates } from "../utils/constants";
import timeGridEvent from "../pages/departmentchair/TimeGridEvent";
import { transformToScheduleEvents } from "./ScheduleView";

// export const dayKeysToFull: any = {
//   M: "Monday",
//   T: "Tuesday",
//   W: "Wednesday",
//   TH: "Thursday",
//   F: "Friday",
//   S: "Saturday",
// };

// export const transformMilitaryTimeRawToTime = (rawMilitaryTime: string) => {
//   if (rawMilitaryTime.length === 3) {
//     rawMilitaryTime = "0" + rawMilitaryTime;
//   }

//   return `${rawMilitaryTime.slice(0, 2)}:${rawMilitaryTime.slice(2)}`;
// };

// export const transformToScheduleEvents = (rawSchedule: any, filter: string, value: string) => {
//   let transformedEvents = [];

//   // console.log(rawSchedule)

//   const dayKeys = Object.keys(rawSchedule);
//   for (let i = 0; i < dayKeys.length; i++) {

//     if (dayKeys[i] === 'violations' || dayKeys[i] === 'units'){
//       continue;
//     }

//     // call the generate function again - error 

//     let daySched = rawSchedule[dayKeys[i]];
//     let schoolDay = dayKeysToFull[dayKeys[i]];

//     for (let j = 0; j < daySched.length; j++) {
//       let schedBlock = daySched[j];

//       // console.log('schedBlock')
//       // console.log(schedBlock)
//       // console.log(filter)
//       // console.log(value)

//       // nag eerror pag walang schedule ung prof na un -- gawing empty

//       let transformedSchedBlock = {
//         id: schedBlock.id,
//         title: filter !== 'Section' ? schedBlock.course : schedBlock.course.subjectCode,
//         start: `${weekDates[schoolDay]} ${transformMilitaryTimeRawToTime(schedBlock.timeBlock.start)}`,
//         end: `${weekDates[schoolDay]} ${transformMilitaryTimeRawToTime(schedBlock.timeBlock.end)}`,
//         location: filter !== 'Room' ? schedBlock.room.roomId : '',
//         people: [filter === 'Section' ? schedBlock.tas.tas_name : `${schedBlock.year}${schedBlock.section}`], // magkaiba pa ung convnetiona mp
//         description: JSON.stringify({type: schedBlock.course.type, violations: schedBlock.violations ?? []})
//       };

//       transformedEvents.push(transformedSchedBlock);
//     }
//   }

//   return transformedEvents;
// };

const ManualEditScheduleView = ({
  filter = "Section",
  value = "1CSA",
}: {
  filter: string;
  value: string;
}) => {

  const [scheduleEvents, setScheduleEvents] = useState<any>();
  const [transformedScheduleEvents, setTransformedScheduleEvents] =
    useState<any>();
  const [error, setError] = useState("");

  // default schedule to show
  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetch("/schedule-api/schedule/class/CS/1/CSA"); // DEFAULT NA SIMULA
      const data = await res.json();
      let sched = data;

      if (data?.error){
        sched = {}
      }

      if (res.ok) {
        setScheduleEvents(sched);
      } else {
        setError("may error sa pag kuha ng sched");
      }
    };

    if (filter === 'Section'){
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

      let transformedEvents = transformToScheduleEvents(scheduleEvents, filter, value);
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
        const department = localStorage.getItem('department') ?? 'CS'
        const res = await fetch(
          `/schedule-api/schedule/class/${department}/${year}/${section}`
        ); // DEFAULT NA CS MUNA
        const data = await res.json();
        let sched = data;

        if (data?.error){
          sched = {}
        }

        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched");
        }
      };

      fetchSchedule();
    }else if (filter === "Professor"){
      let tasId = value;

      // console.log('tas', tasId)
      
      const fetchSchedule = async () => {
        const res = await fetch(`/schedule-api/schedule/tas/${tasId}`)
        const data = await res.json()
        let sched = data;

        if (data?.error){
          sched = {}
        }

        // console.log('data', data)
        
        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched - tas");
        }
      }

      fetchSchedule();
    }else if (filter === "Room"){
      let roomId = value;

      // console.log('room', roomId)
      
      const fetchSchedule = async () => {
        const res = await fetch(`/schedule-api/schedule/room/${roomId}`)
        const data = await res.json()
        let sched = data;

        if (data?.error){
          sched = {}
        }

        // console.log('data', data)
        
        if (res.ok) {
          setScheduleEvents(sched);
        } else {
          setError("may error sa pag kuha ng sched - tas");
        }
      }

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

    // console.log(transformedScheduleEvents)
  } else {
    return <>waiting...</>;
  }

  return (
        // <ScheduleXCalendar calendarApp={calendar} customComponents={{timeGridEvent: timeGridEvent}}/>
        <ScheduleXCalendar calendarApp={calendar} />
        // <h1>helo</h1>
    // <div>
    //   {/* <div className="pointer-events-none"> */}
    //   <div>
    //   </div>
    // </div>   
  );
};

export default ManualEditScheduleView;
