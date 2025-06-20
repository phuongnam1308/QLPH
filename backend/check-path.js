const path = require("path");
const fs = require("fs");

const targetPath = path.join(__dirname, "src", "utils", "initAdmin.js");

console.log("Đường dẫn kiểm tra:", targetPath);
console.log("File tồn tại?", fs.existsSync(targetPath) ? "✅ CÓ" : "❌ KHÔNG");

if (fs.existsSync(targetPath)) {
  console.log("Nội dung file:");
  console.log(fs.readFileSync(targetPath, "utf8"));
} else {
  console.log("Thư mục cha:", path.dirname(targetPath));
  console.log("Nội dung thư mục:", fs.readdirSync(path.dirname(targetPath)));
}