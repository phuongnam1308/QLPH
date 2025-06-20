require('dotenv').config();
const mongoose = require('mongoose');

const connection = async () => {
  const options = {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  
  try {
    await mongoose.connect(process.env.DB_HOST, options);
    console.log('Đã kết nối MongoDB');
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connection;