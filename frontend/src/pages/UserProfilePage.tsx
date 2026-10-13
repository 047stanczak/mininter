import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userApi } from "@/features/user/api";
import type { UserResponse } from "@/features/user/types";

export function UserProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadProfile() {
      try {
        const response = await userApi.fetchById(Number(userId));
        if (!response.data) {
          throw new Error("Usuário não encontrado.");
        }
        setProfile(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar o perfil do usuário.");
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <main className="page">
        <div className="card user-profile">
          <p className="field-hint">Carregando perfil...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page">
        <div className="card user-profile">
          {error && <p className="error-message" role="alert">{error}</p>}
          <Link className="text-link" to="/">Voltar para o início</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="card profile-card">
        <div className="user-profile-header">
          {profile.imageUrl ? (
            <img className="avatar-preview" src={profile.imageUrl} alt={profile.displayName ?? profile.username} />
          ) : (
            <div className="avatar-placeholder">{profile.username.slice(0, 1).toUpperCase()}</div>
          )}
          <div>
            <h1>{profile.displayName ?? profile.username}</h1>
            <p className="field-hint">@{profile.username}</p>
          </div>
        </div>

        <p>{profile.bio || "Sem bio disponível."}</p>
        <Link className="text-link" to="/">Voltar para o início</Link>
      </div>
    </main>
  );
}
