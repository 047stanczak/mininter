import { apiGet, apiPatch, apiDelete } from "@/api/client";
import type {
  DeleteUserRequest,
  UpdatePasswordRequest,
  UpdateUserRequest,
  UserResponse,
} from "./types";

const BASE_PATH = "/users";

export const userApi = {
  fetchProfile: () => apiGet<UserResponse>(`${BASE_PATH}/profile`),
  fetchById: (userId: number) => apiGet<UserResponse>(`${BASE_PATH}/${userId}`),
  updateProfile: (body: UpdateUserRequest) =>
    apiPatch<void, UpdateUserRequest>(`${BASE_PATH}/me`, body),
  updatePassword: (body: UpdatePasswordRequest) =>
    apiPatch<void, UpdatePasswordRequest>(`${BASE_PATH}/me/password`, body),
  deleteUser: (body: DeleteUserRequest) =>
    apiDelete<void, DeleteUserRequest>(`${BASE_PATH}/me`, body),
};
