import React from "react";
import { Form, Input, InputNumber, Modal, Select } from "antd";
import { toast } from "react-toastify";
import { createRoomAPI, updateRoomAPI } from "../services/roomService";
import {
  Room,
  CreateRoomInput,
  CreateResponse,
  UpdateResponse,
} from "../types/room";
import { AxiosError } from "axios";

interface ModalRoomProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataDetail?: Room | null;
  getRooms: () => void;
  title: string;
  nameModel: "createRoom" | "editRoom";
}

interface ApiError {
  message?: string;
}

const ModalRoom: React.FC<ModalRoomProps> = ({
  isModalOpen,
  setIsModalOpen,
  dataDetail,
  getRooms,
  title,
  nameModel,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (nameModel === "editRoom" && dataDetail) {
      form.setFieldsValue({
        name: dataDetail.name,
        location: dataDetail.location || "Không xác định",
        capacity: dataDetail.capacity || 0,
        description: dataDetail.description || "Không có mô tả",
        equipment: dataDetail.equipment || "Không có thiết bị",
        is_active: dataDetail.is_active || "available",
      });
    } else {
      form.resetFields(); // Reset form khi tạo phòng
    }
  }, [dataDetail, nameModel, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let res: CreateResponse | UpdateResponse;

      if (nameModel === "createRoom") {
        res = await createRoomAPI({
          name: values.name,
          location: values.location,
          capacity: values.capacity,
          description: values.description,
          equipment: values.equipment,
          is_active: values.is_active,
        });
      } else {
        if (!dataDetail?._id) {
          throw new Error("Không tìm thấy ID phòng để cập nhật");
        }
        res = await updateRoomAPI(dataDetail._id, {
          name: values.name,
          location: values.location,
          capacity: values.capacity,
          description: values.description,
          equipment: values.equipment,
          is_active: values.is_active,
        });
      }

      if (res.success) {
        toast.success(
          nameModel === "createRoom"
            ? "Tạo phòng thành công"
            : "Cập nhật phòng thành công",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        setTimeout(() => {
          setIsModalOpen(false);
          getRooms();
          form.resetFields();
        }, 1000);
      } else {
        toast.error(
          (Array.isArray(res.message) && res.message[0]) ||
            (nameModel === "createRoom"
              ? "Tạo phòng thất bại"
              : "Cập nhật phòng thất bại"),
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      if (err instanceof AxiosError) {
        const error = err as AxiosError<ApiError>;
        toast.error(error.response?.data?.message || "Lỗi khi xử lý phòng", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(err instanceof Error ? err.message : "Lỗi không xác định", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" name={nameModel}>
        <Form.Item
          name="name"
          label="Tên phòng"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input />
        </Form.Item>
        <Form.Item name="location" label="Địa điểm">
          <Input />
        </Form.Item>
        <Form.Item name="capacity" label="Dung tích">
          <InputNumber />
        </Form.Item>
        <Form.Item name="equipment" label="Vật dụng">
          <Input />
        </Form.Item>
        <Form.Item
          name="is_active"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="booked">Booked</Select.Option>
            <Select.Option value="cancelled">Cancelled</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalRoom;
