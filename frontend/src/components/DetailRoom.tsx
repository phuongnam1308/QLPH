import React from "react";
import { Room } from "../types/room";
import { Button, Drawer, Descriptions, Tag } from "antd";

interface DetailRoomProps {
  dataDetail?: Room | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

const DetailRoom: React.FC<DetailRoomProps> = ({
  dataDetail,
  setOpen,
  open,
}) => {
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Xem chi tiết
      </Button>
      <Drawer
        title={dataDetail?.name || "Chi tiết phòng"}
        closable={true}
        closeIcon={<span aria-label="Close Button">✕</span>}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        width={400}
      >
        {dataDetail ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên phòng">
              {dataDetail.name || "Không có thông tin"}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {dataDetail.description || "Không có mô tả"}
            </Descriptions.Item>
            <Descriptions.Item label="Thiết bị">
              {dataDetail.equipment || "Không có thiết bị"}
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">
              {dataDetail.location || "Không xác định"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={dataDetail.is_active === "available" ? "green" : "red"}
              >
                {dataDetail.is_active === "available"
                  ? "Có sẵn"
                  : "Không có sẵn"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Sức chứa">
              {dataDetail.capacity ?? "Không xác định"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có thông tin phòng để hiển thị.</p>
        )}
      </Drawer>
    </>
  );
};

export default DetailRoom;
