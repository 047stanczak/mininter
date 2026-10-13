import { UserSettingsForm } from "@/features/user/UserSettingsForm";

export function UserSettingsPage() {
  return (
    <main className="page">
      <div className="card settings-card">
        <h1>Configurações da conta</h1>
        <UserSettingsForm />
      </div>
    </main>
  );
}