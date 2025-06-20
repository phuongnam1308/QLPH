const express = require("express");
const { postRoomAPI, getRoomAPI } = require("../controllers/roomController");
const { validateRoom } = require("../validate/validateRom");

const routerRoom = express.Router();
routerRoom.post("/room", validateRoom, postRoomAPI);
routerRoom.get("/room", getRoomAPI);
module.exports = routerRoom;
