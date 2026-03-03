'use client';

import { useState, useEffect } from 'react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  triggers: any[];
  actions: any[];
  lastExecuted: string | null;
  executionCount: number;
}

interface ExecutionHistory {
  workflowId: string;
  workflowName: string;
  timestamp: string;
  status: 'success' | 'error' | 'manual-success';
  error?: string;
  executionTime: number;
}

interface Stats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  recentExecutions: number;
  successRate: number;
  availableTriggers: string[];
  availableActions: string[];
}

export default function WorkflowManagement() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<ExecutionHistory[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [engineRunning, setEngineRunning] = useState(false);

  useEffect(() => {
    loadWorkflows();
    loadExecutions();
    loadStats();
    
    // Refresh data every 10 seconds
    const interval = setInterval(() => {
      loadWorkflows();
      loadExecutions();
      loadStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadWorkflows = async () => {
    try {
      // Simulate API call (replace with real API)
      const mockWorkflows: Workflow[] = [
        {
          id: 'wf_1',
          name: 'Daily Health Check',
          description: 'Check system health and send daily report',
          active: true,
          triggers: [{ type: 'schedule', config: { cron: '0 9 * * *' } }],
          actions: [
            { type: 'analyze', config: { type: 'system-health' } },
            { type: 'notify', config: { type: 'email' } }
          ],
          lastExecuted: new Date(Date.now() - 3600000).toISOString(),
          executionCount: 47
        },
        {
          id: 'wf_2',
          name: 'Auto Backup',
          description: 'Automatic backup of important data',
          active: true,
          triggers: [{ type: 'schedule', config: { cron: '0 2 * * *' } }],
          actions: [
            { type: 'backup', config: { source: './data/' } },
            { type: 'cleanup', config: { type: 'backups' } }
          ],
          lastExecuted: new Date(Date.now() - 7200000).toISOString(),
          executionCount: 23
        },
        {
          id: 'wf_3',
          name: 'Performance Alert',
          description: 'Alert when performance degrades',
          active: false,
          triggers: [{ type: 'performance', config: { metric: 'responseTime' } }],
          actions: [{ type: 'notify', config: { type: 'slack' } }],
          lastExecuted: null,
          executionCount: 0
        }
      ];
      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const loadExecutions = async () => {
    try {
      // Simulate execution history
      const mockExecutions: ExecutionHistory[] = [
        {
          workflowId: 'wf_1',
          workflowName: 'Daily Health Check',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          status: 'success',
          executionTime: 2340
        },
        {
          workflowId: 'wf_2',
          workflowName: 'Auto Backup',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'success',
          executionTime: 45230
        },
        {
          workflowId: 'wf_1',
          workflowName: 'Daily Health Check',
          timestamp: new Date(Date.now() - 90000000).toISOString(),
          status: 'error',
          error: 'Connection timeout',
          executionTime: 30000
        }
      ];
      setExecutions(mockExecutions);
    } catch (error) {
      console.error('Failed to load executions:', error);
    }
  };

  const loadStats = async () => {
    try {
      const mockStats: Stats = {
        totalWorkflows: 3,
        activeWorkflows: 2,
        totalExecutions: 127,
        recentExecutions: 8,
        successRate: 94.2,
        availableTriggers: ['schedule', 'file-change', 'api-response', 'performance'],
        availableActions: ['notify', 'run-tests', 'deploy', 'cleanup', 'backup', 'analyze']
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const toggleWorkflow = async (workflowId: string, active: boolean) => {
    try {
      // Simulate API call
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId ? { ...w, active } : w
      ));
      console.log(`Workflow ${workflowId} ${active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      // Simulate manual execution
      const workflow = workflows.find(w => w.id === workflowId);
      if (workflow) {
        const newExecution: ExecutionHistory = {
          workflowId,
          workflowName: workflow.name,
          timestamp: new Date().toISOString(),
          status: 'manual-success',
          executionTime: Math.floor(Math.random() * 5000) + 1000
        };
        
        setExecutions(prev => [newExecution, ...prev]);
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId 
            ? { ...w, lastExecuted: new Date().toISOString(), executionCount: w.executionCount + 1 }
            : w
        ));
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    }
  };

  const toggleEngine = async () => {
    try {
      // Simulate engine start/stop
      setEngineRunning(!engineRunning);
      console.log(`Workflow engine ${!engineRunning ? 'started' : 'stopped'}`);
    } catch (error) {
      console.error('Failed to toggle engine:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'manual-success':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              ⚡ Workflow Automation
            </h1>
            <p className="text-gray-600 mt-2">
              Intelligent task automation and workflow management
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Engine:</span>
              <button
                onClick={toggleEngine}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  engineRunning 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {engineRunning ? '🟢 Running' : '⏸️ Stopped'}
              </button>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              ➕ New Workflow
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-blue-600">{stats.totalWorkflows}</div>
              <div className="text-gray-600 text-sm">Total Workflows</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-green-600">{stats.activeWorkflows}</div>
              <div className="text-gray-600 text-sm">Active</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-purple-600">{stats.totalExecutions}</div>
              <div className="text-gray-600 text-sm">Total Executions</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-orange-600">{stats.recentExecutions}</div>
              <div className="text-gray-600 text-sm">Last 24h</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-2xl font-bold text-indigo-600">{stats.successRate.toFixed(1)}%</div>
              <div className="text-gray-600 text-sm">Success Rate</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflows List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🤖 Active Workflows
            </h2>
            
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`bg-white rounded-lg p-6 border-l-4 ${
                    workflow.active ? 'border-green-500' : 'border-gray-300'
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {workflow.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          workflow.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {workflow.active ? '🟢 Active' : '⏸️ Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {workflow.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>🔄 {workflow.executionCount} runs</span>
                        {workflow.lastExecuted && (
                          <span>⏰ {formatTimeAgo(workflow.lastExecuted)}</span>
                        )}
                        <span>
                          📋 {workflow.triggers.length} trigger(s), {workflow.actions.length} action(s)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => executeWorkflow(workflow.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        disabled={!workflow.active}
                      >
                        ▶️ Run
                      </button>
                      
                      <button
                        onClick={() => toggleWorkflow(workflow.id, !workflow.active)}
                        className={`px-3 py-1 text-sm rounded ${
                          workflow.active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {workflow.active ? '⏸️' : '▶️'}
                      </button>
                      
                      <button
                        onClick={() => setSelectedWorkflow(workflow.id)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                      >
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution History */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📊 Recent Executions
            </h2>
            
            <div className="space-y-3">
              {executions.slice(0, 10).map((execution, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {execution.workflowName}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(execution.status)
                    }`}>
                      {execution.status === 'manual-success' ? 'Manual' : execution.status}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>⏰ {formatTimeAgo(execution.timestamp)}</div>
                    <div>⚡ {formatDuration(execution.executionTime)}</div>
                    {execution.error && (
                      <div className="text-red-600">❌ {execution.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Workflow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold mb-4">Create New Workflow</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter workflow name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe what this workflow does..."
                  />
                </div>
                
                <div className="text-sm text-gray-600">
                  💡 Advanced workflow configuration will be available in the next version
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Workflow
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}