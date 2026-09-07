import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      const target = (location.state as { from?: string } | null)?.from ?? "/admin";
      navigate(target, { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Não foi possível entrar.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-5 py-lg-6">
      <div className="auth-panel border rounded-3 bg-white p-4 p-md-5 mx-auto">
        <p className="eyebrow mb-2">Área docente</p>
        <h1 className="h2 mb-3">Entrar</h1>
        <p className="text-secondary mb-4">Use as credenciais cadastradas no back-end.</p>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="vstack gap-3">
          <div>
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              className="form-control"
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="password">Senha</label>
            <input
              className="form-control"
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button className="btn btn-primary mt-2" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
