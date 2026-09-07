export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="d-flex align-items-center gap-2 py-5" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return <div className="alert alert-danger" role="alert">{message}</div>;
}
