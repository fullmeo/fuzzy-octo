'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedTime: number;
  deadline?: string;
  completed: boolean;
  aiSuggested: boolean;
}

interface AIInsight {
  type: 'productivity' | 'optimization' | 'reminder' | 'suggestion';
  title: string;
  description: string;
  action?: string;
  impact: 'high' | 'medium' | 'low';
}

export default function ProductivityAIAssistant() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [currentFocus, setCurrentFocus] = useState<string>('');
  const [workMode, setWorkMode] = useState<'focus' | 'creative' | 'analysis' | 'planning'>('focus');
  const [aiActive, setAiActive] = useState(true);

  useEffect(() => {
    loadTasks();
    generateAIInsights();
    
    if (aiActive) {
      const interval = setInterval(() => {
        generateAIInsights();
        suggestTasks();
      }, 30000); // Actualise toutes les 30s

      return () => clearInterval(interval);
    }
  }, [aiActive, workMode]);

  const loadTasks = () => {
    // Simulation de tâches (remplacer par vraie API)
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Finaliser le dashboard analytics',
        priority: 'high',
        category: 'Development',
        estimatedTime: 120,
        deadline: '2025-05-31',
        completed: false,
        aiSuggested: false
      },
      {
        id: '2',
        title: 'Optimiser les requêtes API',
        priority: 'medium',
        category: 'Performance',
        estimatedTime: 90,
        completed: false,
        aiSuggested: true
      },
      {
        id: '3',
        title: 'Documentation Sea-Quest',
        priority: 'low',
        category: 'Documentation',
        estimatedTime: 60,
        completed: false,
        aiSuggested: false
      }
    ];
    setTasks(mockTasks);
  };

  const generateAIInsights = () => {
    const currentHour = new Date().getHours();
    const insights: AIInsight[] = [];

    // Insights basés sur l'heure
    if (currentHour >= 9 && currentHour <= 11) {
      insights.push({
        type: 'productivity',
        title: '⚡ Peak Performance Time',
        description: 'You\'re in your morning productivity zone. Perfect time for complex tasks.',
        action: 'Focus on high-priority development work',
        impact: 'high'
      });
    }

    // Insights basés sur le mode de travail
    if (workMode === 'focus') {
      insights.push({
        type: 'optimization',
        title: '🎯 Focus Mode Active',
        description: 'Consider using the Pomodoro technique (25min focus + 5min break).',
        action: 'Start a focused work session',
        impact: 'medium'
      });
    }

    // Insights sur les tâches
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed);
    if (highPriorityTasks.length > 0) {
      insights.push({
        type: 'reminder',
        title: '🚨 High Priority Tasks',
        description: `You have ${highPriorityTasks.length} high-priority tasks pending.`,
        action: 'Review and tackle the most urgent one',
        impact: 'high'
      });
    }

    // Insights sur l'équilibre
    const totalEstimatedTime = tasks.filter(t => !t.completed).reduce((sum, t) => sum + t.estimatedTime, 0);
    if (totalEstimatedTime > 480) { // Plus de 8h
      insights.push({
        type: 'suggestion',
        title: '⚖️ Workload Balance',
        description: 'Your task list seems heavy. Consider delegating or rescheduling some items.',
        action: 'Prioritize and defer non-urgent tasks',
        impact: 'medium'
      });
    }

    setInsights(insights);
  };

  const suggestTasks = () => {
    // IA suggère des tâches basées sur les patterns
    const suggestions = [
      'Review and refactor yesterday\'s code',
      'Update project documentation',
      'Check for dependency updates',
      'Backup important project files',
      'Plan tomorrow\'s priorities'
    ];

    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    // Ajouter une tâche suggérée si pas déjà présente
    if (!tasks.some(t => t.title.includes(randomSuggestion.split(' ')[0]))) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: randomSuggestion,
        priority: 'low',
        category: 'AI Suggested',
        estimatedTime: 30,
        completed: false,
        aiSuggested: true
      };
      
      setTasks(prev => [...prev, newTask]);
    }
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ));
  };

  const startFocusSession = (taskTitle: string) => {
    setCurrentFocus(taskTitle);
    // Démarrer un timer Pomodoro simulé
    setTimeout(() => {
      setCurrentFocus('');
      // Notification de fin de session
    }, 25 * 60 * 1000); // 25 minutes
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'productivity': return 'border-blue-500 bg-blue-50';
      case 'optimization': return 'border-purple-500 bg-purple-50';
      case 'reminder': return 'border-red-500 bg-red-50';
      case 'suggestion': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              🤖 AI Productivity Assistant
            </h1>
            <p className="text-gray-600 mt-2">
              Intelligent task management and productivity optimization
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">AI Assistant:</span>
              <button
                onClick={() => setAiActive(!aiActive)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  aiActive 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {aiActive ? '🟢 Active' : '⏸️ Paused'}
              </button>
            </div>
            
            <select 
              value={workMode} 
              onChange={(e) => setWorkMode(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="focus">🎯 Focus Mode</option>
              <option value="creative">🎨 Creative Mode</option>
              <option value="analysis">🔍 Analysis Mode</option>
              <option value="planning">📋 Planning Mode</option>
            </select>
          </div>
        </div>

        {/* Current Focus Session */}
        {currentFocus && (
          <div className="bg-blue-100 border border-blue-500 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  🎯 Focus Session Active
                </h3>
                <p className="text-blue-700">Working on: {currentFocus}</p>
              </div>
              <button
                onClick={() => setCurrentFocus('')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                End Session
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Insights */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              💡 AI Insights
            </h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`border-l-4 rounded-lg p-4 ${getInsightColor(insight.type)}`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <p className="text-gray-600 text-xs italic">
                      💡 {insight.action}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      insight.impact === 'high' ? 'bg-red-200 text-red-800' :
                      insight.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {insight.impact} impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Management */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                📋 Smart Task List
              </h2>
              <div className="text-sm text-gray-600">
                {tasks.filter(t => !t.completed).length} pending • 
                {tasks.filter(t => t.completed).length} completed
              </div>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border-l-4 rounded-lg p-4 ${getPriorityColor(task.priority)} ${
                    task.completed ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        {task.aiSuggested && (
                          <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full">
                            🤖 AI Suggested
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>📂 {task.category}</span>
                        <span>⏱️ {task.estimatedTime}min</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-red-200 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        {task.deadline && (
                          <span>📅 {new Date(task.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!task.completed && !currentFocus && (
                        <button
                          onClick={() => startFocusSession(task.title)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          🎯 Focus
                        </button>
                      )}
                      
                      <button
                        onClick={() => completeTask(task.id)}
                        disabled={task.completed}
                        className={`px-3 py-1 text-sm rounded ${
                          task.completed
                            ? 'bg-green-200 text-green-800'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {task.completed ? '✅' : '☐'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => !t.completed).length}
            </div>
            <div className="text-gray-600 text-sm">Active Tasks</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) || 0}%
            </div>
            <div className="text-gray-600 text-sm">Completion Rate</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-purple-600">
              {tasks.filter(t => !t.completed).reduce((sum, t) => sum + t.estimatedTime, 0)}
            </div>
            <div className="text-gray-600 text-sm">Minutes Remaining</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-2xl font-bold text-orange-600">
              {tasks.filter(t => t.aiSuggested).length}
            </div>
            <div className="text-gray-600 text-sm">AI Suggestions</div>
          </div>
        </div>
      </div>
    </div>
  );
}