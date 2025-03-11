import { CalendarEvent } from "@schedule-x/calendar";

type props = { calendarEvent: CalendarEvent };

const timeGridEvent = ({ calendarEvent }: props) => {

  console.log(calendarEvent)

  let desc = JSON.parse(calendarEvent?.description ?? '')

  // 1hr is 115px -> such a random number lol 7.188rem

  return (
    <div className="bg-purple-500 font-Manrope font-semibold h-[7.188rem]">
      <h1>{calendarEvent.title}</h1>
      <h2>Course Name</h2>
      <h2>{desc.type}</h2>
      <h2>{calendarEvent.location}</h2>
      <h2>{calendarEvent.people?.[0] == undefined ? 'GenEd Prof' : calendarEvent.people}</h2>
      <h2></h2>
    </div>
  );
}

export default timeGridEvent;