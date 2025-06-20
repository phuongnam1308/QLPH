const { createRoom, getRooms } = require("../services/roomService");

module.exports = {
  postRoomAPI: async (req, res) => {
    try {
      const roomData = req.body;
      const room = await createRoom(roomData);
      res.status(201).json({ success: true, data: room });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getRoomAPI: async (req, res) => {
    try {
      const rooms = await getRooms();
      res.status(200).json({ success: true, data: rooms });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
