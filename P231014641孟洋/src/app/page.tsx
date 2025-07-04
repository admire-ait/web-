import KnowledgeBaseDashboard from "@/components/knowledge-base/knowledge-base-dashboard";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_QANYTHING_API_KEY || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <KnowledgeBaseDashboard apiKey={apiKey} />
    </div>
  );
}
