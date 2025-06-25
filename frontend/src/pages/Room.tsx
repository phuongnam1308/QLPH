import { Button, message, Popconfirm, Space, Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import { deleteRoomAPI, getRoomsAPI } from "../services/roomService";
import { AxiosError } from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import { DataType, Room, RoomResponse } from "../types/room";
import ModalRoom from "../components/modelRoom";
import { toast } from "react-toastify";

interface ApiError {
  message?: string;
}
interface DeleteResponse {
  success: boolean;
  data: { message: string; result?: any };
}

const RoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<Room | null>(null);
  const [modalMode, setModalMode] = useState<"createRoom" | "editRoom">(
    "createRoom"
  );

  useEffect(() => {
    getRooms();
  }, [currentPage, pageSize]);

  const getRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: RoomResponse = await getRoomsAPI(currentPage, pageSize);
      if (res.success && res.data?.result) {
        const formattedRooms: DataType[] = res.data.result.map((room) => ({
          key: room._id,
          _id: room._id,
          name: room.name,
          capacity: room.capacity,
          location: room.location || "Không xác định",
          description: room.description || "Không có mô tả",
          equipment: room.equipment || "Không có thiết bị",
          is_active: room.is_active || "available",
        }));
        setRooms(formattedRooms);
        setTotal(res.data.pagination.total);
      } else {
        setError("Không tìm thấy phòng");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const error = err as AxiosError<ApiError>;
        setError(
          error.response?.data?.message || "Lỗi khi lấy danh sách phòng"
        );
      } else {
        setError("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      const res: DeleteResponse = await deleteRoomAPI(roomId);
      if (res.success) {
        message.success(res.data.message || "Xóa phòng thành công");
        getRooms();
        toast.success("Xóa thành công");
      } else {
        setError("Xóa phòng thất bại");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const error = err as AxiosError<ApiError>;
        setError(error.response?.data?.message || "Lỗi khi xóa phòng");
      } else {
        setError("Lỗi không xác định");
      }
    }
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, record, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Thiết bị",
      dataIndex: "equipment",
      key: "equipment",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: DataType) => (
        <Space size="middle">
          <a
            onClick={() => {
              setModalMode("editRoom");
              setDataDetail(record);
              setIsModalOpen(true);
            }}
          >
            Sửa
          </a>
          <Popconfirm
            title="Confirm delete"
            description="Chắc chắn xóa?"
            onConfirm={() => deleteRoom(record._id)}
            okText="Có"
            cancelText="Hủy"
            placement="left"
          >
            <a>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <h1>Room Page</h1>
        <Button
          onClick={() => {
            setModalMode("createRoom");
            setDataDetail(null);
            setIsModalOpen(true);
          }}
        >
          Thêm phòng
        </Button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Table<DataType>
        columns={columns}
        dataSource={rooms}
        loading={loading}
        locale={{ emptyText: "Không có dữ liệu" }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page: number, pageSize?: number) => {
            setCurrentPage(page);
            if (pageSize) setPageSize(pageSize);
          },
          onShowSizeChange: (current: number, size: number) => {
            setCurrentPage(current);
            setPageSize(size);
          },
        }}
      />
      <ModalRoom
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        dataDetail={dataDetail}
        getRooms={getRooms}
        title={modalMode === "createRoom" ? "Tạo phòng" : "Sửa phòng"}
        nameModel={modalMode}
      />
    </>
  );
};

export default RoomPage;
