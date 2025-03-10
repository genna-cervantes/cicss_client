import { CalendarApp, createViewWeek } from '@schedule-x/calendar';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import React, { useState } from 'react'
import { weekDates } from '../utils/constants';

const ScheduleView = () => {

    const [events, setEvents] = useState(
        [{
            id: 1,
            title: "Machine Learning",
            start: `${weekDates.Monday} 08:00`,
            end: `${weekDates.Monday} 10:00`,
            location: "Room 1903",
            people: ["Jessie James Suarez"],
          },]
    )

    // useeffect the /scheudle endpoint

    const calendar: CalendarApp = useCalendarApp({
        views: [createViewWeek()],
        events: events,
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
            // Helper: convert a "YYYY-MM-DD HH:mm" string to a Date.
            // const parseDateTime = (dateTimeStr: string) =>
            //   new Date(dateTimeStr.replace(" ", "T"));
    
            // const newStart = parseDateTime(newEvent.start);
            // const newEnd = parseDateTime(newEvent.end);
    
            // // Instead of $app.config.events, access the events from the calendarEvents store.
            // const events = $app.calendarEvents.list.value;

            console.log('old event', oldEvent)
            console.log('new event', newEvent)
            console.log('app', $app)
    
            return true;
          },
        },
      });
    

  return (
    <div>
        <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}

export default ScheduleView