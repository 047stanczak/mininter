import { RegisterForm } from "@/features/auth/RegisterForm";

export function RegisterPage() {
  return (
    <main className="page">
      <div className="card">
        <h1>Criar conta</h1>
        <RegisterForm />
      </div>
    </main>
  );
}