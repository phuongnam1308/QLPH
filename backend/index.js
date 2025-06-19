const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./src/config/dbConnect");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.get("/", (req, res) => {
  res.send("Server for Meeting Room Management is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
