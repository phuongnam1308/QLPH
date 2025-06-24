import axios from "../utils/custome.axios";

const getRoomsAPI = async (): Promise<any> => {
  const URL = "/api/room";
  return axios.get(URL);
};

export { getRoomsAPI };
