import React from "react";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { AxiosError } from "axios";

import { Room, UpdateResponse } from "../types/room";
import { updateRoomAPI } from "../services/roomService";

interface ModalEditRoomProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room?: Room;
  dataDetail?: Room | null;
}
interface ApiError {
  message?: string;
}
const ModalEditRoom: React.FC<ModalEditRoomProps> = ({
  isModalOpen,
  setIsModalOpen,
  dataDetail,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (dataDetail) {
      form.setFieldsValue({
        name: dataDetail.name,
        location: dataDetail.location || "Không xác định",
        capacity: dataDetail.capacity || 0,
        description: dataDetail.description || "Không có mô tả",
        equipment: dataDetail.equipment || "Không có thiết bị",
        is_active: dataDetail.is_active || "available",
      });
    }
  }, [dataDetail, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("values :>> ", values);
      if (dataDetail?._id) {
        const res: UpdateResponse = await updateRoomAPI(dataDetail._id, {
          name: values.name,
          location: values.location,
          capacity: values.capacity,
          description: values.description,
          equipment: values.equipment,
          is_active: values.is_active,
        });
        console.log("res :>> ", res);
        if (res.success) {
          message.success("Cập nhật phòng thành công");
          setIsModalOpen(false);
        } else {
          message.error("Cập nhật phòng thất bại");
        }
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const error = err as AxiosError<ApiError>;
        message.error(
          error.response?.data?.message || "Lỗi khi cập nhật phòng"
        );
      } else {
        message.error("Lỗi không xác định");
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Chỉnh sửa phòng"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" name="editRoomForm">
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

export default ModalEditRoom;
