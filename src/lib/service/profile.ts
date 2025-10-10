import type { AxiosInstance } from "axios";
import { clientWithAuth } from "./axios/axios";
import type { User } from "../store";
import type { GetProfileResponse } from "./response/profile";

class ProfileService {
  axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async getProfile(): Promise<User> {
    const { data } = await this.axios.get<GetProfileResponse>("users/profile");
    return data?.data;
  }
}

export const profileService = new ProfileService(clientWithAuth);
