import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  CalendarApp,
  createCalendar,
  createViewWeek,
} from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import "../../components/custom-calendar.css";
import "../../components/custom-event.css";
import { dateToDay, weekDates } from "../../utils/constants";
import { transformToScheduleEvents } from "../../components/ScheduleView";
import { useEffect, useState } from "react";
import timeGridEvent from "./TimeGridEvent";

const ManualEdit = ({
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
      const res = await fetch("http://localhost:3000/schedule/class/CS/1/CSA"); // DEFAULT NA SIMULA
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
        filter,
        value
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
        const department = localStorage.getItem("department") ?? "CS";
        const res = await fetch(
          `http://localhost:3000/schedule/class/${department}/${year}/${section}`
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
        const res = await fetch(`http://localhost:3000/schedule/tas/${tasId}`);
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
          `http://localhost:3000/schedule/room/${roomId}`
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

  let calendar: CalendarApp;
  if (transformedScheduleEvents) {
    calendar = createCalendar({
      views: [createViewWeek()],
      events: transformedScheduleEvents,
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
          const parseDateTime = (dateTimeStr: string) =>
            new Date(dateTimeStr.replace(" ", "T"));

          const newStart = parseDateTime(newEvent.start);
          const newEnd = parseDateTime(newEvent.end);

          //  id: schedBlock.id,
          //         title: filter !== 'Section' ? schedBlock.course : schedBlock.course.subjectCode,
          //         start: `${weekDates[schoolDay]} ${transformMilitaryTimeRawToTime(schedBlock.timeBlock.start)}`,
          //         end: `${weekDates[schoolDay]} ${transformMilitaryTimeRawToTime(schedBlock.timeBlock.end)}`,
          //         location: filter !== 'Room' ? schedBlock.room.roomId : '',
          //         people: [filter === 'Section' ? schedBlock.tas.tas_name : `${schedBlock.year}${schedBlock.section}`], // magkaiba pa ung convnetiona mp
          //         description: JSON.s

          // use new start and new end to check with backend
          console.log(newEvent);
          if (filter === "Section") {
            let date: string = newEvent.start.split(" ")[0];
            let start: string = `${newEvent.start.split(" ")[1].slice(0, 2)}${newEvent.start.split(" ")[1].slice(3)}`;
            let end: string = `${newEvent.end.split(" ")[1].slice(0, 2)}${newEvent.end.split(" ")[1].slice(3)}`;

            // "{"type":"lec","violations":[]}"
            let description = JSON.parse(newEvent?.description ?? "");

            const reqObj = {
              section: value.slice(1),
              year: value.slice(0, 1),
              department: value.slice(1, 3),
              id: newEvent.id,
              room: {
                roomId: newEvent.location,
              },
              tas: newEvent?.people?.[0] ?? "GENED_PROF",
              day: dateToDay[date],
              timeBlock: {
                start,
                end,
              },
              course: {
                type: description?.type,
                category: description?.category,
                subjectCode: newEvent.title
              },
              violations: description?.violations,
            };

            console.log(reqObj);
          }

          // const events = $app.calendarEvents.list.value;

          // for (const evt of events) {
          //   // Skip the event that is being updated.
          //   if (evt.id === oldEvent.id) continue;

          //   const evtStart = parseDateTime(evt.start);
          //   const evtEnd = parseDateTime(evt.end);

          //   // Check for overlapping time intervals.
          //   console.log('ns', newStart)
          //   console.log('es', evtStart)
          //   // check
          // }
          return true;
        },
      },
    });

    // console.log(transformedScheduleEvents)
  } else {
    return <>waiting...</>;
  }

  return (
    <ScheduleXCalendar
      calendarApp={calendar}
      customComponents={{ timeGridEvent: timeGridEvent }}
    />
  );
};

export default ManualEdit;
