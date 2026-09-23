import { apiGet, apiPostForm } from "@/api/client";

export function getAvatar() {
  return apiGet<string>("/users/avatar");
}

export function uploadAvatar(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiPostForm<string | null>("/users/avatar", body);
}
