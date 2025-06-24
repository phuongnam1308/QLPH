interface Room {
  _id: string;
  name: string;
  location?: string;
  capacity?: number;
  description?: string;
  equipment?: string;
  is_active?: "available" | "booked" | "cancelled" | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Pagination {
  current_page: number;
  limit: number;
  total_pages: number;
  total: number;
}
interface RoomResponse {
  success: boolean;
  data: {
    result: Room[];
    pagination: Pagination;
  };
}
interface DataType extends Room {
  key: string;
}
export interface UpdateResponse {
  success: boolean;
  data: { message: string; result?: Room };
}
export type { Room, RoomResponse, DataType };
