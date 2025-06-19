const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
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
