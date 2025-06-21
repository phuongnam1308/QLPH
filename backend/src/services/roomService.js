const Room = require("../models/Room");

module.exports = {
  createRoom: async (roomData) => {
    try {
      const room = await Room.create(roomData);
      return room;
    } catch (error) {
      throw new Error("Error creating room: " + error.message);
    }
  },
  getRooms: async () => {
    try {
      const rooms = await Room.find();
      return rooms;
    } catch (error) {
      throw new Error("Error fetching rooms: " + error.message);
    }
  },
  updateRoom: async (roomId, roomData) => {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(roomId, roomData, {
        new: true,
      });
      return updatedRoom;
    } catch (error) {
      throw new Error("Error updating room: " + error.message);
    }
  },
};
