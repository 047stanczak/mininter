import { apiPostForm } from "@/api/client";

export function uploadAvatar(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiPostForm<string | null>("/users/avatar", body);
}
