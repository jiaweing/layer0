"use client";

import NotFound from "@/app/not-found";
import { Layout } from "@/components/boilerplate";
import AuthPage from "@/routes/auth";
import Feed from "@/routes/feed";
import SettingsPage from "@/routes/settings";
import { BrowserRouter, Route, Routes } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        {" "}
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
