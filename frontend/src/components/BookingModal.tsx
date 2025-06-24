import React, { useEffect, useState } from 'react';
import { DatePicker, Select, Input, Button, Modal } from 'antd'; 
import dayjs from 'dayjs'; 

export interface BookingResult {
    success: boolean;
    data?: {
        title: string;
        start: string;
        end: string;
        roomId: string;
        roomName: string;
    };
}

interface Room {
    _id: string;
    name: string;
}

const BookingModal: React.FC<{
    isOpen: boolean;
    onClose: (result: BookingResult) => void;
    rooms: Room[];
    start: Date | null;
    end: Date | null;
}> = ({ isOpen, onClose, start, end, rooms }) => {
const [title, setTitle] = useState('');
const [startTime, setStartTime] = useState<Date | null>(start);
const [endTime, setEndTime] = useState<Date | null>(end);
const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]?._id || '');

useEffect(() => {
    if (isOpen) {
    const room = rooms.find((r) => r._id === selectedRoom);
    const roomName = room?.name || '';
    const now = new Date();
    const formatted = now.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    setTitle(`${roomName} - Lịch họp - ${formatted}`);
    setStartTime(start);
    setEndTime(end);
    }
}, [isOpen, start, end, rooms, selectedRoom]);

const handleSubmit = () => {
    if (title && startTime && endTime && selectedRoom) {
    if (startTime >= endTime)  return;

    const room = rooms.find((r) => r._id === selectedRoom);
    const roomName = room?.name || '';
    onClose({
        success: true,
        data: {
            title,
            start: new Date(startTime).toISOString(),
            end: new Date(endTime).toISOString(),
            roomId: selectedRoom,
            roomName,
        },
    });
    }
};

const handleCancel = () => {
    onClose({ success: false });
};

return (
    <Modal
        title="Đặt lịch họp"
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
    >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>Tên sự kiện:</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Thời gian bắt đầu:</label>
        <DatePicker
            showTime={{ minuteStep: 30, format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            value={startTime ? dayjs(startTime) : null}
            onChange={(value) => setStartTime(value?.toDate() || null)}
        />

        <label>Thời gian kết thúc:</label>
        <DatePicker
            showTime={{ minuteStep: 30, format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            value={endTime ? dayjs(endTime) : null}
            onChange={(value) => setEndTime(value?.toDate() || null)}
        />

        <label>Phòng:</label>
        <Select
            value={selectedRoom}
            onChange={(val) => setSelectedRoom(val)}
        >
        {rooms.map((room) => (
            <Select.Option key={room._id} value={room._id}>
            {room.name}
            </Select.Option>
        ))}
        </Select>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Đóng
        </Button>
        <Button type="primary" onClick={handleSubmit}>
            Xác nhận
        </Button>
        </div>
    </div>
    </Modal>
);
};

export default BookingModal;
