import { CalendarEvent } from "@schedule-x/calendar";

type props = { calendarEvent: CalendarEvent };

export default function ({ calendarEvent }: props) {
  return (
    <div className="bg-purple-500 font-Manrope font-semibold h-20">
      <span>{calendarEvent.title}</span>
    </div>
  );
}
