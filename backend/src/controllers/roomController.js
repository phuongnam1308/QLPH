const {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
} = require("../services/roomService");

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
      let { page, limit } = req.query;

      const rooms = await getRooms(page, limit);
      res.status(200).json({ success: true, data: rooms });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  putRoomAPI: async (req, res) => {
    try {
      const roomId = req.params.id;
      const roomData = req.body;
      const updatedRoom = await updateRoom(roomId, roomData);
      res.status(200).json({ success: true, data: updatedRoom });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  deleteRoomAPI: async (req, res) => {
    try {
      const roomId = req.params.id;
      const result = await deleteRoom(roomId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
