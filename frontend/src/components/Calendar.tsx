import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
const CalendarComponent: React.FC = () => {
  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek',
      }}
      events={[
        {
          title: 'Meeting',
          start: '2025-06-24T10:00:00',
          end: '2025-06-24T11:00:00',
        },
      ]}
      selectable={true}
      editable={true}
    />
  );
};

export default CalendarComponent;
