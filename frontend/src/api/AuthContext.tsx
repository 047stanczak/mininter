import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { clearToken, getToken, setToken } from "./token";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setTokenState] = useState<string | null>(getToken());

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
      setToken: handleSetToken,
      clearToken: handleClearToken,
    }),
    [handleClearToken, handleSetToken, token]
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
