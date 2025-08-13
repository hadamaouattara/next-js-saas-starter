export default function PricingPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>💰 Exonov Quantum Pricing</h1>
      <p>Choose the perfect plan for your quantum computing needs.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '30px 0' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Starter</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$99/month</p>
          <ul>
            <li>1,000 quantum operations</li>
            <li>Basic algorithms</li>
            <li>Email support</li>
          </ul>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#f8f9fa' }}>
          <h3>Professional</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$299/month</p>
          <ul>
            <li>10,000 quantum operations</li>
            <li>Advanced algorithms</li>
            <li>Priority support</li>
            <li>n8n integration</li>
          </ul>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Enterprise</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Custom</p>
          <ul>
            <li>Unlimited operations</li>
            <li>Custom algorithms</li>
            <li>24/7 support</li>
            <li>Full API access</li>
          </ul>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a href="/quantum" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Start Free Trial
        </a>
      </div>
    </div>
  );
}
