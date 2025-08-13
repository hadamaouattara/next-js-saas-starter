export default function HomePage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', margin: '20px 0', color: '#333' }}>
        🔬 Exonov Quantum
      </h1>
      
      <p style={{ fontSize: '20px', color: '#666', margin: '20px 0' }}>
        Advanced AI & Quantum Computing Platform
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        margin: '40px 0' 
      }}>
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          background: '#f8f9fa'
        }}>
          <h3>🚀 Platform Status</h3>
          <p>✅ All Systems Online</p>
          <p>⚡ API Ready</p>
          <p>🔬 Quantum Providers Active</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px' 
        }}>
          <h3>🎯 Quick Access</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="/quantum" style={{
              padding: '10px 20px',
              background: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              Quantum Dashboard
            </a>
            <a href="/pricing" style={{
              padding: '10px 20px',
              background: '#10B981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              View Pricing
            </a>
          </div>
        </div>
      </div>
      
      <div style={{ margin: '40px 0' }}>
        <h3>⚡ Test API</h3>
        <button 
          onClick={() => {
            fetch('/api/quantum')
              .then(r => r.json())
              .then(data => {
                alert('API Response: ' + JSON.stringify(data, null, 2));
              })
              .catch(err => {
                alert('API Error: ' + err.message);
              });
          }}
          style={{
            padding: '12px 24px',
            background: '#7C3AED',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Test Quantum API
        </button>
      </div>
      
      <footer style={{ marginTop: '60px', color: '#999', fontSize: '14px' }}>
        <p>Powered by Exonov Quantum Computing Platform</p>
        <p>© 2025 - The Future of Quantum Computing</p>
      </footer>
    </div>
  );
}
