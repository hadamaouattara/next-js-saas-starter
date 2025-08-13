'use client';

import React, { useState, useEffect } from 'react';

// Types pour l'API quantique
interface QuantumProvider {
  provider: string;
  up: boolean;
  queue_length: number;
  ping_ms: number;
  credits: number;
}

interface PortfolioOptimization {
  tickers: string[];
  risk_tolerance: number;
  user_id: string;
  subscription_tier: 'free' | 'premium' | 'enterprise';
}

interface OptimizationResult {
  portfolio_optimization: {
    allocations: Record<string, number>;
    expected_return: number;
    risk: number;
    sharpe_ratio: number;
  };
  execution_time: number;
  provider_used: string;
  backend_used: string;
}

const ExonovQuantumDashboard: React.FC = () => {
  const [providers, setProviders] = useState<QuantumProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioResult, setPortfolioResult] = useState<OptimizationResult | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  // Configuration par défaut pour les tests
  const [portfolioConfig, setPortfolioConfig] = useState<PortfolioOptimization>({
    tickers: ['AAPL', 'GOOGL', 'MSFT'],
    risk_tolerance: 0.5,
    user_id: 'demo-user',
    subscription_tier: 'premium'
  });

  // Charger le statut des providers quantiques
  const loadQuantumHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/quantum?action=health');
      const data = await response.json();
      
      if (data.success) {
        setProviders(data.data || []);
      } else {
        setError('Erreur lors du chargement du statut quantique');
      }
    } catch (err) {
      setError('Connexion aux providers quantiques impossible');
      // Données de fallback pour demo
      setProviders([
        { provider: 'IBM Quantum', up: true, queue_length: 3, ping_ms: 245, credits: 8500 },
        { provider: 'AWS Braket', up: true, queue_length: 1, ping_ms: 180, credits: 12000 },
        { provider: 'Azure Quantum', up: false, queue_length: 0, ping_ms: 999, credits: 5500 },
        { provider: 'Google Quantum AI', up: true, queue_length: 2, ping_ms: 165, credits: 15000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Optimiser le portfolio
  const optimizePortfolio = async () => {
    try {
      setOptimizing(true);
      setError(null);

      const response = await fetch('/api/quantum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize_portfolio',
          ...portfolioConfig
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPortfolioResult(data.data);
      } else {
        setError('Erreur lors de l\'optimisation');
      }
    } catch (err) {
      setError('Optimisation échouée');
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    loadQuantumHealth();
    const interval = setInterval(loadQuantumHealth, 30000); // Refresh toutes les 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (up: boolean) => up ? 'bg-green-500' : 'bg-red-500';
  const getStatusText = (up: boolean) => up ? 'En ligne' : 'Hors ligne';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔬 Exonov Quantum Control Center
          </h1>
          <p className="text-lg text-gray-600">
            Advanced AI & Quantum Computing Platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erreur de connexion
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quantum Providers Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            📊 Statut des Providers Quantiques
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Chargement du statut...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {providers.map((provider, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{provider.provider}</h3>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(provider.up)}`}></div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Statut:</span>
                      <span className={provider.up ? 'text-green-600' : 'text-red-600'}>
                        {getStatusText(provider.up)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>File d'attente:</span>
                      <span>{provider.queue_length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latence:</span>
                      <span>{provider.ping_ms}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crédits:</span>
                      <span className="font-medium text-blue-600">
                        {provider.credits.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Optimization */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            💰 Optimisation de Portfolio QAOA
          </h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symboles (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={portfolioConfig.tickers.join(', ')}
                      onChange={(e) => setPortfolioConfig({
                        ...portfolioConfig,
                        tickers: e.target.value.split(',').map(s => s.trim())
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="AAPL, GOOGL, MSFT, AMZN"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tolérance au Risque: {portfolioConfig.risk_tolerance}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={portfolioConfig.risk_tolerance}
                      onChange={(e) => setPortfolioConfig({
                        ...portfolioConfig,
                        risk_tolerance: parseFloat(e.target.value)
                      })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Conservateur</span>
                      <span>Équilibré</span>
                      <span>Agressif</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier d'abonnement
                    </label>
                    <select
                      value={portfolioConfig.subscription_tier}
                      onChange={(e) => setPortfolioConfig({
                        ...portfolioConfig,
                        subscription_tier: e.target.value as 'free' | 'premium' | 'enterprise'
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={optimizePortfolio}
                    disabled={optimizing}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {optimizing ? '🔬 Optimisation en cours...' : '🚀 Optimiser Portfolio'}
                  </button>
                </div>
              </div>

              {/* Résultats */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Résultats</h3>
                
                {portfolioResult ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Allocations Optimales</h4>
                      <div className="space-y-2">
                        {Object.entries(portfolioResult.portfolio_optimization.allocations).map(([ticker, allocation]) => (
                          <div key={ticker} className="flex justify-between">
                            <span className="font-medium">{ticker}:</span>
                            <span className="text-blue-600">{(allocation * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm text-green-600">Rendement Attendu</div>
                        <div className="text-lg font-semibold text-green-800">
                          {(portfolioResult.portfolio_optimization.expected_return * 100).toFixed(2)}%
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-600">Ratio de Sharpe</div>
                        <div className="text-lg font-semibold text-blue-800">
                          {portfolioResult.portfolio_optimization.sharpe_ratio.toFixed(3)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div>Temps d'exécution: {portfolioResult.execution_time}s</div>
                      <div>Provider: {portfolioResult.provider_used}</div>
                      <div>Backend: {portfolioResult.backend_used}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Cliquez sur "Optimiser Portfolio" pour voir les résultats</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            ⚡ Actions Rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={loadQuantumHealth}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-medium">Actualiser Status</div>
              <div className="text-sm text-gray-600">Refresh providers</div>
            </button>
            
            <button
              onClick={() => window.open('/api/quantum?action=health', '_blank')}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-2">🔗</div>
              <div className="font-medium">Test API</div>
              <div className="text-sm text-gray-600">Vérifier connexion</div>
            </button>
            
            <button
              onClick={() => alert('Feature à venir: Monitoring avancé')}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-gray-600">Métriques détaillées</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>🚀 Exonov Quantum - Powered by n8n Workflows & Next.js</p>
          <p>© 2025 - Advanced AI & Quantum Computing Platform</p>
        </div>
      </div>
    </div>
  );
};

export default ExonovQuantumDashboard;
