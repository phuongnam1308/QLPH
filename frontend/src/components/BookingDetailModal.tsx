import React, { useState } from "react";
import { Modal, Button, Input, message } from "antd";
import bookingService from "../services/bookingService";

interface BookingDetailModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    roomName: string;
    userName: string;
    status: string;
    start: Date;
    end: Date; 
    bookingId: string;  
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
    open,
    onClose,
    title,
    roomName,
    userName,
    status,
    start,
    end, 
    bookingId,
}) => {
const [cancelReason, setCancelReason] = useState("");
const [loading, setLoading] = useState(false);

const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
        message.warning("Vui lòng nhập lý do hủy.");
        return;
    }

    try {
        setLoading(true);
        await bookingService.cancelBooking(bookingId, cancelReason);
        message.success("Hủy đặt phòng thành công.");
        onClose();      
    } catch (error) {
        console.error(error);
        message.error("Hủy đặt phòng thất bại.");
    } finally {
        setLoading(false);
    }
};

return (
    <Modal
    title="Chi tiết đặt phòng"
    open={open}
    onCancel={onClose}
    footer={null}
    >
    <div style={{ marginBottom: 12 }}>
        <p><strong>Tiêu đề:</strong> {title}</p>
        <p><strong>Phòng:</strong> {roomName}</p>
        <p><strong>Người đặt:</strong> {userName}</p>
        <p><strong>Trạng thái:</strong> {status}</p>
        <p>
        <strong>Thời gian:</strong>{" "}
        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p><strong>Ngày:</strong> {start.toLocaleDateString()}</p>
    </div>

    {status !== "cancelled" && (
        <>
        <Input.TextArea
            rows={3}
            placeholder="Nhập lý do hủy phòng"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
        />
        <div style={{ marginTop: 12, textAlign: "right" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
            Đóng
            </Button>
            <Button
            type="primary"
            danger
            loading={loading}
            onClick={handleCancelBooking}
            >
            Hủy phòng
            </Button>
        </div>
        </>
    )}
    </Modal>
);
};

export default BookingDetailModal;
