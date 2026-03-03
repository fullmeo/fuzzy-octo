'use client';

import { useState, useEffect } from 'react';

export default function ProductivityPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/productivity/tasks')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTasks(data.tasks);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🤖 Assistant IA Productivité
        </h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">📋 Tâches Intelligentes</h2>
          
          {loading ? (
            <div className="text-white">Chargement des tâches...</div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <h3 className="font-medium text-white">{task.title}</h3>
                  <div className="text-sm text-blue-200 mt-2">
                    {task.category} • {task.estimatedTime}min • Priorité: {task.priority}
                  </div>
                  {task.aiSuggested && (
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded">
                      🤖 Suggéré par IA
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-400">{tasks.length}</div>
            <div className="text-gray-300 text-sm">Tâches Actives</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-blue-400">{tasks.filter(t => t.aiSuggested).length}</div>
            <div className="text-gray-300 text-sm">Suggestions IA</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-purple-400">
              {tasks.reduce((sum, t) => sum + t.estimatedTime, 0)}min
            </div>
            <div className="text-gray-300 text-sm">Temps Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
