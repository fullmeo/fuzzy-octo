// @ts-ignore - Ignorer l'erreur de type pour dotenv-safe
import dotenv from 'dotenv-safe';
import * as path from 'path';

console.log('🔍 Vérification du fichier .env...');
console.log('📁 Répertoire courant:', process.cwd());
console.log('📁 Répertoire du module:', __dirname);

// Charger les variables d'environnement
const envPath = path.join(__dirname, '../../.env');
const examplePath = path.join(__dirname, '../../.env.example');

console.log('🔍 Fichier .env:', envPath);
console.log('🔍 Fichier .env.example:', examplePath);

try {
  dotenv.config({
    path: envPath,
    example: examplePath,
    allowEmptyValues: true, // Permettre les valeurs vides pour faciliter le développement
  });
  console.log('✅ Fichier .env chargé avec succès');
} catch (error) {
  console.error('❌ Erreur lors du chargement du fichier .env:', error);
  throw error;
}

interface EnvVars {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  OPENAI_API_KEY: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

const env: EnvVars = {
  NODE_ENV: (process.env.NODE_ENV || 'development') as EnvVars['NODE_ENV'],
  PORT: parseInt(process.env.PORT || '8000', 10),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_NAME: process.env.DB_NAME || 'fuzzy_octo',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

// Validation des variables critiques
const requiredVars: (keyof EnvVars)[] = [
  'OPENAI_API_KEY',
  'JWT_SECRET',
];

requiredVars.forEach((key) => {
  if (!env[key]) {
    throw new Error(`La variable d'environnement ${key} est requise mais n'est pas définie`);
  }
});

export default env;
