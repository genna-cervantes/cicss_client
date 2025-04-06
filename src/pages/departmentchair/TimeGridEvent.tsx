import { CalendarEvent } from "@schedule-x/calendar";
import React from "react";
import { useAppContext } from "../../context/AppContext";

type Props = { calendarEvent: CalendarEvent };

const TimeGridEvent = ({ calendarEvent }: Props) => {
  const { role } = useAppContext();
  let desc = JSON.parse(calendarEvent?.description ?? "{}");

  let startTime = calendarEvent.start.split(" ")[1];
  let endTime = calendarEvent.end.split(" ")[1];

  let violations = desc.violations ?? [];

  // Determine block color based on event title or other properties
  const getBlockColor = () => {
    let baseColor = "bg-blue-500";

    const title = calendarEvent.title?.toLowerCase() || "";

    if (title.includes("cs")) {
      baseColor = "bg-blue-500";
    } else if (
      title.includes("purpcom") ||
      title.includes("pathfit") ||
      title.includes("thy") ||
      title.includes("ele") ||
      title.includes("sts") ||
      title.includes("read") ||
      title.includes("fil")
    ) {
      baseColor = "bg-teal-400";
    } else if (desc.type === "lec") {
      baseColor = "bg-blue-500";
    } else if (desc.type === "lab") {
      baseColor = "bg-green-400";
    }

    return baseColor;
  };

  return (
    <div
      className={`group ${
        violations.length > 0 && role === "Department Chair"
          ? `hover:bg-red-600`
          : ""
      } ${getBlockColor()} font-Manrope font-semibold px-8 py-6 flex flex-col justify-between h-full ${
        violations.length > 0 && role === "Department Chair"
          ? "border-2 border-red-600"
          : ""
      } m-0.5 rounded-xl`}
    >
      <div
        className={`${
          violations.length > 0 && role === "Department Chair"
            ? `block group-hover:hidden`
            : ""
        }`}
      >
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
      {violations.length > 0 && role === "Department Chair" && (
        <div className="group-hover:block hidden absolute bg-red-600 text-white m-0.5 p-2">
          {violations.map((viol: any) => {
            return (
              <div className="flex flex-col gap-y-1" key={viol.id}>
                <h1 className="font-black">{viol.type}</h1>
                <h2>- {viol.description}</h2>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Export the component as React.memo to prevent unnecessary re-renders
export default React.memo(TimeGridEvent);
