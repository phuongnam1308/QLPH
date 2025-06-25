import { AxiosResponse } from "axios";
import customAxios from "../utils/custome.axios";
import {
  CreateResponse,
  CreateRoomInput,
  DeleteResponse,
  Room,
  UpdateResponse,
} from "../types/room";

const getRoomsAPI = async (
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  const URL = `/api/room?page=${page}&limit=${limit}`;
  try {
    const response: AxiosResponse<any> = await customAxios.get(URL);
    return response;
  } catch (error: any) {
    if (error.isAxiosError) {
      throw new Error(
        `Lỗi khi lấy danh sách phòng: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error(`Lỗi không xác định: ${error.message}`);
  }
};

const updateRoomAPI = async (
  roomId: string,
  dataRoom: CreateRoomInput
): Promise<UpdateResponse> => {
  const URL = `/api/room/${roomId}`;
  try {
    const response: UpdateResponse = await customAxios.put(URL, dataRoom);
    return response;
  } catch (error: any) {
    if (error.isAxiosError) {
      throw new Error(
        `Lỗi khi sửa phòng: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error(`Lỗi không xác định: ${error.message}`);
  }
};
const createRoomAPI = async (
  dataRoom: CreateRoomInput
): Promise<CreateResponse> => {
  const URL = `/api/room`;
  try {
    const response: CreateResponse = await customAxios.post(URL, dataRoom);
    return response;
  } catch (error: any) {
    if (error.isAxiosError) {
      throw new Error(
        `Lỗi khi tạo phòng: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Lỗi không xác định khi tạo phòng");
  }
};
const deleteRoomAPI = async (id: string): Promise<DeleteResponse> => {
  const URL = `/api/room/${id}`;
  try {
    const response: DeleteResponse = await customAxios.delete(URL);
    return response;
  } catch (error: any) {
    if (error.isAxiosError) {
      throw new Error(
        `Lỗi khi xóa phòng: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Lỗi không xác định khi xóa phòng");
  }
};
export { getRoomsAPI, updateRoomAPI, createRoomAPI, deleteRoomAPI };
