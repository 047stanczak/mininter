import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUserSettings } from "./useUserSettings";
import type { DeleteUserRequest, UpdatePasswordRequest, UpdateUserRequest } from "./types";

const emptyProfile: Required<UpdateUserRequest> = {
  username: "",
  displayName: "",
  bio: "",
};

export function UserSettingsForm() {
  const {
    profile,
    loadingProfile,
    pendingOperation,
    error,
    success,
    updateProfile,
    updatePassword,
    deleteUser,
  } = useUserSettings();
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [passwordForm, setPasswordForm] = useState<UpdatePasswordRequest>({
    currentPassword: "",
    newPassword: "",
  });
  const [deleteForm, setDeleteForm] = useState<DeleteUserRequest>({ password: "" });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        username: profile.username,
        displayName: profile.displayName ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [profile]);

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void updateProfile(profileForm);
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await updatePassword(passwordForm)) {
      setPasswordForm({ currentPassword: "", newPassword: "" });
    }
  }

  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (window.confirm("Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      await deleteUser(deleteForm);
    }
  }

  function updateProfileField(field: keyof UpdateUserRequest, value: string) {
    setProfileForm((current) => ({ ...current, [field]: value }));
  }

  if (loadingProfile) {
    return <p className="field-hint">Carregando perfil...</p>;
  }

  if (!profile) {
    return (
      <>
        {error && <p className="error-message" role="alert">{error}</p>}
        <Link className="text-link" to="/">Voltar para o início</Link>
      </>
    );
  }

  const isPending = pendingOperation !== null;

  return (
    <div className="user-settings">
      {error && <p className="error-message" role="alert">{error}</p>}
      {success && <p className="success-message" role="status">{success}</p>}

      <section className="settings-section">
        <h2>Perfil</h2>
        <form className="form" onSubmit={handleProfileSubmit}>
          <Input
            id="username"
            label="Usuário"
            value={profileForm.username}
            onChange={(event) => updateProfileField("username", event.target.value)}
            minLength={1}
            maxLength={30}
            required
          />
          <Input
            id="displayName"
            label="Nome de exibição"
            value={profileForm.displayName}
            onChange={(event) => updateProfileField("displayName", event.target.value)}
            maxLength={80}
          />
          <div className="field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              className="input settings-textarea"
              value={profileForm.bio}
              onChange={(event) => updateProfileField("bio", event.target.value)}
              maxLength={500}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {pendingOperation === "profile" ? "Salvando..." : "Salvar perfil"}
          </Button>
        </form>
      </section>

      <section className="settings-section">
        <h2>Alterar senha</h2>
        <form className="form" onSubmit={handlePasswordSubmit}>
          <Input
            id="currentPassword"
            label="Senha atual"
            type="password"
            autoComplete="current-password"
            value={passwordForm.currentPassword}
            onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
            required
          />
          <Input
            id="newPassword"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            value={passwordForm.newPassword}
            onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
            minLength={8}
            maxLength={72}
            required
          />
          <Button type="submit" disabled={isPending}>
            {pendingOperation === "password" ? "Atualizando..." : "Alterar senha"}
          </Button>
        </form>
      </section>

      <section className="settings-section settings-danger">
        <h2>Excluir conta</h2>
        <form className="form" onSubmit={handleDeleteSubmit}>
          <Input
            id="deletePassword"
            label="Confirme sua senha"
            type="password"
            autoComplete="current-password"
            value={deleteForm.password}
            onChange={(event) => setDeleteForm({ password: event.target.value })}
            required
          />
          <Button className="btn btn-danger" type="submit" disabled={isPending}>
            {pendingOperation === "delete" ? "Excluindo..." : "Excluir conta"}
          </Button>
        </form>
      </section>

      <p className="form-footer">
        <Link className="text-link" to="/">Voltar para o início</Link>
      </p>
    </div>
  );
}