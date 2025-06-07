"use client";

import NotFound from "@/app/not-found";
import { Layout } from "@/components/layout";
import AuthPage from "@/routes/auth";
import Feed from "@/routes/feed";
import GroupsPage from "@/routes/groups";
import GroupDetailPage from "@/routes/group-detail";
import ChannelPage from "@/routes/channel";
import SettingsPage from "@/routes/settings";
import { BrowserRouter, Route, Routes } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        {" "}        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailPage />} />
          <Route path="/groups/:groupId/channels/:channelId" element={<ChannelPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
