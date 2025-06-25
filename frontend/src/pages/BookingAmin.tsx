import React, { useEffect, useState } from "react";
import {
Table,
Typography,
Select,
Modal,
Input,
} from "antd";
import { BookingAPIResponse } from "../types/booking";
import bookingService from "../services/bookingService";
import { ColumnsType } from "antd/es/table";

const { Title } = Typography;
const { Option } = Select;

const BookingAdmin: React.FC = () => {
const [bookings, setBookings] = useState<BookingAPIResponse[]>([]);
const [loading, setLoading] = useState(false);
const [cancelModalVisible, setCancelModalVisible] = useState(false);
const [cancelReason, setCancelReason] = useState("");
const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
const [selectedUser, setSelectedUser] = useState<string>("");

useEffect(() => {
    fetchBookings();
}, []);

const fetchBookings = async () => {
    try {
    setLoading(true);
    const response = await bookingService.getBookings();
    setBookings(response);
    } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng:", error);
    } finally {
    setLoading(false);
    }
};

const handleStatusChange = (bookingId: string, status: string) => {
    if (status === "cancelled") {
    setSelectedBookingId(bookingId);
    setCancelModalVisible(true);
    } else if (status === "approved") {
    bookingService.approveBooking(bookingId).then(fetchBookings);
    }
};

const handleCancelConfirm = async () => {
    if (selectedBookingId) {
    await bookingService.cancelBooking(selectedBookingId, cancelReason);
    setCancelModalVisible(false);
    setCancelReason("");
    setSelectedBookingId(null);
    fetchBookings();
    }
};

// Danh sách người dùng không trùng lặp để chọn
const uniqueUsers = Array.from(
    new Set(bookings.map((b) => b.userId.fullname))
);

// Lọc danh sách booking theo tên người dùng được chọn
const filteredBookings = selectedUser
    ? bookings.filter((booking) =>
        booking.userId.fullname.toLowerCase().includes(selectedUser.toLowerCase())
    )
    : bookings;

const columns: ColumnsType<BookingAPIResponse> = [
    {
    title: "STT",
    key: "index",
    render: (_text, _record, index) => index + 1,
    },
    {
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
    },
    {
    title: "Phòng",
    dataIndex: ["roomId", "name"],
    key: "room",
    render: (text) => text || "Không rõ phòng",
    },
    {
    title: "Người đặt",
    dataIndex: ["userId", "fullname"],
    key: "user",
    },
    {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
    },
    {
    title: "Thời gian",
    key: "time",
    render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status, record) => (
        <Select
        value={status}
        onChange={(value) => handleStatusChange(record._id, value)}
        style={{ width: 130 }}
        >
        <Option value="pending">Chờ duyệt</Option>
        <Option value="approved">Đã duyệt</Option>
        <Option value="cancelled">Hủy</Option>
        </Select>
    ),
    },
];

return (
    <>
    <Title level={3}>Danh sách đặt phòng</Title>

    <Select
        showSearch
        allowClear
        placeholder="Chọn hoặc nhập tên người đặt"
        style={{ width: 300, marginBottom: 16 }}
        optionFilterProp="children"
        onChange={(value) => setSelectedUser(value || "")}
        filterOption={(input, option) =>
            String(option?.children).toLowerCase().includes(input.toLowerCase())
        }
          
    >
        {uniqueUsers.map((name) => (
        <Option key={name} value={name}>
            {name}
        </Option>
        ))}
    </Select>

    <Table
        columns={columns}
        dataSource={filteredBookings}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "Không có lịch đặt phòng nào" }}
    />

    <Modal
        title="Lý do hủy đặt phòng"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelConfirm}
        okText="Xác nhận"
        cancelText="Hủy"
    >
        <Input.TextArea
        rows={4}
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
        placeholder="Nhập lý do hủy..."
        />
    </Modal>
    </>
);
};

export default BookingAdmin;
