import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/api/AuthContext";
import { usePosts } from "@/features/posts/usePosts";
import { PostCard } from "@/features/posts/PostCard";
import { PostComposer } from "@/features/posts/PostComposer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function HomePage() {
  const { isAuthenticated, username } = useAuth();
  const { posts, loading, error, pending, submitPost, removePost } = usePosts();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleConfirmDelete() {
    if (deleteId === null) return;
    await removePost(deleteId);
    setDeleteId(null);
  }

  return (
    <main className="feed">
      {isAuthenticated ? (
        <PostComposer username={username} pending={pending === "create"} onSubmit={submitPost} />
      ) : (
        <div className="post-card welcome">
          <strong>Bem-vindo ao Mininter</strong>
          <p>
            <Link className="text-link" to="/login">Entre</Link> ou{" "}
            <Link className="text-link" to="/register">crie uma conta</Link> para publicar.
          </p>
        </div>
      )}

      {error && <p className="alert-box" role="alert">{error}</p>}

      <section className="post-list" aria-label="Posts">
        {loading ? (
          <p className="field-hint">Carregando posts...</p>
        ) : posts.length === 0 ? (
          <p className="field-hint">
            {isAuthenticated ? "Nenhum post ainda. Seja o primeiro a publicar." : "Nenhum post ainda."}
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canDelete={isAuthenticated && post.authorUsername === username}
              onDelete={setDeleteId}
            />
          ))
        )}
      </section>

      {deleteId !== null && (
        <ConfirmDialog
          title="Excluir post"
          message="Tem certeza de que deseja excluir este post? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          pending={pending === "delete"}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </main>
  );
}
