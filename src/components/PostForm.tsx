import { useState, type FormEvent } from "react";
import type { PostInput } from "../types";

interface PostFormProps {
  initialValues?: PostInput;
  submitLabel: string;
  onSubmit: (values: PostInput) => Promise<void>;
}

const emptyPost: PostInput = { title: "", author: "", content: "" };

export function PostForm({ initialValues = emptyPost, submitLabel, onSubmit }: PostFormProps) {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        author: values.author.trim(),
        content: values.content.trim(),
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Não foi possível salvar o post.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="vstack gap-4">
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div>
        <label className="form-label" htmlFor="title">Título</label>
        <input
          className="form-control"
          id="title"
          maxLength={160}
          required
          value={values.title}
          onChange={(event) => setValues({ ...values, title: event.target.value })}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="author">Autor</label>
        <input
          className="form-control"
          id="author"
          maxLength={100}
          required
          value={values.author}
          onChange={(event) => setValues({ ...values, author: event.target.value })}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="content">Conteúdo</label>
        <textarea
          className="form-control"
          id="content"
          rows={12}
          required
          value={values.content}
          onChange={(event) => setValues({ ...values, content: event.target.value })}
        />
      </div>

      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
