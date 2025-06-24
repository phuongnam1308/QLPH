import React, { useState } from 'react';
import FullCalendar, {
    EventDropArg,
    DateSelectArg,
    EventInput,
} from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import { toast } from 'react-toastify';
const isSameDay = (d1: Date, d2: Date) =>
d1.getFullYear() === d2.getFullYear() &&
d1.getMonth() === d2.getMonth() &&
d1.getDate() === d2.getDate();

const isOverlapping = (
start1: Date,
end1: Date,
start2: Date,
end2: Date
) => start1 < end2 && start2 < end1;

const CalendarComponent: React.FC = () => {
const [events, setEvents] = useState<EventInput[]>([
    {
    id: '1',
    title: 'Meeting',
    start: '2025-06-24T10:00:00',
    end: '2025-06-24T11:00:00',
    },
]);
    
const handleDateSelect = (selectInfo: DateSelectArg) => {
    const newStart = selectInfo.start;
    const newEnd = selectInfo.end;

    const now = new Date();

    if (newStart < now) {
        toast.error('Không thể tạo sự kiện ở ngày trong quá khứ!');
        return;
    }

    if (!isSameDay(newStart, newEnd)) {
        toast.error('Chỉ được chọn thời gian trong cùng một ngày!');
        return;
    }

    const hasOverlap = events.some((e) => {
    const eStart = new Date(e.start as string);
    const eEnd = new Date(e.end as string);
    return isOverlapping(newStart, newEnd, eStart, eEnd);
    });

    if (hasOverlap) {
        toast.error('Thời gian bị trùng với sự kiện khác!');
        return;
    }

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const formatTime = (d: Date) => d.toTimeString().split(':').slice(0, 2).join(':');

    console.log('Ngày bắt đầu:', formatDate(newStart));
    console.log('Giờ bắt đầu:', formatTime(newStart));
    console.log('Ngày kết thúc:', formatDate(newEnd));
    console.log('Giờ kết thúc:', formatTime(newEnd)); 
    
    const newEvent: EventInput = {
        id: String(new Date().getTime()),
        title: 'New Event',
        start: newStart,
        end: newEnd,
    };

    setEvents([...events, newEvent]);
};
  

const handleEventDrop = (dropInfo: EventDropArg) => {
    const movedEvent = dropInfo.event;
    const newStart = movedEvent.start!;
    const newEnd = movedEvent.end!;  
    
    if (!isSameDay(newStart, newEnd)) { 
        dropInfo.revert();
        return;
    }  
    const hasOverlap = events.some((e) => {
    if (e.id === movedEvent.id) return false;
        const eStart = new Date(e.start as string);
        const eEnd = new Date(e.end as string);
        return isOverlapping(newStart, newEnd, eStart, eEnd);
    });

    if (hasOverlap) {
        toast.error('Thời gian bị trùng với sự kiện khác!');
        dropInfo.revert();
        return;
    }

    const updatedEvents = events.map((event) =>
    event.id === movedEvent.id
        ? {
            ...event,
            start: newStart,
            end: newEnd,
        }
        : event
    );
    setEvents(updatedEvents);
};

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
        <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        editable={true}
        events={events}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        headerToolbar={{ 
            left: 'title',
            right: 'timeGridDay,timeGridWeek',
        }}
        height="100%" 
        />
    </div>
      
);
};

export default CalendarComponent;
