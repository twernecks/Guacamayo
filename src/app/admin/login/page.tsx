import { LoginForm } from "@/components/admin/LoginForm";
import styles from "@/components/admin/LoginForm.module.css";

export default function AdminLoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Entrar no painel administrativo</h1>
        <LoginForm />
      </div>
    </main>
  );
}
