import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env';
// @ts-ignore - seaquest-api-routes.ts uses CommonJS
import seaquestRouter from '../routes/seaquest-api-routes';
import fuzzyRouter from './routes/fuzzy';

const app = express();
const PORT = env.PORT;

// Middleware
app.use(helmet()); // Sécurité HTTP
app.use(cors({
  origin: env.NODE_ENV === 'production' ? 'https://votredomaine.com' : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging en mode développement
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Log des requêtes
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// Mount game and AI routers
app.use('/api/seaquest', seaquestRouter);
app.use('/api/fuzzy', fuzzyRouter);

// Health endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    nodeVersion: process.version,
    services: {
      database: '✅ Configured',
      redis: '✅ Configured',
      openai: env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'
    },
    tentacles: '🐙 8 strategies ready'
  };

  res.status(200).json(healthCheck);
});

// Routes are now handled by the mounted fuzzy router at /api/fuzzy

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    code: 404
  });
});

// Gestion des erreurs globale
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err.stack);
  
  res.status(500).json({
    status: 'error',
    message: env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
