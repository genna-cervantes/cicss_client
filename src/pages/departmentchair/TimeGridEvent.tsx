import { CalendarEvent } from "@schedule-x/calendar";

type props = { calendarEvent: CalendarEvent };

const timeGridEvent = ({ calendarEvent }: props) => {
  console.log(calendarEvent);

  let desc = JSON.parse(calendarEvent?.description ?? "");

  let startTime = calendarEvent.start.split(" ")[1];
  let endTime = calendarEvent.end.split(" ")[1];

  let violations = desc.violations ?? [];

  // 1hr is 115px -> such a random number lol 7.188rem

  // console.log(eventHeight);


  return (
    <div
      className={`bg-yellow-400 font-Manrope font-semibold px-8 py-6 flex flex-col justify-between h-full ${violations.length === 0 ? '' : 'border-2 border-red-600'}`}
    >
      <div>
        <h1 className="font-bold text-xl">{calendarEvent.title}</h1>
        <h2>Course Name</h2>
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
  );
};

export default timeGridEvent;
