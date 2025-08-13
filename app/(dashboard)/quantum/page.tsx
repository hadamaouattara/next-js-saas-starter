export default function QuantumPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔬 Exonov Quantum Dashboard</h1>
      <p>Advanced AI & Quantum Computing Platform</p>
      
      <div style={{ margin: '20px 0' }}>
        <h2>🚀 Platform Status</h2>
        <p>✅ System Online</p>
        <p>✅ API Functional</p>
        <p>✅ Quantum Providers Ready</p>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h2>📊 Quick Actions</h2>
        <button 
          onClick={() => fetch('/api/quantum').then(r => r.json()).then(console.log)}
          style={{ 
            padding: '10px 20px', 
            background: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test API
        </button>
      </div>
    </div>
  );
}
