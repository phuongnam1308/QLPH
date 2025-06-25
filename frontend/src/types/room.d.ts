interface Room {
  _id: string;
  name: string;
  location?: string;
  capacity?: number;
  description?: string;
  equipment?: string;
  is_active?: string;
}

interface CreateRoomInput {
  name: string;
  location?: string;
  capacity?: number;
  description?: string;
  equipment?: string;
  is_active?: string;
}

interface DataType extends Room {
  key: string;
}

interface RoomResponse {
  success: boolean;
  data?: {
    result: Room[];
    pagination: {
      total: number;
    };
  };
}

interface CreateResponse {
  success: boolean;
  message?: string;
  data?: Room;
}

interface UpdateResponse {
  success: boolean;
  message?: string;
  data?: Room;
}

interface DeleteResponse {
  success: boolean;
  data: { message: string; result?: any };
}

export type {
  Room,
  CreateRoomInput,
  DataType,
  RoomResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
};
