import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorAlert, Loading } from "../components/Feedback";
import { api } from "../services/api";
import type { Post } from "../types";

export function PostPage() {
  const { id = "" } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPost(id)
      .then(setPost)
      .catch((caughtError: unknown) => {
        setError(caughtError instanceof Error ? caughtError.message : "Não foi possível carregar o post.");
      });
  }, [id]);

  return (
    <div className="container py-5">
      <div className="article-column">
        <Link className="d-inline-block mb-4" to="/">← Voltar para os posts</Link>
        {!post && !error && <Loading label="Carregando post..." />}
        {error && <ErrorAlert message={error} />}
        {post && (
          <article>
            <header className="border-bottom pb-4 mb-4">
              <p className="eyebrow mb-2">Publicação</p>
              <h1 className="display-5 fw-bold">{post.title}</h1>
              <p className="text-secondary mb-0">Por {post.author}</p>
            </header>
            <div className="post-content">{post.content}</div>
          </article>
        )}
      </div>
    </div>
  );
}
