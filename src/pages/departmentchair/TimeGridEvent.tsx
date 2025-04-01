import { CalendarEvent } from "@schedule-x/calendar";

type props = { calendarEvent: CalendarEvent };

const timeGridEvent = ({ calendarEvent }: props) => {
  // console.log(calendarEvent);

  let desc = JSON.parse(calendarEvent?.description ?? "");

  let startTime = calendarEvent.start.split(" ")[1];
  let endTime = calendarEvent.end.split(" ")[1];

  let violations = desc.violations ?? [];

  // 1hr is 115px -> such a random number lol 7.188rem

  // console.log(eventHeight);

  return (
    // <div className="group">
    <div
      className={`group ${violations.length > 0 ? `hover:bg-red-600` : ''} bg-yellow-400 font-Manrope font-semibold px-8 py-6 flex flex-col justify-between h-full ${violations.length === 0 ? "" : "border-2 border-red-600"}`}
    >
      <div className={`${violations.length > 0 ? `block group-hover:hidden` : ''}`}>
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
      {violations.length > 0 && <div className="group-hover:block hidden absolute bg-red-600 text-white" >
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
    // </ div>
  );
};

export default timeGridEvent;
