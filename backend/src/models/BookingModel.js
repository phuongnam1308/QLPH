const mongoose = require("mongoose"); 
const bookingSchema = new mongoose.Schema(
    {
    bookingCode: {
        type: String,
        unique: true,
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: String, 
        required: true,
    },
    startTime: {
        type: String, 
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
    },
    status: {
        type: String,
        enum: [ "pending", "approved", "cancelled" ],
        default: "pending",
    },
    cancelReason: {
        type: String,
        default: null,
    },
    },
    {
    timestamps: true,
    }
);
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;