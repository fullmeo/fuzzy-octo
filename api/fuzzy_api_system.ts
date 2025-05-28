// 🐙 Fuzzy-Octo API System - Implementation Complete
// Architecture technique pour le système d'API et gestion des crédits

import { randomBytes, createHash } from 'crypto';
import { z } from 'zod';

// ================================
// 🔑 API Key Management System
// ================================

interface ApiKey {
  id: string;
  keyHash: string;
  keyPrefix: string; // fo_live_ ou fo_test_
  userId: string;
  name: string;
  tier: SubscriptionTier;
  credits: number;
  rolloverCredits: number;
  rateLimit: RateLimit;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
}

interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
}

type SubscriptionTier = 'free' | 'starter' | 'pro' | 'team' | 'enterprise';
type Permission = 'fuzzy_query' | 'code_gen' | 'debug' | 'review' | 'docs' | 'analytics';

// ================================
// 🎯 API Key Generator
// ================================

class ApiKeyManager {
  // Génère une nouvelle clé API sécurisée
  static generateApiKey(environment: 'live' | 'test' = 'live'): { key: string; hash: string; prefix: string } {
    const prefix = environment === 'live' ? 'fo_live_' : 'fo_test_';
    const randomPart = randomBytes(32).toString('hex');
    const key = `${prefix}${randomPart}`;
    const hash = createHash('sha256').update(key).digest('hex');
    
    return { key, hash, prefix };
  }

  // Valide une clé API
  static validateApiKey(key: string): boolean {
    const keyRegex = /^fo_(live|test)_[a-f0-9]{64}$/;
    return keyRegex.test(key);
  }

  // Hash une clé pour stockage sécurisé
  static hashApiKey(key: string): string {
    return createHash('sha256').update(key).digest('hex');
  }
}

// ================================
// 💳 Credit System Implementation
// ================================

interface CreditTransaction {
  id: string;
  apiKeyId: string;
  type: 'deduct' | 'add' | 'rollover' | 'bonus';
  amount: number;
  reason: string;
  endpoint: string;
  queryComplexity?: 'simple' | 'medium' | 'complex' | 'expert';
  createdAt: Date;
  metadata: Record<string, any>;
}

interface CreditBalance {
  current: number;
  rollover: number;
  total: number;
  monthlyAllocation: number;
  nextResetDate: Date;
  usageThisMonth: number;
}

class CreditManager {
  private redisClient: any; // Redis pour rate limiting et cache
  private dbClient: any;    // Database client

  constructor(redisClient: any, dbClient: any) {
    this.redisClient = redisClient;
    this.dbClient = dbClient;
  }

  // Calcule le coût en crédits selon la complexité
  calculateCreditCost(queryType: string, complexity: string = 'medium'): number {
    const baseCosts = {
      fuzzy_query: { simple: 6, medium: 8, complex: 12, expert: 20 },
      code_gen: { simple: 4, medium: 5, complex: 8, expert: 12 },
      debug: { simple: 3, medium: 6, complex: 10, expert: 15 },
      review: { simple: 5, medium: 10, complex: 15, expert: 25 },
      docs: { simple: 2, medium: 5, complex: 8, expert: 12 },
      refactor: { simple: 8, medium: 12, complex: 18, expert: 30 }
    };

    return baseCosts[queryType]?.[complexity] || 5;
  }

  // Déduit les crédits de manière atomique
  async deductCredits(apiKeyId: string, amount: number, reason: string, metadata = {}): Promise<boolean> {
    const transaction = await this.dbClient.transaction();
    
    try {
      // Récupère le solde actuel
      const balance = await this.getCurrentBalance(apiKeyId);
      
      if (balance.total < amount) {
        await transaction.rollback();
        return false; // Solde insuffisant
      }

      // Déduit d'abord des crédits normaux, puis du rollover
      let remainingToDeduct = amount;
      let fromCurrent = Math.min(remainingToDeduct, balance.current);
      let fromRollover = remainingToDeduct - fromCurrent;

      // Met à jour le solde
      await transaction.query(`
        UPDATE api_keys 
        SET credits = credits - ?, rollover_credits = rollover_credits - ?
        WHERE id = ?
      `, [fromCurrent, fromRollover, apiKeyId]);

      // Enregistre la transaction
      await transaction.query(`
        INSERT INTO credit_transactions 
        (id, api_key_id, type, amount, reason, metadata, created_at)
        VALUES (?, ?, 'deduct', ?, ?, ?, NOW())
      `, [this.generateId(), apiKeyId, amount, reason, JSON.stringify(metadata)]);

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Ajoute des crédits (achat, bonus, etc.)
  async addCredits(apiKeyId: string, amount: number, type: 'add' | 'bonus' | 'rollover', reason: string): Promise<void> {
    await this.dbClient.query(`
      UPDATE api_keys 
      SET credits = credits + ?, last_credit_add = NOW()
      WHERE id = ?
    `, [amount, apiKeyId]);

    await this.dbClient.query(`
      INSERT INTO credit_transactions 
      (id, api_key_id, type, amount, reason, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [this.generateId(), apiKeyId, type, amount, reason]);
  }

  // Récupère le solde actuel
  async getCurrentBalance(apiKeyId: string): Promise<CreditBalance> {
    const result = await this.dbClient.query(`
      SELECT ak.credits, ak.rollover_credits, ak.tier, ak.created_at,
             COALESCE(SUM(ct.amount), 0) as usage_this_month
      FROM api_keys ak
      LEFT JOIN credit_transactions ct ON ak.id = ct.api_key_id 
        AND ct.type = 'deduct' 
        AND ct.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')
      WHERE ak.id = ?
      GROUP BY ak.id
    `, [apiKeyId]);

    const data = result[0];
    const tierAllocation = this.getTierAllocation(data.tier);
    
    return {
      current: data.credits,
      rollover: data.rollover_credits,
      total: data.credits + data.rollover_credits,
      monthlyAllocation: tierAllocation,
      nextResetDate: this.getNextResetDate(),
      usageThisMonth: data.usage_this_month
    };
  }

  private getTierAllocation(tier: SubscriptionTier): number {
    const allocations = {
      free: 100,
      starter: 500,
      pro: 2000,
      team: 8000,
      enterprise: 50000
    };
    return allocations[tier] || 100;
  }

  private getNextResetDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  private generateId(): string {
    return randomBytes(16).toString('hex');
  }
}

// ================================
// 🚦 Rate Limiting System
// ================================

class RateLimiter {
  private redisClient: any;

  constructor(redisClient: any) {
    this.redisClient = redisClient;
  }

  async checkRateLimit(apiKeyId: string, tier: SubscriptionTier): Promise<{ allowed: boolean; resetTime?: number }> {
    const limits = this.getTierLimits(tier);
    const now = Math.floor(Date.now() / 1000);
    
    // Sliding window pour les requêtes par minute
    const minuteKey = `rate_limit:${apiKeyId}:minute:${Math.floor(now / 60)}`;
    const hourKey = `rate_limit:${apiKeyId}:hour:${Math.floor(now / 3600)}`;
    
    const [minuteCount, hourCount] = await Promise.all([
      this.redisClient.incr(minuteKey),
      this.redisClient.incr(hourKey)
    ]);

    // Set expiration si c'est la première requête
    if (minuteCount === 1) {
      await this.redisClient.expire(minuteKey, 60);
    }
    if (hourCount === 1) {
      await this.redisClient.expire(hourKey, 3600);
    }

    // Vérifie les limites
    if (minuteCount > limits.requestsPerMinute) {
      return { allowed: false, resetTime: (Math.floor(now / 60) + 1) * 60 };
    }
    
    if (hourCount > limits.requestsPerHour) {
      return { allowed: false, resetTime: (Math.floor(now / 3600) + 1) * 3600 };
    }

    return { allowed: true };
  }

  private getTierLimits(tier: SubscriptionTier): RateLimit {
    const limits = {
      free: { requestsPerMinute: 10, requestsPerHour: 100, requestsPerDay: 500, burstLimit: 5 },
      starter: { requestsPerMinute: 30, requestsPerHour: 500, requestsPerDay: 2000, burstLimit: 10 },
      pro: { requestsPerMinute: 100, requestsPerHour: 2000, requestsPerDay: 10000, burstLimit: 25 },
      team: { requestsPerMinute: 200, requestsPerHour: 5000, requestsPerDay: 25000, burstLimit: 50 },
      enterprise: { requestsPerMinute: 1000, requestsPerHour: 20000, requestsPerDay: 100000, burstLimit: 100 }
    };
    return limits[tier] || limits.free;
  }
}

// ================================
// 🎁 Onboarding Généreux System
// ================================

class OnboardingManager {
  private creditManager: CreditManager;

  constructor(creditManager: CreditManager) {
    this.creditManager = creditManager;
  }

  // Bonus à la création de la première clé API
  async applyWelcomeBonus(apiKeyId: string): Promise<void> {
    await this.creditManager.addCredits(
      apiKeyId, 
      100, 
      'bonus', 
      '🎉 Bonus de bienvenue - Explorez Fuzzy-Octo !'
    );
  }

  // Bonus après X requêtes réussies
  async checkMilestoneBonus(apiKeyId: string, requestCount: number): Promise<void> {
    const milestones = [
      { count: 10, bonus: 25, message: '🚀 Première dizaine de requêtes !' },
      { count: 50, bonus: 50, message: '💎 50 requêtes réussies !' },
      { count: 100, bonus: 75, message: '🌟 Centenaire atteint !' },
      { count: 500, bonus: 100, message: '🐙 Expert Fuzzy-Octo !' }
    ];

    for (const milestone of milestones) {
      if (requestCount === milestone.count) {
        await this.creditManager.addCredits(apiKeyId, milestone.bonus, 'bonus', milestone.message);
        // Envoie notification à l'utilisateur
        await this.sendMilestoneNotification(apiKeyId, milestone);
        break;
      }
    }
  }

  // Bonus quotidien pour la première requête
  async applyDailyFirstUseBonus(apiKeyId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_bonus:${apiKeyId}:${today}`;
    
    // Vérifie si le bonus a déjà été donné aujourd'hui
    const alreadyGiven = await this.creditManager.redisClient.get(key);
    if (alreadyGiven) {
      return false;
    }

    // Donne le bonus et marque comme donné
    await this.creditManager.addCredits(apiKeyId, 2, 'bonus', '☀️ Bonus matinal - Première requête du jour !');
    await this.creditManager.redisClient.setex(key, 86400, '1'); // Expire dans 24h
    
    return true;
  }

  private async sendMilestoneNotification(apiKeyId: string, milestone: any): Promise<void> {
    // Implémentation de notification (email, webhook, etc.)
    console.log(`🎊 Milestone atteint pour ${apiKeyId}: ${milestone.message}`);
  }
}

// ================================
// 🔌 API Endpoints Implementation
// ================================

// Schémas de validation avec Zod
const FuzzyQuerySchema = z.object({
  query: z.string().min(1).max(1000),
  complexity: z.enum(['simple', 'medium', 'complex', 'expert']).optional(),
  language: z.string().optional(),
  context: z.record(z.any()).optional(),
  tentacles: z.number().min(1).max(8).default(8) // Nombre de solutions désirées
});

const ApiKeyCreateSchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.enum(['fuzzy_query', 'code_gen', 'debug', 'review', 'docs', 'analytics'])),
  environment: z.enum(['live', 'test']).default('live')
});

// Middleware d'authentification et validation
class ApiMiddleware {
  static async authenticateApiKey(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'API key manquante' });
    }

    const apiKey = authHeader.slice(7);
    if (!ApiKeyManager.validateApiKey(apiKey)) {
      return res.status(401).json({ error: 'Format de clé API invalide' });
    }

    try {
      const keyHash = ApiKeyManager.hashApiKey(apiKey);
      // Récupère les infos de la clé depuis la DB
      const keyInfo = await dbClient.query('SELECT * FROM api_keys WHERE key_hash = ? AND is_active = true', [keyHash]);
      
      if (!keyInfo.length) {
        return res.status(401).json({ error: 'Clé API invalide ou inactive' });
      }

      req.apiKey = keyInfo[0];
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Erreur d\'authentification' });
    }
  }

  static async checkCreditsAndRate(req: any, res: any, next: any) {
    const rateLimiter = new RateLimiter(redisClient);
    const creditManager = new CreditManager(redisClient, dbClient);

    // Vérifie le rate limiting
    const rateCheck = await rateLimiter.checkRateLimit(req.apiKey.id, req.apiKey.tier);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        error: 'Rate limit dépassé',
        resetTime: rateCheck.resetTime 
      });
    }

    // Vérifie le solde de crédits
    const balance = await creditManager.getCurrentBalance(req.apiKey.id);
    const estimatedCost = creditManager.calculateCreditCost(req.path, req.body.complexity);
    
    if (balance.total < estimatedCost) {
      return res.status(402).json({ 
        error: 'Crédits insuffisants',
        required: estimatedCost,
        available: balance.total,
        upgrade_url: 'https://fuzzy-octo.scorescout.eu/pricing'
      });
    }

    req.estimatedCost = estimatedCost;
    req.balance = balance;
    next();
  }
}

// ================================
// 🚀 Usage Examples
// ================================

/*
// Création d'une clé API
const newKey = ApiKeyManager.generateApiKey('live');
console.log('Nouvelle clé:', newKey.key);

// Utilisation de l'API
curl -X POST https://api.fuzzy-octo.dev/v1/fuzzy \
  -H "Authorization: Bearer fo_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "query": "create a user authentication system",
    "complexity": "medium",
    "language": "typescript",
    "tentacles": 6
  }'

// Réponse avec métadonnées de crédits
{
  "solutions": [...],
  "credits": {
    "cost": 8,
    "remaining": 1992,
    "tier": "pro"
  },
  "tentacles": 6,
  "processing_time": "1.2s"
}
*/

export {
  ApiKeyManager,
  CreditManager,
  RateLimiter,
  OnboardingManager,
  ApiMiddleware,
  FuzzyQuerySchema,
  ApiKeyCreateSchema
};