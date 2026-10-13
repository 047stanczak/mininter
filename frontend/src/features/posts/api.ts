import { apiDelete, apiGet, apiPatchForm, apiPostForm } from "@/api/client";
import type { Post, CreatePostRequest, UpdatePostRequest } from "./types";
import type { ApiResponse } from "@/types/api";

export async function getPosts(): Promise<ApiResponse<Post[]>> {
  return apiGet<Post[]>("/posts");
}

export async function getPost(postId: number): Promise<ApiResponse<Post>> {
  return apiGet<Post>(`/posts/${postId}`);
}

export async function createPost(data: CreatePostRequest): Promise<ApiResponse<string>> {
  const formData = new FormData();
  formData.append("content", data.content);
  if (data.image) {
    formData.append("image", data.image);
  }
  return apiPostForm<string>("/posts", formData);
}

export async function updatePost(postId: number, data: UpdatePostRequest): Promise<ApiResponse<Post>> {
  const formData = new FormData();
  formData.append("content", data.content);
  if (data.image) {
    formData.append("image", data.image);
  }
  return apiPatchForm<Post>(`/posts/${postId}`, formData);
}

export async function deletePost(postId: number): Promise<ApiResponse<string>> {
  return apiDelete<string>(`/posts/${postId}`);
}
