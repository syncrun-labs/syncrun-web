import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import type { ApiClient } from "./api/client";
import { AuthProvider, RequireAuth } from "./auth/auth";
import { Layout } from "./components/Layout";
import { ToastProvider } from "./components/Toast";
import { CampaignPage } from "./pages/CampaignPage";
import { ComposePage } from "./pages/ComposePage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { TestRecipientsPage } from "./pages/TestRecipientsPage";

export function App({ api }: { api?: ApiClient }) {
  return (
    <ToastProvider>
      <AuthProvider api={api}>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="compose" element={<ComposePage />} />
              <Route path="campaigns/:id" element={<CampaignPage />} />
              <Route path="test-recipients" element={<TestRecipientsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
