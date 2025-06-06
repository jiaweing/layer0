"use client";

import NotFound from "@/app/not-found";
import { ProtectedRoute } from "@/components/auth";
import { Docs, Examples, Home, Layout } from "@/components/boilerplate";
import AuthPage from "@/routes/auth";
import Dashboard from "@/routes/dashboard";
import { BrowserRouter, Route, Routes } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/examples" element={<Examples />} />
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
