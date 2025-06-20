const { createRoom } = require("../services/roomService");

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
};
