const User = require("../models/User");
const Role = require("../models/Role");
const UserRole = require("../models/UserRole");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

module.exports = async () => {
  try {
    console.log("⏳ Bắt đầu khởi tạo admin...");
    
    // Tạo vai trò admin nếu chưa có
    let adminRole = await Role.findOne({ role_name: "admin" });
    if (!adminRole) {
      console.log("🆕 Tạo vai trò admin mới...");
      adminRole = new Role({
        role_name: "admin",
        description: "Quản trị viên hệ thống"
      });
      await adminRole.save();
      console.log("✅ Đã tạo vai trò admin");
    }

    // Tạo tài khoản admin nếu chưa có
    let adminUser = await User.findOne({ username: "admin" });
    if (!adminUser) {
      console.log("👤 Tạo tài khoản admin mới...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      
      adminUser = new User({
        username: "admin",
        password: hashedPassword,
        fullname: "Quản Trị Viên",
        email: "admin@company.com",
        is_active: true
      });

      await adminUser.save();
      console.log("✅ Đã tạo tài khoản admin");
    }

    // Gán vai trò admin nếu chưa gán
    const existingAssignment = await UserRole.findOne({
      user_id: adminUser._id,
      role_id: adminRole._id
    });
    
    if (!existingAssignment) {
      console.log("🔗 Gán vai trò admin cho tài khoản...");
      const userRole = new UserRole({
        user_id: adminUser._id,
        role_id: adminRole._id
      });
      await userRole.save();
      console.log("✅ Đã gán vai trò admin");
    }
    
    console.log("🎉 Khởi tạo admin hoàn tất");
  } catch (error) {
    console.error("❌ Lỗi khởi tạo admin:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
  }
};