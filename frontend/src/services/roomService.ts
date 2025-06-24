import { AxiosResponse } from "axios";
import customAxios from "../utils/custome.axios";
import { Room, UpdateResponse } from "../types/room";

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
const deleteRoomAPI = async (roomId: string): Promise<any> => {
  const URL = `/api/room/${roomId}`;
  try {
    const response: AxiosResponse<any> = await customAxios.delete(URL);
    return response;
  } catch (error: any) {
    if (error.isAxiosError) {
      throw new Error(
        `Lỗi khi xóa phòng: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error(`Lỗi không xác định: ${error.message}`);
  }
};
const updateRoomAPI = async (
  roomId: string,
  dataRoom: Partial<Room>
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
export { getRoomsAPI, deleteRoomAPI, updateRoomAPI };
