import { Link } from "react-router-dom";
import { RegisterForm } from "@/features/auth/RegisterForm";

export function RegisterPage() {
  return (
    <main className="page">
      <div className="card">
        <h1>Criar conta</h1>
        <RegisterForm />
        <p className="form-footer">
          Já tem conta?{" "}
          <Link className="text-link" to="/login">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}