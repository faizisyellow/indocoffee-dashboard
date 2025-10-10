import type { User } from "../../store";

export type GetProfileResponse = {
  data: User;
  error: string;
};
