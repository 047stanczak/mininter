import { Link } from "react-router-dom";
import { LoginForm } from "@/features/auth/LoginForm";

export function LoginPage() {
  return (
    <main className="page">
      <div className="card">
        <h1>Entrar</h1>
        <LoginForm />
        <p className="form-footer">
          Não tem conta?{" "}
          <Link className="text-link" to="/register">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
