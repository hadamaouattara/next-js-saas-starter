export default function DashboardHome() {
  return (
    <div>
      <h2>🚀 Platform Status</h2>
      <div style={{ margin: '20px 0' }}>
        <p>✅ System Online</p>
        <p>✅ API Functional</p> 
        <p>✅ Quantum Providers Ready</p>
      </div>
      
      <div style={{ margin: '30px 0' }}>
        <h3>📊 Quick Actions</h3>
        <a href="/quantum" style={{ 
          display: 'inline-block',
          padding: '12px 24px', 
          background: '#0070f3', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '5px',
          marginRight: '10px'
        }}>
          Quantum Dashboard
        </a>
        <button 
          onClick={() => fetch('/api/quantum').then(r => r.json()).then(console.log)}
          style={{ 
            padding: '12px 24px', 
            background: '#10B981', 
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