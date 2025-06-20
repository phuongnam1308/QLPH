const Room = require("../models/roomModel");
module.exports = {
  createRoom: async (roomData) => {
    try {
      const room = await Room.create(roomData);
      return room;
    } catch (error) {
      throw new Error("Error creating room: " + error.message);
    }
  },
};
