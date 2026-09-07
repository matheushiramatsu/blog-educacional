import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ErrorAlert, Loading } from "../components/Feedback";
import { api } from "../services/api";
import type { Post } from "../types";

export function AdminPage() {
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    (location.state as { message?: string } | null)?.message ?? "",
  );
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    api.getPosts()
      .then(setPosts)
      .catch((caughtError: unknown) => {
        setError(caughtError instanceof Error ? caughtError.message : "Não foi possível carregar os posts.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function deletePost(post: Post) {
    const confirmed = window.confirm(`Excluir o post “${post.title}”? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;
    setError("");
    setMessage("");
    setDeletingId(post.id);
    try {
      await api.deletePost(post.id);
      setPosts((currentPosts) => currentPosts.filter((item) => item.id !== post.id));
      setMessage("Post excluído com sucesso.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Não foi possível excluir o post.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <p className="eyebrow mb-2">Área docente</p>
          <h1 className="h2 mb-0">Administrar postagens</h1>
        </div>
        <Link className="btn btn-primary align-self-start" to="/posts/novo">Criar postagem</Link>
      </div>

      <div aria-live="polite">
        {message && <div className="alert alert-success" role="status">{message}</div>}
        {error && <ErrorAlert message={error} />}
      </div>
      {loading && <Loading label="Carregando postagens..." />}

      {!loading && posts.length === 0 && (
        <div className="empty-state border rounded-3 p-4">
          <h2 className="h5">Nenhuma postagem cadastrada</h2>
          <p className="text-secondary mb-0">Crie a primeira postagem para começar.</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="table-responsive border rounded-3 bg-white">
          <table className="table align-middle mb-0">
            <caption className="visually-hidden">Lista de postagens disponíveis para edição ou exclusão</caption>
            <thead className="table-light">
              <tr>
                <th scope="col">Título</th>
                <th scope="col" className="d-none d-sm-table-cell">Autor</th>
                <th scope="col" className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link className="fw-semibold" to={`/posts/${post.id}`}>{post.title}</Link>
                  </td>
                  <td className="d-none d-sm-table-cell">{post.author}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <Link className="btn btn-outline-primary btn-sm" to={`/posts/${post.id}/editar`}>
                        Editar<span className="visually-hidden"> {post.title}</span>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        type="button"
                        disabled={deletingId === post.id}
                        onClick={() => void deletePost(post)}
                      >
                        {deletingId === post.id ? "Excluindo..." : "Excluir"}
                        <span className="visually-hidden"> {post.title}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
