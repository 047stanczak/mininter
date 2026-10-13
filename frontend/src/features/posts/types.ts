export interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  authorUsername: string;
  publishedAt: string;
}

export interface CreatePostRequest {
  content: string;
  image?: File;
}

export interface UpdatePostRequest {
  content: string;
  image?: File;
}
