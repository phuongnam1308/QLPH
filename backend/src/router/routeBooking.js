const express = require("express");
const router = express.Router();
const { auth, adminOnly, userOrAdmin } = require("../Middleware/authMiddleware");
const {
    createBooking,
    cancelBooking,
    getBookings,
    getUserBookingHistory,
    approveBooking,
    deleteBookings
} = require("../controllers/BookingController");

router.post("/", auth, createBooking);
router.put("/cancel/:bookingId", auth, cancelBooking);
router.get("/", auth, getBookings);
router.get("/user/:userId", auth, getUserBookingHistory);
router.delete("/delete-multiple", auth, userOrAdmin, deleteBookings);
router.put("/approve/:bookingId", auth, adminOnly, approveBooking);

module.exports = router;
