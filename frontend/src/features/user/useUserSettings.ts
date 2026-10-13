import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/api/AuthContext";
import { userApi } from "./api";
import type {
  DeleteUserRequest,
  UpdatePasswordRequest,
  UpdateUserRequest,
  UserResponse,
} from "./types";

type Operation = "profile" | "password" | "delete";

export function useUserSettings() {
  const navigate = useNavigate();
  const { clearToken, setUsername } = useAuth();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [pendingOperation, setPendingOperation] = useState<Operation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    userApi
      .fetchProfile()
      .then((response) => {
        if (!response.data) {
          throw new Error("Perfil não recebido.");
        }
        if (isCurrent) setProfile(response.data);
      })
      .catch((err: unknown) => {
        if (isCurrent) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar o perfil.");
        }
      })
      .finally(() => {
        if (isCurrent) setLoadingProfile(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  async function updateProfile(payload: UpdateUserRequest) {
    setPendingOperation("profile");
    setError(null);
    setSuccess(null);
    try {
      await userApi.updateProfile(payload);
      setProfile((current) => (current ? { ...current, ...payload } : current));
      if (payload.username) setUsername(payload.username);
      setSuccess("Perfil atualizado com sucesso.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o perfil.");
      return false;
    } finally {
      setPendingOperation(null);
    }
  }

  async function updatePassword(payload: UpdatePasswordRequest) {
    setPendingOperation("password");
    setError(null);
    setSuccess(null);
    try {
      await userApi.updatePassword(payload);
      setSuccess("Senha atualizada com sucesso.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar a senha.");
      return false;
    } finally {
      setPendingOperation(null);
    }
  }

  async function deleteUser(payload: DeleteUserRequest) {
    setPendingOperation("delete");
    setError(null);
    setSuccess(null);
    try {
      await userApi.deleteUser(payload);
      clearToken();
      navigate("/login");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir a conta.");
      setPendingOperation(null);
      return false;
    }
  }

  return {
    profile,
    loadingProfile,
    pendingOperation,
    error,
    success,
    updateProfile,
    updatePassword,
    deleteUser,
  };
}