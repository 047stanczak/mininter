import { UserAvatar } from "@/components/ui/UserAvatar";
import type { Post } from "./types";

const formatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" });

export function PostMeta({ post }: { post: Post }) {
  const date = post.publishedAt ? new Date(post.publishedAt) : null;
  const hasDate = date !== null && !Number.isNaN(date.getTime());

  return (
    <div className="post-header">
      <UserAvatar name={post.authorUsername} />
      <div className="post-header-text">
        <strong className="post-author">@{post.authorUsername}</strong>
        {hasDate && <time dateTime={post.publishedAt}>{formatter.format(date)}</time>}
      </div>
    </div>
  );
}
