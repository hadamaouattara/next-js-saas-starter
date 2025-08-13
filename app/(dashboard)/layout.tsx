export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>🔬 Exonov Quantum Dashboard</h1>
      </nav>
      {children}
    </div>
  );
}