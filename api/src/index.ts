console.log('🔍 Démarrage de l\'application...');
console.log('🔧 Chargement de la configuration...');
import './config/env';

console.log('🚀 Initialisation du serveur...');
import app from './server';
import env from './config/env';

console.log('✅ Configuration chargée avec succès');

// Ce fichier est le point d'entrée principal de l'application
// Il importe la configuration d'environnement et démarre le serveur

// Démarrer le serveur
const server = app.listen(env.PORT, () => {
  console.log(`\n🐙 Fuzzy-Octo API démarrée en mode ${env.NODE_ENV} sur le port ${env.PORT}`);
  console.log(`🔗 http://localhost:${env.PORT}\n`);
  console.log('   Endpoints disponibles:');
  console.log(`   - GET  /health`);
  console.log(`   - GET  /api/fuzzy/strategies`);
  console.log(`   - POST /api/fuzzy/query`);
  console.log('\n   🐙 Prêt à générer des solutions !');
  console.log('   ===============================================\n');
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Gestion de la fermeture propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du processus (SIGINT)');
  process.exit(0);
});
