// 🐙 Fuzzy-Octo — local development server
// For Netlify Functions, see netlify/functions/api.js
const path = require('path');
const express = require('express');
const app = require('./app');

const PORT = process.env.PORT || 3001;

// Serve React build: Docker puts it in public/, local build lands in build/
const staticDir = path.join(__dirname, '..', process.env.NODE_ENV === 'production' ? 'public' : 'build');
app.use(express.static(staticDir));

// SPA catch-all — must be last, after all API routes
app.get('*', (req, res) => {
  const index = path.join(staticDir, 'index.html');
  res.sendFile(index, (err) => {
    if (err) res.status(404).json({ error: 'Not found' });
  });
});

app.listen(PORT, () => {
  console.log(`
🐙✨ Fuzzy-Octo Smart Octopus v2.0 is awake!

   Tentacles ready: 8/8 ✅
   Brain: ${process.env.OPENAI_API_KEY ? "🧠 SMART BRAIN ONLINE" : "⚠️  Add OPENAI_API_KEY to .env"}
   Port: ${PORT} 🌊
  `);
});
