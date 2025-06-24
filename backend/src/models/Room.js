const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    description: {
      type: String,
    },
    equipment: {
      type: String,
    },
    is_active: {
      type: String,
      enum: ["available", "booked", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);
const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
