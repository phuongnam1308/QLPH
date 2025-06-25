const Room = require("../models/Room");

module.exports = {
  createRoom: async (roomData) => {
    try {
      const existingRoom = await Room.countDocuments({ name: roomData.name });
      console.log("existingRoom :>> ", existingRoom);
      if (existingRoom > 0) {
        throw new Error("Tên phòng đã tồn tại");
      }
      const room = await Room.create(roomData);
      return room;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Tên phòng đã tồn tại");
      }
      throw new Error("Lỗi tạo phòng: " + error.message);
    }
  },
  getRooms: async (page, limit) => {
    try {
      let result = null;
      let total = null;
      if (page && limit) {
        let offset = (page - 1) * limit;
        const [roomData, totalRoom] = await Promise.all([
          Room.find().skip(offset).limit(limit).exec(),
          Room.countDocuments(),
        ]);
        result = roomData;
        total = totalRoom;
      } else {
        result = await Room.find({});
      }
      return {
        result,
        pagination: {
          current_page: page || 1,
          limit: limit || 10,
          total_pages: limit > 0 ? Math.ceil(total / limit) : 1,
          total: total,
        },
      };
    } catch (error) {
      throw new Error("Lỗi Lấy thông tin phòng: " + error.message);
    }
  },
  updateRoom: async (roomId, roomData) => {
    try {
      const existingRoom = await Room.findById(roomId);
      if (!existingRoom) {
        throw new Error("Không tìm thấy phòng với ID: " + roomId);
      }
      const roomWithSameName = await Room.find({ name: roomData.name });
      if (
        roomWithSameName.length > 0 &&
        roomWithSameName[0]._id.toString() !== roomId
      ) {
        throw new Error("Tên phòng đã tồn tại");
      }
      const updatedRoom = await Room.findByIdAndUpdate(roomId, roomData, {
        new: true,
      });
      return updatedRoom;
    } catch (error) {
      throw new Error("Lỗi cập nhật phòng: " + error.message);
    }
  },
  deleteRoom: async (roomId) => {
    try {
      const result = await Room.findByIdAndDelete(roomId);
      if (!result) {
        throw new Error("Không tìm thấy phòng");
      } else {
        return { message: "Xóa phòng thành công", result: result };
      }
    } catch (error) {
      throw new Error("Lỗi xóa phòng: " + error.message);
    }
  },
};
