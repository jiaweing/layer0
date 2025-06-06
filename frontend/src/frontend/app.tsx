"use client";

import NotFound from "@/app/not-found";
import { ProtectedRoute } from "@/components/auth";
import { Layout } from "@/components/boilerplate";
import AuthPage from "@/routes/auth";
import Dashboard from "@/routes/dashboard";
import Feed from "@/routes/feed";
import { BrowserRouter, Route, Routes } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
