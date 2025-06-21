const express = require("express");
const {
  postRoomAPI,
  getRoomAPI,
  putRoomAPI,
} = require("../controllers/roomController");
const { validateRoom } = require("../validate/validateRom");

const routerRoom = express.Router();
routerRoom.post("/room", validateRoom, postRoomAPI);
routerRoom.get("/room", getRoomAPI);
routerRoom.put("/room/:id", validateRoom, putRoomAPI);
module.exports = routerRoom;
