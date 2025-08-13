export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>🔬 Exonov Quantum</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Advanced AI & Quantum Computing Platform</p>
      </nav>
      {children}
    </div>
  );
}