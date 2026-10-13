import { useState, type FormEvent } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAvatar } from "@/features/avatar/useAvatar";
import { PostImagePicker } from "./PostImagePicker";
import type { CreatePostRequest } from "./types";

const MAX_LENGTH = 500;

interface PostComposerProps {
  username: string | null;
  pending: boolean;
  onSubmit: (payload: CreatePostRequest) => Promise<boolean>;
}

export function PostComposer({ username, pending, onSubmit }: PostComposerProps) {
  const { avatarUrl } = useAvatar();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim() || pending) return;

    const didCreate = await onSubmit({ content: content.trim(), image: image ?? undefined });
    if (didCreate) {
      setContent("");
      setImage(null);
    }
  }

  return (
    <form className="composer post-card" onSubmit={handleSubmit}>
      <div className="composer-row">
        <UserAvatar name={username} src={avatarUrl} />
        <div className="composer-field">
          <label htmlFor="post-content" className="sr-only">
            Novo post
          </label>
          <textarea
            id="post-content"
            className="composer-input"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={username ? `No que você está pensando, ${username}?` : "No que você está pensando?"}
            maxLength={MAX_LENGTH}
            rows={3}
          />
        </div>
      </div>

      <PostImagePicker value={image} onChange={setImage} />

      <div className="composer-footer">
        <span className="char-count">
          {content.length}/{MAX_LENGTH}
        </span>
        <button type="submit" className="btn" disabled={!content.trim() || pending}>
          {pending ? "Publicando..." : "Publicar"}
        </button>
      </div>
    </form>
  );
}
