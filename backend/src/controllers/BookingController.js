const Booking = require("../models/BookingModel");

const createBooking = async (req, res) => { 
    const { roomId, date, startTime, endTime, title } = req.body;
    const userId = req.user.id; 
    
    const nowDate = new Date();
    const bookingDate = new Date(date);
    if (bookingDate < nowDate.setHours(0, 0, 0, 0)) {
        return res.status(400).json({ error: "Không thể đặt lịch trong quá khứ" });
    }

    if (!roomId || !userId || !date || !startTime || !endTime || !title) {
        return res.status(400).json({ error: "Thiếu thông tin đặt phòng" });
    }

    if (startTime >= endTime) {
        return res.status(400).json({ error: "Giờ kết thúc phải sau giờ bắt đầu" });
    }

    try {
        const exists = await Booking.findOne({
            roomId,
            date,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
            status: { $ne: "cancelled" }
        });

        if (exists) {
            return res.status(409).json({ error: "Phòng đã được đặt trong khung giờ này", data: exists });
        }

        const booking = new Booking({ roomId, userId, date, startTime, endTime, title });
        await booking.save();
        res.status(201).json(booking);  

    } catch (error) {  
        res.status(500).json({ error: "Lỗi máy chủ khi tạo đặt phòng" });
    }
};


const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { cancelReason } = req.body;

    if (!cancelReason) {
        return res.status(400).json({ error: "Vui lòng cung cấp lý do hủy" });
    }

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: "Không tìm thấy đặt phòng" });
        }
 
        if (booking.status === "cancelled") {
            return res.status(400).json({ error: "Lịch đã bị hủy trước đó" });
        }

        booking.status = "cancelled";
        booking.cancelReason = cancelReason;
        await booking.save();

        res.status(200).json({ message: "Đã hủy lịch đặt phòng", booking });
    } catch (error) {
        console.error("Lỗi khi hủy lịch:", error);
        res.status(500).json({ error: "Lỗi máy chủ khi hủy lịch đặt phòng" });
    }
};

const deleteBookings = async (req, res) => {
    const { bookingIds } = req.body;

    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
        return res.status(400).json({ error: "Danh sách bookingId không hợp lệ" });
    }

    try {
        const result = await Booking.deleteMany({ _id: { $in: bookingIds } });

        res.status(200).json({
            message: `${result.deletedCount} lịch đặt phòng đã được xóa`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Lỗi khi xóa nhiều lịch:", error.message);
        res.status(500).json({ error: "Lỗi máy chủ khi xóa lịch đặt phòng" });
    }
};

const approveBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: "Không tìm thấy lịch đặt phòng" });
        }

        if (booking.status === "approved") {
            return res.status(400).json({ error: "Lịch đã được duyệt trước đó" });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({ error: "Lịch này đã bị hủy và không thể duyệt" });
        }

        booking.status = "approved";
        await booking.save();

        res.status(200).json({ message: "Đã duyệt lịch đặt phòng", booking });
    } catch (error) {
        console.error("Lỗi duyệt đặt phòng:", error);
        res.status(500).json({ error: "Lỗi máy chủ khi duyệt đặt phòng" });
    }
};

const getUserBookingHistory = async (req, res) => {
    const { userId } = req.params;
    try {
        const bookings = await Booking.find({ userId }).sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Không thể lấy lịch sử" });
    }
};
const getBookings = async (req, res) => {
    const {
        roomId,
        userId,
        date,
        status,
        page = 1,
        limit = 10,
        sortField = "date",
        sortOrder = "desc"
    } = req.query;

    const query = {};

    if (roomId) query.roomId = roomId;
    if (userId) query.userId = userId;
    if (date) query.date = date;
    if (status) query.status = status;

    const parsedLimit = parseInt(limit);
    const skip = (parseInt(page) - 1) * parsedLimit;
    const sort = {};
    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    try {
        const total = await Booking.countDocuments(query);

        let bookingsQuery = Booking.find(query)
            .populate("roomId", "-__v")
            .populate("userId", "-password -__v")
            .sort(sort);

        if (parsedLimit !== -1) {
            bookingsQuery = bookingsQuery.skip(skip).limit(parsedLimit);
        }

        const bookings = await bookingsQuery;

        res.status(200).json({
            total,
            page: parsedLimit === -1 ? 1 : parseInt(page),
            limit: parsedLimit,
            totalPages: parsedLimit === -1 ? 1 : Math.ceil(total / parsedLimit),
            data: bookings,
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách đặt phòng:", err.message);
        res.status(500).json({ error: "Không thể lấy danh sách đặt phòng" });
    }
};

module.exports = {
    createBooking,
    cancelBooking,
    getBookings,
    getUserBookingHistory,
    deleteBookings,
    approveBooking
};