import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/api/AuthContext";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getPost, deletePost, updatePost } from "@/features/posts/api";
import { PostImagePicker } from "@/features/posts/PostImagePicker";
import { PostMeta } from "@/features/posts/PostMeta";
import type { Post } from "@/features/posts/types";

export function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    async function loadPost() {
      try {
        const response = await getPost(Number(postId));
        if (!response.data) {
          throw new Error("Post não encontrado.");
        }
        setPost(response.data);
        setContent(response.data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar o post.");
      } finally {
        setLoading(false);
      }
    }

    void loadPost();
  }, [postId]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!postId || !content.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const response = await updatePost(Number(postId), { content: content.trim(), image: image ?? undefined });
      if (!response.data) {
        throw new Error("Post atualizado não recebido.");
      }
      setPost(response.data);
      setIsEditing(false);
      setImage(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o post.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!postId) return;

    setIsDeleting(true);
    try {
      await deletePost(Number(postId));
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir o post.");
      setConfirmingDelete(false);
      setIsDeleting(false);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setImage(null);
    setContent(post?.content ?? "");
  }

  if (loading) {
    return (
      <main className="feed">
        <p className="field-hint">Carregando post...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="feed">
        {error && <p className="alert-box" role="alert">{error}</p>}
        <Link className="text-link" to="/">Voltar para o início</Link>
      </main>
    );
  }

  const isOwner = isAuthenticated && post.authorUsername === username;

  return (
    <main className="feed">
      <Link className="text-link back-link" to="/">← Voltar ao feed</Link>

      {error && <p className="alert-box" role="alert">{error}</p>}

      <article className="post-card">
        <PostMeta post={post} />

        {isEditing ? (
          <form className="post-edit" onSubmit={handleUpdate}>
            <label htmlFor="edit-post-content" className="sr-only">Conteúdo</label>
            <textarea
              id="edit-post-content"
              className="composer-input edit-input"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={500}
              rows={4}
            />
            <span className="char-count">{content.length}/500</span>
            <PostImagePicker value={image} onChange={setImage} addLabel="Trocar imagem" />
            <div className="post-edit-actions">
              <button type="button" className="btn btn-secondary" onClick={cancelEdit} disabled={isSaving}>
                Cancelar
              </button>
              <Button type="submit" disabled={!content.trim() || isSaving}>
                {isSaving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="post-content">{post.content}</p>
            {post.imageUrl && <img className="post-image" src={post.imageUrl} alt="Imagem do post" />}
          </>
        )}

        {isOwner && !isEditing && (
          <div className="post-actions">
            <button type="button" className="action-btn" onClick={() => setIsEditing(true)}>
              Editar
            </button>
            <button type="button" className="action-btn action-danger" onClick={() => setConfirmingDelete(true)}>
              Excluir
            </button>
          </div>
        )}
      </article>

      {confirmingDelete && (
        <ConfirmDialog
          title="Excluir post"
          message="Tem certeza de que deseja excluir este post? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          pending={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </main>
  );
}
