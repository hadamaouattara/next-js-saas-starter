export default function DashboardHome() {
  return (
    <div>
      <h2>Welcome to Exonov Quantum</h2>
      <p>Your quantum computing platform is ready!</p>
      <div style={{ margin: '20px 0' }}>
        <a href="/quantum" style={{ 
          display: 'inline-block',
          padding: '10px 20px', 
          background: '#0070f3', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Go to Quantum Dashboard
        </a>
      </div>
    </div>
  );
}