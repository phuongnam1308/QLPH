import React, { useState , useEffect , useRef} from 'react';
import {
    EventDropArg,
    DateSelectArg,
    EventInput, 
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import { toast } from 'react-toastify'; 
import BookingModal, { BookingResult } from './BookingModal';
import bookingService from '../services/bookingService';
import { getRoomsAPI } from '../services/roomService';
import { BookingAPIResponse } from '../types/booking';
import dayjs, { Dayjs } from 'dayjs'; 

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

interface CalendarComponentProps {
	gotoDate: Dayjs | null;
}

const userId = "6854f83f2e174aa5a87dc272";
const Calendar: React.FC<CalendarComponentProps> = ({ gotoDate }) => {
const [events, setEvents] = useState<EventInput[]>([]);

const [openBookingModal, setOpenBookingModal] = useState(false);
const [selectedStart, setSelectedStart] = useState<Date | null>(null);
const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
const [rooms, setRooms] = useState<[]>([]);

const calendarRef = useRef<FullCalendar>(null); 
const [selectedDate, setSelectedDate] = useState<string | null>(null);

useEffect(() => {  
    bookingService.getBookings().then((data: BookingAPIResponse[]) => {
        const events = data.map((booking) => ({
            id: booking._id,
            title: `${booking.roomId?.name || 'Không rõ phòng'} - ${booking.title }`,
            start: `${booking.date}T${booking.startTime}`,
            end: `${booking.date}T${booking.endTime}`,
        }));
        setEvents(events);
    });
 
    getRoomsAPI().then((response) => {
        console.log('Rooms fetched:', response.data.result);
        setRooms(response.data.result);
    })
    .catch((error) => {
        console.error('Error fetching rooms:', error);
    });
}, []);
    
useEffect(() => {
    if (gotoDate) {
    setTimeout(() => {
        goToDate(gotoDate.toDate());
    }, 0);
    }
}, [gotoDate]);

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

    setSelectedStart(newStart);
    setSelectedEnd(newEnd);
    setOpenBookingModal(true);
};

const handleModalClose = async (result: BookingResult) => {
    setOpenBookingModal(false);

    if (!result.success) return;

    const { title, start, end, roomId, roomName } = result.data!;
    const date = dayjs(start).format("YYYY-MM-DD");
    const startTime = dayjs(start).format("HH:mm");
    const endTime = dayjs(end).format("HH:mm");

    try {
        await bookingService.createBooking({
            roomId,
            userId,
            date,
            startTime,
            title,
            endTime
        });

        const newEvent: EventInput = {
            id: `${roomId}-${start}-${end}`,
            title,
            start,
            end,
            extendedProps: {
            roomId,
            roomName,
            },
        }; 
        setEvents([...events, newEvent]);
        toast.success('Đặt lịch thành công!');
    } catch (error) { 
        console.error('Error creating booking:', error);
        toast.error('Đặt lịch không thành công, vui lòng thử lại sau!');
    }
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
const goToDate = (targetDate: Date) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const iso = targetDate.toISOString().split('T')[0];
    calendarApi.changeView('timeGridDay', targetDate);
    setSelectedDate(iso);

    setTimeout(() => {
    calendarApi.scrollToTime?.('00:00:00');
    }, 10);
};
  
    return (
        <div style={{ height: '90vh', overflow: 'hidden' }}>
            <FullCalendar
                ref={calendarRef}
                plugins={[ timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                selectable={true}
                events={events}
                allDaySlot={false}
                dayHeaderContent={({ date }) => {
                    const weekday = date.toLocaleDateString('vi-VN', { weekday: 'short' });
                    const day = date.getDate().toString().padStart(2, '0');
                    const isoDate = date.toISOString().split('T')[0];
                
                    const isSelected = selectedDate === isoDate;
                
                    const handleClick = () => {
                    const calendarApi = calendarRef.current?.getApi();
                    if (!calendarApi) return;
                
                    if (isSelected) {
                        calendarApi.changeView('timeGridWeek');
                        setSelectedDate(null);
                    } else {
                        calendarApi.changeView('timeGridDay', date);
                        setSelectedDate(isoDate);
                    }
                
                    setTimeout(() => {
                        calendarApi.scrollToTime?.('00:00:00');
                    }, 10); 
                    };
                
                    return (
                    <div
                        onClick={handleClick}
                        className="fc-day-header"
                    >
                        <div style={{ fontWeight: 'bold' }}>{weekday}</div>
                        <div className="day-number-select" 
                            style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#1890ff' : 'transparent',
                            color: isSelected ? '#fff' : 'inherit',
                            borderRadius: '4px',
                            padding: '4px',
                            }}>{day}</div>
                    </div>
                    );
                }} 
                
                select={handleDateSelect}
                eventDrop={handleEventDrop}
                titleFormat={{ year: 'numeric', month: 'long' }}
                headerToolbar={{  
                    left: 'prev,next',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay',
                }}
                height="100%"
                nowIndicator={true}  
                scrollTime={new Date().toTimeString().slice(0, 5)}
            />
            <BookingModal
                isOpen={openBookingModal}
                onClose={handleModalClose}
                rooms={rooms}
                start={selectedStart}
                end={selectedEnd}
            />
        </div>
            
    );
};

export default Calendar;
