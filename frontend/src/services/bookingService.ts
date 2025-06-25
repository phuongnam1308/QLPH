import instance from "../utils/custome.axios";

const bookingService = { 
    getBookings: async () => {
        const response = await instance.get("/api/booking", {
            params: {
                limit: -1
            }
        });
        return response.data;
    },
 
    createBooking: async (bookingData: {
        roomId: string;
        date: string;
        startTime: string;
        endTime: string;
        title: string;
    }) => {
        const response = await instance.post("/api/booking", bookingData);
        return response;
    },
    
    approveBooking: async (bookingId: string) => {
        const response = await instance.put(`/api/booking/approve/${bookingId}`);
        return response;
    },
    
    cancelBooking: async (bookingId: string, cancelReason: string) => {
        const response = await instance.put(`/api/booking/cancel/${bookingId}`, {
        cancelReason,
        });
        return response;
    },
    getEmployee: async () => {
        const response = await instance.get("/api/user")
        return response.data;
    },
 
};

export default bookingService;
