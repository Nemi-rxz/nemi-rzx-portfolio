import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadingProvider } from "./context/LoadingProvider";
import PortfolioPage from "./pages/PortfolioPage";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import SiteAdmin from "./pages/admin/SiteAdmin";

export default function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ProjectsAdmin />} />
            <Route path="site" element={<SiteAdmin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}
