import { CalendarEvent } from "@schedule-x/calendar";
import React from "react";
import { useAppContext } from "../../context/AppContext";

type Props = { calendarEvent: CalendarEvent };

// Create a regular component function first
const TimeGridEvent = ({ calendarEvent }: Props) => {
  const {role} = useAppContext()
  let desc = JSON.parse(calendarEvent?.description ?? "");

  let startTime = calendarEvent.start.split(" ")[1];
  let endTime = calendarEvent.end.split(" ")[1];

  let violations = desc.violations ?? [];

  return (
    <div
      className={`group ${(violations.length > 0 && role === 'Department Chair') ? `hover:bg-red-600` : ''} bg-yellow-400 font-Manrope font-semibold px-8 py-6 flex flex-col justify-between h-full ${(violations.length > 0 && role === 'Department Chair') ? "border-2 border-red-600" : ""}`}
    >
      <div className={`${(violations.length > 0 && role === 'Department Chair') ? `block group-hover:hidden` : ''}`}>
        <div>
          <h1 className="font-bold text-xl">{calendarEvent.title}</h1>
          <h2>{desc.type}</h2>
          <h2>{calendarEvent.location}</h2>
          <h2>
            {calendarEvent.people?.[0] == undefined
              ? "GenEd Prof"
              : calendarEvent.people}
          </h2>
        </div>
        <div>
          <h2>
            {startTime} to {endTime}
          </h2>
        </div>
      </div>
      {(violations.length > 0 && role === 'Department Chair') && <div className="group-hover:block hidden absolute bg-red-600 text-white" >
        {violations.map((viol: any) => {
          return (
            <div className="flex flex-col gap-y-1" key={viol.id}>
              <h1 className="font-black">{viol.type}</h1>
              <h2>- {viol.description}</h2>
            </div>
          )
        })}
      </div>}
    </div>
  );
};

// Export the component as React.memo to prevent unnecessary re-renders
export default React.memo(TimeGridEvent);