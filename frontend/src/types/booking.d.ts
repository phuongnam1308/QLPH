export interface BookingAPIResponse {
    _id: string; 
    date: string;            
    startTime: string;     
    endTime: string;      
    status: string;
    title: string;
    roomId: Room;
    userId: {
        _id: string;
        fullname: string;
        email: string;
        username: string; 
    };
    createdAt: string;
    updatedAt: string;
    cancelReason?: string | null;
}
export interface CalendarEventExtendedProps {
    roomId: string | null;
    roomName: string;
    status: string;
    userId: string;
    userName: string;
}
interface CalendarEvent {
    id: string;
    title: string;
    start: string | Date;
    end: string | Date;
    backgroundColor?: string;
    extendedProps: {
      roomId: string;
      roomName: string;
      status: string;
      userId: string;
      userName: string;
    };
}
interface SelectedEvent {
    id: string;
    title: string;
    roomName: string;
    userName: string;
    status: string;
    start: Date;
    end: Date;
    userId: string;
  }
  