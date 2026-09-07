import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <p className="eyebrow mb-2">Erro 404</p>
      <h1 className="h2">Página não encontrada</h1>
      <p className="text-secondary">O endereço informado não existe.</p>
      <Link className="btn btn-primary" to="/">Voltar ao início</Link>
    </div>
  );
}
