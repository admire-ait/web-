"use client";

import { ChatDashboard } from "@/components/chat";

export default function ChatPage() {
  const apiKey = process.env.NEXT_PUBLIC_QANYTHING_API_KEY || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <ChatDashboard apiKey={apiKey} />
    </div>
  );
}

