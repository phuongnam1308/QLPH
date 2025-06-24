const express = require("express");
const {
  postRoomAPI,
  getRoomAPI,
  putRoomAPI,
  deleteRoomAPI,
} = require("../controllers/roomController");
const { validateRoomId, validateRoom } = require("../validate/validateRom");

const routerRoom = express.Router();
routerRoom.post("/room", validateRoom, postRoomAPI);
routerRoom.get("/room", getRoomAPI);
routerRoom.put("/room/:id", validateRoomId, validateRoom, putRoomAPI);
routerRoom.delete("/room/:id", validateRoomId, deleteRoomAPI);
module.exports = routerRoom;
