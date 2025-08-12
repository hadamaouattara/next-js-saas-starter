# 🔗 Exonov Quantum - n8n Integration Guide

## 📋 Quick Setup

### 1. Environment Variables
Ajoute à ton `.env.local` :

```env
# n8n Integration
N8N_BASE_URL=https://exonov-u39090.vm.elestio.app
N8N_API_KEY=your-n8n-api-key
N8N_WEBHOOK_SECRET=your-webhook-secret

# Quantum Providers API Keys
IBM_QUANTUM_TOKEN=your-ibm-quantum-token
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AZURE_SUBSCRIPTION_ID=your-azure-subscription
GOOGLE_QUANTUM_API_KEY=your-google-quantum-key

# Dashboard Configuration
NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL=30000
NEXT_PUBLIC_ENABLE_REAL_TIME=true
```

### 2. n8n Webhook URLs
Tes workflows n8n exposent ces endpoints :

```
🔬 Health Check    : GET  /webhook/quant/health
🎯 Router          : POST /webhook/quant/router  
📊 Portfolio QAOA  : POST /webhook/quant/portfolio_opt
🚀 Job Runner      : POST /webhook/quant/execute
💰 Credits Probe   : GET  /webhook/quant/credits
📡 Job Status      : GET  /webhook/quant/status/{job_id}
```

### 3. Dashboard Integration

#### A. Ajouter à `pages/_app.tsx`
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExonovQuantumProvider } from '../lib/exonov-quantum-context';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ExonovQuantumProvider>
        <Component {...pageProps} />
      </ExonovQuantumProvider>
    </QueryClientProvider>
  );
}
```

#### B. Créer la page dashboard
```typescript
// pages/dashboard/quantum.tsx
import ExonovQuantumDashboard from '../components/ExonovQuantumDashboard';
import { requireAuth } from '../lib/auth';

export default function QuantumDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExonovQuantumDashboard />
    </div>
  );
}

export const getServerSideProps = requireAuth;
```

## 🔌 API Integration Patterns

### Real-time Health Monitoring
```typescript
// Utilise React Query pour polling automatique
const { data: healthStatus, isLoading } = useQuery({
  queryKey: ['quantum-health'],
  queryFn: () => quantumAPI.getQuantumHealth(),
  refetchInterval: 30000, // 30 secondes
  retry: 3,
});
```

### Portfolio Optimization
```typescript
const optimizePortfolio = useMutation({
  mutationFn: (params: PortfolioParams) => 
    quantumAPI.optimizePortfolio(params),
  onSuccess: (result) => {
    toast.success('Portfolio optimized successfully!');
    setOptimizationResult(result);
  },
  onError: (error) => {
    toast.error('Optimization failed: ' + error.message);
  }
});
```

### Job Status Tracking
```typescript
const useJobTracker = (jobId: string) => {
  return useQuery({
    queryKey: ['job-status', jobId],
    queryFn: () => quantumAPI.getJobStatus(jobId),
    refetchInterval: (data) => {
      // Stop polling when job is complete
      return data?.status === 'completed' ? false : 5000;
    },
    enabled: !!jobId,
  });
};
```

## 🎛️ Dashboard Components Usage

### Health Monitor
```typescript
import { QuantumHealthMonitor } from '../components/quantum/HealthMonitor';

<QuantumHealthMonitor 
  refreshInterval={30000}
  showCredits={true}
  onProviderClick={(provider) => console.log('Selected:', provider)}
/>
```

### Portfolio Optimizer
```typescript
import { PortfolioOptimizer } from '../components/quantum/PortfolioOptimizer';

<PortfolioOptimizer 
  defaultTickers={['AAPL', 'GOOGL', 'MSFT']}
  maxTickers={10}
  onOptimizationComplete={(result) => handleResult(result)}
  subscriptionTier="premium"
/>
```

### Job Tracker
```typescript
import { JobTracker } from '../components/quantum/JobTracker';

<JobTracker 
  userId="user123"
  showHistory={true}
  autoRefresh={true}
  onJobClick={(job) => showJobDetails(job)}
/>
```

## 🔄 n8n Workflow Triggers

### Trigger Health Check Manually
```typescript
const triggerHealthCheck = async () => {
  try {
    const response = await fetch('/api/n8n/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workflow: 'health-check',
        immediate: true
      })
    });
    
    if (response.ok) {
      toast.success('Health check triggered successfully');
    }
  } catch (error) {
    toast.error('Failed to trigger health check');
  }
};
```

### Start/Stop Workflows
```typescript
const toggleWorkflow = async (workflowId: string, active: boolean) => {
  try {
    const response = await fetch(`/api/n8n/workflows/${workflowId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active })
    });
    
    if (response.ok) {
      toast.success(`Workflow ${active ? 'started' : 'stopped'} successfully`);
      refetchWorkflows();
    }
  } catch (error) {
    toast.error('Failed to toggle workflow');
  }
};
```

## 📊 Workflow Monitoring

### Get Workflow Executions
```typescript
const { data: executions } = useQuery({
  queryKey: ['workflow-executions', workflowId],
  queryFn: async () => {
    const response = await fetch(`/api/n8n/workflows/${workflowId}/executions`);
    return response.json();
  },
  refetchInterval: 10000, // 10 secondes
});
```

### Real-time Execution Updates
```typescript
useEffect(() => {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
  
  socket.on('workflow-execution', (data) => {
    queryClient.setQueryData(['workflow-executions'], (old: any) => {
      return [data, ...(old || [])];
    });
  });
  
  return () => socket.disconnect();
}, []);
```

## 🎨 TailAdmin Integration

### 1. Installation TailAdmin
```bash
# Clone TailAdmin template
git clone https://github.com/TailAdmin/free-nextjs-admin-dashboard tailadmin
cd tailadmin

# Install dependencies
npm install

# Copy quantum components
cp -r ../components/quantum ./src/components/
cp ../pages/api/quantum.ts ./src/pages/api/
```

### 2. Adapter le Layout
```typescript
// components/Layout/DefaultLayout.tsx
import { ExonovQuantumDashboard } from '../quantum/ExonovQuantumDashboard';

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="grow bg-gray-50 dark:bg-boxdark-2">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### 3. Ajouter Routes Quantum
```typescript
// components/Sidebar/index.tsx
const menuItems = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'dashboard'
  },
  {
    label: 'Quantum Control',
    route: '/quantum',
    icon: 'cpu',
    children: [
      { label: 'Health Monitor', route: '/quantum/health' },
      { label: 'Portfolio Optimizer', route: '/quantum/portfolio' },
      { label: 'Job Tracker', route: '/quantum/jobs' },
      { label: 'Circuit Designer', route: '/quantum/circuits' }
    ]
  },
  {
    label: 'n8n Workflows',
    route: '/workflows',
    icon: 'workflow',
    children: [
      { label: 'Management', route: '/workflows/management' },
      { label: 'Executions', route: '/workflows/executions' },
      { label: 'Settings', route: '/workflows/settings' }
    ]
  }
];
```

## 🔐 Security & Authentication

### Webhook Security
```typescript
// middleware/webhook-auth.ts
export const validateWebhookSignature = (req: NextApiRequest) => {
  const signature = req.headers['x-n8n-signature'];
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', process.env.N8N_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
    
  return signature === expectedSignature;
};
```

### API Rate Limiting
```typescript
// lib/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export const checkRateLimit = async (identifier: string) => {
  const { success } = await ratelimit.limit(identifier);
  return success;
};
```

## 📈 Performance Optimization

### Caching Strategy
```typescript
// lib/cache.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Lazy Loading Components
```typescript
// Dynamic imports for heavy components
const QuantumCircuitDesigner = dynamic(
  () => import('../components/quantum/CircuitDesigner'),
  { 
    loading: () => <div>Loading Circuit Designer...</div>,
    ssr: false 
  }
);
```

## 🚀 Deployment Configuration

### Vercel Configuration
```json
// vercel.json
{
  "functions": {
    "pages/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "N8N_BASE_URL": "@n8n_base_url",
    "N8N_API_KEY": "@n8n_api_key"
  },
  "rewrites": [
    {
      "source": "/quantum/:path*",
      "destination": "/dashboard/quantum/:path*"
    }
  ]
}
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 📝 Testing

### API Integration Tests
```typescript
// __tests__/api/quantum.test.ts
describe('Quantum API', () => {
  test('should get health status', async () => {
    const health = await quantumAPI.getQuantumHealth();
    expect(health).toHaveLength(4); // IBM, AWS, Azure, Google
    expect(health[0]).toHaveProperty('provider');
    expect(health[0]).toHaveProperty('up');
  });
  
  test('should optimize portfolio', async () => {
    const result = await quantumAPI.optimizePortfolio({
      tickers: ['AAPL', 'GOOGL'],
      risk_tolerance: 0.5,
      user_id: 'test-user',
      subscription_tier: 'premium'
    });
    
    expect(result).toHaveProperty('portfolio_optimization');
    expect(result.portfolio_optimization).toHaveProperty('allocations');
  });
});
```

### Component Testing
```typescript
// __tests__/components/ExonovQuantumDashboard.test.tsx
import { render, screen } from '@testing-library/react';
import ExonovQuantumDashboard from '../components/ExonovQuantumDashboard';

jest.mock('../pages/api/quantum');

test('renders quantum dashboard', () => {
  render(<ExonovQuantumDashboard />);
  expect(screen.getByText('Exonov Quantum Control Center')).toBeInTheDocument();
});
```

## 🔧 Troubleshooting

### Common Issues

1. **n8n Connection Failed**
   ```bash
   # Check n8n status
   curl https://exonov-u39090.vm.elestio.app/rest/active-workflows
   
   # Verify API key
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://exonov-u39090.vm.elestio.app/rest/workflows
   ```

2. **Webhook Not Receiving Data**
   ```typescript
   // Add logging to webhook handler
   export default function handler(req: NextApiRequest, res: NextApiResponse) {
     console.log('Webhook received:', {
       method: req.method,
       headers: req.headers,
       body: req.body
     });
     
     // ... rest of handler
   }
   ```

3. **React Query Cache Issues**
   ```typescript
   // Clear specific cache
   queryClient.invalidateQueries(['quantum-health']);
   
   // Clear all cache
   queryClient.clear();
   ```

## 🔗 Useful Links

- **TailAdmin Demo**: https://nextjs-demo.tailadmin.com
- **n8n Documentation**: https://docs.n8n.io
- **React Query Guide**: https://tanstack.com/query
- **Next.js API Routes**: https://nextjs.org/docs/api-routes

---

**Next Steps**: 
1. Clone TailAdmin template
2. Setup environment variables
3. Test n8n webhook connections
4. Deploy to Vercel/production

🚀 **Ready to build the future of quantum computing dashboards!**
