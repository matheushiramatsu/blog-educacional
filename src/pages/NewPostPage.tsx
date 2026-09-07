import { Link, useNavigate } from "react-router-dom";
import { PostForm } from "../components/PostForm";
import { api } from "../services/api";
import type { PostInput } from "../types";

export function NewPostPage() {
  const navigate = useNavigate();

  async function createPost(values: PostInput) {
    await api.createPost(values);
    navigate("/admin", { replace: true, state: { message: "Post criado com sucesso." } });
  }

  return (
    <div className="container py-5">
      <div className="form-column">
        <Link className="d-inline-block mb-4" to="/admin">← Voltar para a administração</Link>
        <p className="eyebrow mb-2">Área docente</p>
        <h1 className="h2 mb-4">Criar postagem</h1>
        <PostForm submitLabel="Publicar post" onSubmit={createPost} />
      </div>
    </div>
  );
}
