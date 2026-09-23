import { useEffect, useState } from "react";
import { useAuth } from "@/api/AuthContext";
import { getAvatar } from "./api";

type AvatarStatus = "idle" | "loading" | "success" | "error";

export function useAvatar() {
  const { isAuthenticated } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<AvatarStatus>("idle");

  useEffect(() => {
    if (!isAuthenticated) {
      setAvatarUrl(null);
      setStatus("idle");
      return;
    }

    let isCurrent = true;
    setStatus("loading");

    getAvatar()
      .then((response) => {
        if (!isCurrent) {
          return;
        }

        setAvatarUrl(response.data);
        setStatus("success");
      })
      .catch(() => {
        if (!isCurrent) {
          return;
        }

        setAvatarUrl(null);
        setStatus("error");
      });

    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated]);

  return { avatarUrl, status };
}