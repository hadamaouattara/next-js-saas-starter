'use client';

import React, { useState, useEffect } from 'react';
import { ExonovQuantumAPI } from '../pages/api/quantum';

// Import des composants UI (supposés être disponibles via shadcn/ui)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Cpu, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface WorkflowStatus {
  id: string;
  name: string;
  active: boolean;
  executions: number;
  success_rate: number;
  last_execution?: string;
}

interface QuantumMetrics {
  total_jobs: number;
  successful_jobs: number;
  failed_jobs: number;
  avg_execution_time: number;
  credits_used: number;
  credits_remaining: number;
}

const ExonovQuantumDashboard: React.FC = () => {
  const [quantumAPI] = useState(() => new ExonovQuantumAPI());
  const [workflows, setWorkflows] = useState<WorkflowStatus[]>([]);
  const [metrics, setMetrics] = useState<QuantumMetrics | null>(null);
  const [healthStatus, setHealthStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler les données des workflows n8n
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simuler les workflows basés sur tes workflows réels
        const mockWorkflows: WorkflowStatus[] = [
          {
            id: '53vq9YCYE8EbaSMX',
            name: '🔬 Quantum | 01 - Health Check',
            active: true,
            executions: 1440, // 15min intervals * 24h * 4 days
            success_rate: 98.5,
            last_execution: new Date(Date.now() - 15 * 60 * 1000).toISOString()
          },
          {
            id: '2N2Wfc8SKNMetreD',
            name: '🔬 Quantum | 02 - Credits Probe',
            active: true,
            executions: 288, // Hourly checks
            success_rate: 95.2,
            last_execution: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          },
          {
            id: 'enLAY2ZMnMdjlKCT',
            name: '🔬 Quantum | 03 - Router',
            active: true,
            executions: 156,
            success_rate: 92.8,
            last_execution: new Date(Date.now() - 5 * 60 * 1000).toISOString()
          },
          {
            id: '3VfSxlrvdQ3vl0CD',
            name: '🔬 Quantum | 05 - Portfolio QAOA',
            active: true,
            executions: 45,
            success_rate: 88.9,
            last_execution: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'M2Hb9PexlWAB8zu9',
            name: '🔬 Quantum | 04 - Job Runner',
            active: true,
            executions: 89,
            success_rate: 91.0,
            last_execution: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          }
        ];

        const mockMetrics: QuantumMetrics = {
          total_jobs: 2018,
          successful_jobs: 1852,
          failed_jobs: 166,
          avg_execution_time: 847, // ms
          credits_used: 1247,
          credits_remaining: 8753
        };

        setWorkflows(mockWorkflows);
        setMetrics(mockMetrics);

        // Charger le statut de santé quantique
        const health = await quantumAPI.getQuantumHealth();
        setHealthStatus(health);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Refresh toutes les 30 secondes
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [quantumAPI]);

  const getStatusIcon = (active: boolean, success_rate: number) => {
    if (!active) return <XCircle className="h-4 w-4 text-gray-400" />;
    if (success_rate >= 95) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (success_rate >= 85) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (success_rate: number) => {
    if (success_rate >= 95) return 'bg-green-100 text-green-800';
    if (success_rate >= 85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading Exonov Quantum Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Cpu className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Exonov Quantum Control Center
            </h1>
            <p className="text-gray-600">Real-time monitoring & quantum workflow management</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 px-3 py-1">
          All Systems Operational
        </Badge>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Quantum Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{metrics.total_jobs.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">
                  {((metrics.successful_jobs / metrics.total_jobs) * 100).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold">{metrics.avg_execution_time}ms</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Credits Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">{metrics.credits_remaining.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* n8n Workflows Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>n8n Quantum Workflows Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(workflow.active, workflow.success_rate)}
                  <div>
                    <h3 className="font-medium">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">
                      {workflow.executions} executions • Last run: {workflow.last_execution ? formatTimeAgo(workflow.last_execution) : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={getStatusColor(workflow.success_rate)}>
                      {workflow.success_rate}% success
                    </Badge>
                    <div className="w-24 mt-1">
                      <Progress value={workflow.success_rate} className="h-2" />
                    </div>
                  </div>
                  <Button 
                    variant={workflow.active ? "destructive" : "default"}
                    size="sm"
                  >
                    {workflow.active ? 'Stop' : 'Start'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quantum Providers Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="h-5 w-5" />
            <span>Quantum Providers Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthStatus.length > 0 ? (
              healthStatus.map((provider) => (
                <div key={provider.provider} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={`${provider.provider === 'ibm' ? 'bg-blue-100 text-blue-800' : 
                                     provider.provider === 'aws' ? 'bg-orange-100 text-orange-800' :
                                     provider.provider === 'azure' ? 'bg-purple-100 text-purple-800' :
                                     'bg-green-100 text-green-800'}`}>
                      {provider.provider.toUpperCase()}
                    </Badge>
                    {provider.up ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> : 
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Queue:</span>
                      <span>{provider.queue_length} jobs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span>{provider.ping_ms}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credits:</span>
                      <span>{provider.credits}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500 py-8">
                No quantum providers data available. Check n8n Health Check workflow.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExonovQuantumDashboard;
