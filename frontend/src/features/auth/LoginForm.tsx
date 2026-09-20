import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "./useLogin";
import type { LoginRequest } from "./types";

const initialState: LoginRequest = {
  email: "",
  password: "",
};

export function LoginForm() {
  const [form, setForm] = useState<LoginRequest>(initialState);
  const { submit, status, error } = useLogin();

  function handleChange(field: keyof LoginRequest) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(form);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Input
        id="email"
        label="E-mail"
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        required
      />
      <Input
        id="password"
        label="Senha"
        type="password"
        value={form.password}
        onChange={handleChange("password")}
        required
      />

      {error && <p className="error-message">{error}</p>}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
