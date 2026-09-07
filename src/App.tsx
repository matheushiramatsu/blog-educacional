import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminPage } from "./pages/AdminPage";
import { EditPostPage } from "./pages/EditPostPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NewPostPage } from "./pages/NewPostPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PostPage } from "./pages/PostPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="posts/:id" element={<PostPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="admin" element={<AdminPage />} />
              <Route path="posts/novo" element={<NewPostPage />} />
              <Route path="posts/:id/editar" element={<EditPostPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
