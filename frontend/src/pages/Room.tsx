import { Space, Table, TableProps, Tag } from "antd";
import React, { use, useEffect } from "react";
import { getRoomsAPI } from "../services/roomService";
interface DataType {
  key: string;
  name: string;
  location: string;
  capacity: number;
  description: string;
  equipment: string;
  is_active: string;
}
const columns: TableProps<DataType>["columns"] = [
  {
    title: "Tên phòng",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Vị trí",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Dung tích",
    dataIndex: "capacity",
    key: "capacity",
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
    render: (_, record) => (
      <Space size="middle">
        <a>Sửa</a>
        <a>Xóa</a>
      </Space>
    ),
  },
];
const data: DataType[] = [];
const Room = (): React.JSX.Element => {
  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    const res = await getRoomsAPI();
    console.log("res :>> ", res);
  };
  return (
    <>
      <h1>Room Page</h1>
      <Table<DataType> columns={columns} dataSource={data} />;
    </>
  );
};

export default Room;
