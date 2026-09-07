import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function navClass({ isActive }: { isActive: boolean }) {
  return `nav-link${isActive ? " active fw-semibold" : ""}`;
}

export function Layout() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo
      </a>
      <header className="border-bottom bg-white">
        <nav className="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3" aria-label="Navegação principal">
          <NavLink className="brand text-decoration-none" to="/">Blog educacional</NavLink>
          <div className="d-flex flex-wrap align-items-center gap-1">
            <NavLink className={navClass} to="/" end>Posts</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink className={navClass} to="/admin">Administração</NavLink>
                <NavLink className="btn btn-primary btn-sm ms-1" to="/posts/novo">Novo post</NavLink>
                <button className="btn btn-outline-secondary btn-sm ms-1" type="button" onClick={logout}>
                  Sair<span className="visually-hidden"> de {user?.email}</span>
                </button>
              </>
            ) : (
              <NavLink className="btn btn-outline-primary btn-sm ms-1" to="/login">Entrar</NavLink>
            )}
          </div>
        </nav>
      </header>

      <main id="main-content" className="flex-grow-1" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="border-top bg-white py-4 mt-auto">
        <div className="container small text-secondary">Blog educacional</div>
      </footer>
    </div>
  );
}
