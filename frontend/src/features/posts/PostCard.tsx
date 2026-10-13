import { Link } from "react-router-dom";
import { PostMeta } from "./PostMeta";
import type { Post } from "./types";

interface PostCardProps {
  post: Post;
  canDelete: boolean;
  onDelete: (postId: number) => void;
}

export function PostCard({ post, canDelete, onDelete }: PostCardProps) {
  return (
    <article className="post-card">
      <PostMeta post={post} />
      <p className="post-content">{post.content}</p>
      {post.imageUrl && <img className="post-image" src={post.imageUrl} alt="Imagem do post" loading="lazy" />}
      <div className="post-actions">
        <Link className="action-btn" to={`/posts/${post.id}`}>
          Abrir post
        </Link>
        {canDelete && (
          <button type="button" className="action-btn action-danger" onClick={() => onDelete(post.id)}>
            Excluir
          </button>
        )}
      </div>
    </article>
  );
}
