import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorAlert, Loading } from "../components/Feedback";
import { PostForm } from "../components/PostForm";
import { api } from "../services/api";
import type { Post, PostInput } from "../types";

export function EditPostPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPost(id)
      .then(setPost)
      .catch((caughtError: unknown) => {
        setError(caughtError instanceof Error ? caughtError.message : "Não foi possível carregar o post.");
      });
  }, [id]);

  async function updatePost(values: PostInput) {
    await api.updatePost(id, values);
    navigate("/admin", { replace: true, state: { message: "Post atualizado com sucesso." } });
  }

  return (
    <div className="container py-5">
      <div className="form-column">
        <Link className="d-inline-block mb-4" to="/admin">← Voltar para a administração</Link>
        <p className="eyebrow mb-2">Área docente</p>
        <h1 className="h2 mb-4">Editar postagem</h1>
        {!post && !error && <Loading label="Carregando dados do post..." />}
        {error && <ErrorAlert message={error} />}
        {post && (
          <PostForm
            initialValues={{ title: post.title, author: post.author, content: post.content }}
            submitLabel="Salvar alterações"
            onSubmit={updatePost}
          />
        )}
      </div>
    </div>
  );
}
