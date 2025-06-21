const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./src/config/database");
const initAdmin = require("./src/utils/initAdmin");

const authRouter = require("./src/router/routeAuth");
const userRouter = require("./src/router/routeUser");
const roleRouter = require("./src/router/routeRole");
const roomRouter = require("./src/router/routeRoom");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/roles", roleRouter);
app.use("/api/", roomRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API not found" });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const startServer = async () => {
  try {
    await connection();
    await initAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
