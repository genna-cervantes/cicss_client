import { CalendarEvent } from "@schedule-x/calendar";

type props = { calendarEvent: CalendarEvent };

const ONE_HOUR_IN_REM = 7.2;

const subtractMilitaryTime = (militaryTime1: number, militaryTime2: number) => {

  // console.log('subtracting military time');
  let roundedMilitaryTimeHours1 = Math.ceil(militaryTime1 / 100) * 100;
  let militaryTime1Minutes = militaryTime1 % 100;

  // subtract hours muna
  let roundedMilitaryTimeHours2 = Math.ceil(militaryTime2 / 100) * 100;
  let militaryTime2Minutes = militaryTime2 % 100;

  let subtractedHours = roundedMilitaryTimeHours1 - roundedMilitaryTimeHours2;
  let subtractedMinutes = militaryTime1Minutes - militaryTime2Minutes;

  if (subtractedMinutes > 0) {
      return subtractedHours - 100 + subtractedMinutes;
  }
  return subtractedHours + Math.abs(subtractedMinutes);
};

const getTimeGridLengthInHours = (startTime: string, endTime: string) => {
  let bareStart = `${startTime.split(':')[0]}${startTime.split(':')[1]}`
  let bareEnd = `${endTime.split(':')[0]}${endTime.split(':')[1]}`

  let totalTime = subtractMilitaryTime(parseInt(bareEnd), parseInt(bareStart));

  let hours = Math.floor(totalTime / 100)
  let minutes = Math.floor(totalTime % 100)

  let totalMinutes = (hours * 60) + minutes;

  return totalMinutes / 60;
}

const timeGridEvent = ({ calendarEvent }: props) => {

  console.log(calendarEvent)

  let desc = JSON.parse(calendarEvent?.description ?? '')

  let startTime = calendarEvent.start.split(' ')[1]
  let endTime = calendarEvent.end.split(' ')[1]

  // 1hr is 115px -> such a random number lol 7.188rem

  let eventLength = getTimeGridLengthInHours(startTime, endTime);
  let eventHeight = ONE_HOUR_IN_REM * eventLength;

  console.log(eventHeight)

  console.log(eventLength)

  return (
    <div className='bg-purple-500 font-Manrope font-semibold' style={{ height: `${eventHeight}rem` }}>
      <h1>{calendarEvent.title}</h1>
      <h2>Course Name</h2>
      <h2>{desc.type}</h2>
      <h2>{calendarEvent.location}</h2>
      <h2>{calendarEvent.people?.[0] == undefined ? 'GenEd Prof' : calendarEvent.people}</h2>
      <h2>{startTime} to {endTime}</h2>
    </div>
  );
}

export default timeGridEvent;