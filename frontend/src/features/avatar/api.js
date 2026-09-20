import { apiPostForm } from "@/api/client";
export function uploadAvatar(file) {
    const body = new FormData();
    body.append("file", file);
    return apiPostForm("/users/avatar", body);
}
