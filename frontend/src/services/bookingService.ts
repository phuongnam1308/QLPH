import axios from "../utils/custome.axios";

const bookingService = {
    async getBookings() {
        const response = await axios.get("/api/booking");
        return response.data;
    },
    async createBooking(bookingData: any) {
        console.log("Creating booking with data:", bookingData);
        const response = await axios.post("/api/booking", bookingData);

        return response.data;
    },
};

export default bookingService;
