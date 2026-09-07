import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorAlert, Loading } from "../components/Feedback";
import { api } from "../services/api";
import type { Post } from "../types";

function excerpt(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > 150 ? `${normalized.slice(0, 147)}...` : normalized;
}

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPosts()
      .then(setPosts)
      .catch((caughtError: unknown) => {
        setError(caughtError instanceof Error ? caughtError.message : "Não foi possível carregar os posts.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (!term) return posts;
    return posts.filter((post) =>
      [post.title, post.author, post.content].some((value) => value.toLocaleLowerCase("pt-BR").includes(term)),
    );
  }, [posts, search]);

  return (
    <>
      <section className="page-intro border-bottom">
        <div className="container py-5 py-lg-6">
          <p className="eyebrow mb-2">Conteúdo para aprender e compartilhar</p>
          <h1 className="display-5 fw-bold mb-3">Posts acadêmicos</h1>
          <p className="lead text-secondary mb-0 page-lead">
            Consulte publicações dos docentes e encontre conteúdos por palavra-chave.
          </p>
        </div>
      </section>

      <section className="container py-5" aria-labelledby="posts-heading">
        <div className="row align-items-end g-3 mb-4">
          <div className="col-lg-7">
            <h2 id="posts-heading" className="h3 mb-0">Publicações</h2>
          </div>
          <div className="col-lg-5">
            <label className="form-label" htmlFor="search">Buscar posts</label>
            <input
              className="form-control"
              id="search"
              type="search"
              placeholder="Digite um título, autor ou palavra-chave"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading && <Loading label="Carregando publicações..." />}
        {error && <ErrorAlert message={error} />}

        {!loading && !error && filteredPosts.length === 0 && (
          <div className="empty-state border rounded-3 p-4" role="status">
            <h3 className="h5">Nenhum post encontrado</h3>
            <p className="text-secondary mb-0">Tente buscar por outro termo.</p>
          </div>
        )}

        <div className="row g-4" aria-live="polite">
          {filteredPosts.map((post) => (
            <div className="col-md-6" key={post.id}>
              <article className="card post-card h-100">
                <div className="card-body d-flex flex-column p-4">
                  <p className="small text-secondary mb-2">Por {post.author}</p>
                  <h3 className="h4 card-title">{post.title}</h3>
                  <p className="card-text text-secondary flex-grow-1">{excerpt(post.content)}</p>
                  <Link className="stretched-link fw-semibold" to={`/posts/${post.id}`}>
                    Ler post<span className="visually-hidden">: {post.title}</span>
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
