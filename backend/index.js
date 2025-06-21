const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./src/config/database");
const routerRoom = require("./src/router/routeRoom");
const routerBooking = require("./src/router/routeBooking");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", routerRoom);
app.use("/api/booking", routerBooking);
(async () => {
  try {
    await connection();
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("error connect to server:>> ", error);
  }
})();
