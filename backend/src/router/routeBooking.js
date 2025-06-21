const express = require("express");
const router = express.Router();

const {
    createBooking,
    cancelBooking,
    getBookings,
    getUserBookingHistory,
    approveBooking,
    deleteBookings
} = require("../controllers/BookingController");

router.post("/", createBooking);
router.put("/cancel/:bookingId", cancelBooking);
router.get("/", getBookings);
router.get("/user/:userId", getUserBookingHistory);
router.delete("/delete-multiple", deleteBookings);
router.put("/approve/:bookingId", approveBooking);

module.exports = router;
