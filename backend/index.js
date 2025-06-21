const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./src/config/database");
const routerRoom = require("./src/router/routeRoom");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ 
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);
app.use('/api/rooms', roomRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API not found' });
});

app.use("/api/", routerRoom);

(async () => {
  try {
    await connection();
    await initAdmin();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();