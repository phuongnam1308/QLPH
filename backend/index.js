const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connection = require('./src/config/database');
const initAdmin = require('./src/utils/initAdmin');

const authRouter = require('./src/router/routeAuth');
const userRouter = require('./src/router/routeUser');
const roleRouter = require('./src/router/routeRole');

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

app.use((err, req, res, next) => {
  console.error('Lỗi server:', err.message);
  res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
});

const startServer = async () => {
  try {
    await connection();
    await initAdmin();
    
    app.listen(PORT, () => {
      console.log(`Server chạy trên cổng ${PORT}`);
    });
  } catch (error) {
    console.error('Khởi động server thất bại:', error);
    process.exit(1);
  }
};

startServer();