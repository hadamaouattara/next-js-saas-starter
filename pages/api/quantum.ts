import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Exonov Quantum - n8n Workflow Integration API
 * Connects Next.js SaaS platform with n8n quantum computing workflows
 */

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://exonov-u39090.vm.elestio.app';
const N8N_API_KEY = process.env.N8N_API_KEY;

interface QuantumProvider {
  provider: string;
  up: boolean;
  queue_length: number;
  ping_ms: number;
  credits: number;
}

interface PortfolioOptimizationRequest {
  tickers: string[];
  risk_tolerance: number;
  window?: number;
  user_id: string;
  subscription_tier: 'free' | 'premium' | 'enterprise';
}

interface QuantumJobStatus {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  provider: string;
  backend: string;
  progress: number;
  result?: any;
  error?: string;
}

class ExonovQuantumAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = N8N_BASE_URL;
    this.apiKey = N8N_API_KEY || '';
  }

  /**
   * Get quantum providers health status
   */
  async getQuantumHealth(): Promise<QuantumProvider[]> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/quant/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch quantum health');
      return await response.json();
    } catch (error) {
      console.error('Quantum health check failed:', error);
      return [];
    }
  }

  /**
   * Route quantum computation request
   */
  async routeQuantumJob(request: {
    problem_type: string;
    size: number;
    latency_target: 'low' | 'normal' | 'high';
    risk_policy: 'free' | 'standard' | 'premium';
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/quant/router`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) throw new Error('Quantum routing failed');
      return await response.json();
    } catch (error) {
      console.error('Quantum routing error:', error);
      throw error;
    }
  }

  /**
   * Optimize portfolio using QAOA algorithm
   */
  async optimizePortfolio(request: PortfolioOptimizationRequest) {
    try {
      // Map subscription tier to risk policy
      const riskPolicy = {
        'free': 'free',
        'premium': 'standard', 
        'enterprise': 'premium'
      }[request.subscription_tier] as 'free' | 'standard' | 'premium';

      const response = await fetch(`${this.baseUrl}/webhook/quant/portfolio_opt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          risk_policy: riskPolicy,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) throw new Error('Portfolio optimization failed');
      return await response.json();
    } catch (error) {
      console.error('Portfolio optimization error:', error);
      throw error;
    }
  }

  /**
   * Get quantum job status
   */
  async getJobStatus(jobId: string): Promise<QuantumJobStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/quant/status/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Job status check failed:', error);
      return null;
    }
  }

  /**
   * Execute custom quantum algorithm
   */
  async executeQuantumAlgorithm(params: {
    algorithm: 'QAOA' | 'VQE' | 'Grover' | 'custom';
    parameters: Record<string, any>;
    user_id: string;
    subscription_tier: string;
  }) {
    try {
      const routing = await this.routeQuantumJob({
        problem_type: params.algorithm,
        size: params.parameters.qubits || 4,
        latency_target: 'normal',
        risk_policy: params.subscription_tier === 'enterprise' ? 'premium' : 'standard',
      });

      const response = await fetch(`${this.baseUrl}/webhook/quant/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: `${Date.now()}_${params.user_id}`,
          algo: params.algorithm,
          provider: routing.provider,
          backend: routing.backend,
          params: params.parameters,
          requester: 'saas_platform',
          user_id: params.user_id,
        }),
      });
      
      if (!response.ok) throw new Error('Quantum execution failed');
      return await response.json();
    } catch (error) {
      console.error('Quantum execution error:', error);
      throw error;
    }
  }
}

// API Routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const quantum = new ExonovQuantumAPI();
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.action === 'health') {
          const health = await quantum.getQuantumHealth();
          res.status(200).json({ success: true, data: health });
        } else if (query.action === 'status' && query.job_id) {
          const status = await quantum.getJobStatus(query.job_id as string);
          res.status(200).json({ success: true, data: status });
        } else {
          res.status(400).json({ error: 'Invalid GET action' });
        }
        break;

      case 'POST':
        const { action, ...data } = req.body;
        
        if (action === 'optimize_portfolio') {
          const result = await quantum.optimizePortfolio(data);
          res.status(200).json({ success: true, data: result });
        } else if (action === 'execute_algorithm') {
          const result = await quantum.executeQuantumAlgorithm(data);
          res.status(200).json({ success: true, data: result });
        } else if (action === 'route_job') {
          const result = await quantum.routeQuantumJob(data);
          res.status(200).json({ success: true, data: result });
        } else {
          res.status(400).json({ error: 'Invalid POST action' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Quantum API error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

// Export the quantum API client for use in other parts of the application
export { ExonovQuantumAPI };
