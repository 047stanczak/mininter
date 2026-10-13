import { useCallback, useEffect, useState } from "react";
import { createPost, deletePost, getPost, getPosts, updatePost } from "./api";
import type { CreatePostRequest, Post, UpdatePostRequest } from "./types";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"create" | "update" | "delete" | null>(null);

  const loadPosts = useCallback(async () => {
    setError(null);

    try {
      const response = await getPosts();
      if (!response.data) {
        throw new Error("Posts não recebidos.");
      }
      setPosts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar os posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function submitPost(payload: CreatePostRequest) {
    setPending("create");
    setError(null);

    try {
      await createPost(payload);
      await loadPosts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o post.");
      return false;
    } finally {
      setPending(null);
    }
  }

  async function savePost(postId: number, payload: UpdatePostRequest) {
    setPending("update");
    setError(null);

    try {
      const response = await updatePost(postId, payload);
      if (!response.data) {
        throw new Error("Post atualizado não recebido.");
      }
      await loadPosts();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o post.");
      return null;
    } finally {
      setPending(null);
    }
  }

  async function removePost(postId: number) {
    setPending("delete");
    setError(null);

    try {
      await deletePost(postId);
      await loadPosts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir o post.");
      return false;
    } finally {
      setPending(null);
    }
  }

  return {
    posts,
    loading,
    error,
    pending,
    loadPosts,
    submitPost,
    savePost,
    removePost,
    getPostById: getPost,
  };
}
