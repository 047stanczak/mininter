import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { userApi } from "@/features/user/api";
import { clearToken, getToken, setToken } from "./token";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  username: string | null;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setUsername(null);
      return;
    }

    let isCurrent = true;
    userApi
      .fetchProfile()
      .then((response) => {
        if (isCurrent) setUsername(response.data?.username ?? null);
      })
      .catch(() => {
        if (isCurrent) setUsername(null);
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const handleSetToken = useCallback((nextToken: string) => {
    setToken(nextToken);
    setTokenState(nextToken);
  }, []);

  const handleClearToken = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      username,
      setUsername,
      setToken: handleSetToken,
      clearToken: handleClearToken,
    }),
    [handleClearToken, handleSetToken, token, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
