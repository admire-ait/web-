import { AgentDashboard } from '@/components/agent';

export default function AgentsPage() {
  const apiKey = process.env.NEXT_PUBLIC_QANYTHING_API_KEY || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <AgentDashboard apiKey={apiKey} />
    </div>
  );
}

export const metadata = {
  title: 'Agent管理 - QAnything',
  description: '管理您的QAnything Agent',
};