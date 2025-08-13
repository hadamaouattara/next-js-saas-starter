'use client';

export default function LoginComponent() {
  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🔬 Exonov Quantum Login
      </h2>
      
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email"
          style={{
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        
        <input 
          type="password" 
          placeholder="Password"
          style={{
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        
        <button 
          type="submit"
          style={{
            padding: '12px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
