import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegister } from "./useRegister";
import type { RegisterRequest } from "./types";

const initialState: RegisterRequest = {
  username: "",
  email: "",
  password: "",
  displayName: "",
  bio: "",
  status: "ATIVO",
};

export function RegisterForm() {
  const [form, setForm] = useState<RegisterRequest>(initialState);
  const { submit, status, error } = useRegister();

  function handleChange(field: keyof RegisterRequest) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(form);
  }

  if (status === "success") {
    return <p className="success-message">Cadastro realizado com sucesso.</p>;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Input
        id="username"
        label="Usuário"
        value={form.username}
        onChange={handleChange("username")}
        required
      />
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
      <Input
        id="displayName"
        label="Nome de exibição"
        value={form.displayName}
        onChange={handleChange("displayName")}
        required
      />
      <Input
        id="bio"
        label="Bio"
        value={form.bio}
        onChange={handleChange("bio")}
      />

      {error && <p className="error-message">{error}</p>}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
