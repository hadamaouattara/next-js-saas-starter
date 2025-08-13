import ExonovQuantumDashboard from '@/components/ExonovQuantumDashboard';

export default function QuantumPage() {
  return (
    <div className="container mx-auto py-6">
      <ExonovQuantumDashboard />
    </div>
  );
}

export const metadata = {
  title: 'Quantum Dashboard - Exonov Quantum',
  description: 'Real-time quantum computing dashboard with n8n workflow integration',
};
