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