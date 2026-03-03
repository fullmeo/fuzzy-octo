'use client';

import { useState, useEffect } from 'react';

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/automation/workflows').then(r => r.json()),
      fetch('http://localhost:8000/api/automation/stats').then(r => r.json())
    ]).then(([workflowsData, statsData]) => {
      if (workflowsData.success) setWorkflows(workflowsData.workflows);
      if (statsData.success) setStats(statsData.stats);
      setLoading(false);
    }).catch(err => {
      console.error('API Error:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          ⚡ Automatisation Workflow
        </h1>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-400">{stats.totalWorkflows}</div>
              <div className="text-gray-300 text-sm">Total Workflows</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-green-400">{stats.activeWorkflows}</div>
              <div className="text-gray-300 text-sm">Actifs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-purple-400">{stats.successRate}%</div>
              <div className="text-gray-300 text-sm">Taux de Succès</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-orange-400">{stats.recentExecutions}</div>
              <div className="text-gray-300 text-sm">Dernières 24h</div>
            </div>
          </div>
        )}
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">🤖 Workflows Actifs</h2>
          
          {loading ? (
            <div className="text-white">Chargement des workflows...</div>
          ) : (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="bg-white/5 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{workflow.name}</h3>
                      <p className="text-sm text-gray-300">{workflow.description}</p>
                      <div className="text-xs text-gray-400 mt-2">
                        {workflow.executionCount} exécutions
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      workflow.active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {workflow.active ? '🟢 ACTIF' : '⏸️ INACTIF'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
