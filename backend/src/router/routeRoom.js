const express = require("express");
const { postRoomAPI, getRoomAPI } = require("../controllers/roomController");
const routerRoom = express.Router();
routerRoom.post("/room", postRoomAPI);
routerRoom.get("/room", getRoomAPI);
module.exports = routerRoom;
