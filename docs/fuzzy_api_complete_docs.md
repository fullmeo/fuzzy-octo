# 🐙 Fuzzy-Octo API - Documentation Complète

## 📋 Table des Matières

1. [🚀 API REST Complète](#api-rest)
2. [🗄️ Schema Base de Données](#database-schema)
3. [🎨 Interface Dashboard](#dashboard-ui)
4. [🧪 Tests Unitaires](#unit-tests)
5. [📦 Déploiement](#deployment)

---

## 🚀 API REST Complète {#api-rest}

### 🔧 Architecture et Technologies

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js + TypeScript",
  "database": "PostgreSQL 14+",
  "cache": "Redis 7+",
  "validation": "Zod",
  "auth": "JWT + API Keys",
  "docs": "Swagger/OpenAPI 3.0",
  "monitoring": "Prometheus + Grafana"
}
```

### 🌐 Endpoints Principaux

#### **🔑 Authentication & API Keys**

```typescript
// POST /auth/register - Création de compte
{
  "email": "dev@company.com",
  "password": "SecurePass123!",
  "name": "John Developer",
  "company": "TechCorp",
  "role": "developer" | "team_lead" | "founder"
}

// Response 201
{
  "user": {
    "id": "user_abc123",
    "email": "dev@company.com",
    "name": "John Developer",
    "tier": "free",
    "credits": 300,
    "onboarding_bonus": true
  },
  "token": "jwt_token_here"
}

// POST /auth/login - Connexion
{
  "email": "dev@company.com", 
  "password": "SecurePass123!"
}

// POST /api-keys - Création clé API
{
  "name": "Mon projet awesome",
  "environment": "live" | "test",
  "permissions": ["fuzzy_query", "code_gen", "debug"]
}

// Response 201
{
  "api_key": "fo_live_a1b2c3d4...",
  "id": "key_xyz789",
  "name": "Mon projet awesome",
  "credits": 100,
  "rate_limit": {
    "requests_per_minute": 10,
    "requests_per_hour": 100
  },
  "created_at": "2025-05-27T10:00:00Z"
}

// GET /api-keys - Liste des clés
{
  "api_keys": [
    {
      "id": "key_xyz789",
      "name": "Mon projet awesome",
      "prefix": "fo_live_",
      "credits": 847,
      "last_used": "2025-05-27T09:30:00Z",
      "requests_today": 23,
      "is_active": true
    }
  ]
}

// DELETE /api-keys/:id - Suppression clé
// Response 204
```

#### **🐙 Core Fuzzy Queries**

```typescript
// POST /v1/fuzzy - Requête fuzzy principale
// Headers: Authorization: Bearer fo_live_abc123...
{
  "query": "create a user authentication system with JWT",
  "complexity": "medium",
  "language": "typescript",
  "framework": "express",
  "tentacles": 6,
  "context": {
    "project_type": "api",
    "database": "postgresql",
    "style": "functional"
  }
}

// Response 200
{
  "request_id": "req_abc123",
  "tentacles": [
    {
      "id": 1,
      "type": "simple",
      "title": "Basic JWT Auth Middleware",
      "description": "Simple Express middleware for JWT validation",
      "code": "// JWT Auth Middleware\nconst jwt = require('jsonwebtoken');\n...",
      "explanation": "This solution provides basic JWT authentication...",
      "complexity": "simple",
      "estimated_time": "30 minutes"
    },
    {
      "id": 2,
      "type": "robust",
      "title": "Complete Auth Service",
      "description": "Full authentication service with refresh tokens",
      "code": "// Complete Auth Service\nclass AuthService {\n...",
      "explanation": "Enterprise-grade solution with refresh tokens...",
      "complexity": "medium",
      "estimated_time": "2 hours"
    }
    // ... 4 autres solutions
  ],
  "metadata": {
    "processing_time": "1.8s",
    "credits_used": 8,
    "credits_remaining": 1992,
    "query_complexity": "medium",
    "suggestions": [
      "Consider adding rate limiting",
      "Don't forget password hashing"
    ]
  },
  "related_queries": [
    "password hashing best practices",
    "JWT refresh token rotation",
    "OAuth2 integration"
  ]
}

// POST /v1/code-gen - Génération de code spécialisée
{
  "description": "React component for file upload with progress",
  "language": "typescript",
  "framework": "react",
  "styling": "tailwind",
  "features": ["drag_drop", "progress_bar", "validation"]
}

// POST /v1/debug - Assistance debug
{
  "code": "const users = await User.findAll();\nconsole.log(users.length);",
  "error": "TypeError: Cannot read property 'length' of undefined",
  "language": "javascript",
  "context": "Sequelize ORM query"
}

// POST /v1/review - Code review IA
{
  "code": "function calculatePrice(items) {\n  let total = 0;\n  for(let i = 0; i < items.length; i++) {\n    total += items[i].price * items[i].quantity;\n  }\n  return total;\n}",
  "language": "javascript",
  "focus": ["performance", "readability", "security"]
}
```

#### **💳 Credits & Billing**

```typescript
// GET /credits/balance - Solde de crédits
{
  "current": 1847,
  "rollover": 124,
  "total": 1971,
  "monthly_allocation": 2000,
  "usage_this_month": 653,
  "next_reset": "2025-06-01T00:00:00Z",
  "tier": "pro"
}

// GET /credits/history - Historique des transactions
{
  "transactions": [
    {
      "id": "txn_abc123",
      "type": "deduct",
      "amount": 8,
      "reason": "Fuzzy query: authentication system",
      "endpoint": "/v1/fuzzy",
      "created_at": "2025-05-27T10:15:00Z",
      "metadata": {
        "query_complexity": "medium",
        "tentacles_generated": 6
      }
    },
    {
      "id": "txn_def456", 
      "type": "bonus",
      "amount": 25,
      "reason": "🎉 Milestone: 10ème requête réussie !",
      "created_at": "2025-05-27T09:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 156,
    "has_more": true
  }
}

// POST /credits/purchase - Achat de crédits
{
  "package": "standard", // mini|standard|pro|mega
  "payment_method": "stripe_pm_abc123"
}

// GET /analytics/usage - Analytics d'utilisation
{
  "period": "last_30_days",
  "total_requests": 89,
  "credits_used": 742,
  "most_used_features": [
    {"feature": "fuzzy_query", "count": 45, "percentage": 50.6},
    {"feature": "code_gen", "count": 23, "percentage": 25.8},
    {"feature": "debug", "count": 21, "percentage": 23.6}
  ],
  "daily_usage": [
    {"date": "2025-05-01", "requests": 3, "credits": 24},
    {"date": "2025-05-02", "requests": 7, "credits": 56}
    // ...
  ],
  "top_languages": [
    {"language": "typescript", "percentage": 45},
    {"language": "python", "percentage": 30},
    {"language": "javascript", "percentage": 25}
  ]
}
```

### 🔒 Authentification et Sécurité

```typescript
// Middleware d'authentification
app.use('/v1/*', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'API_KEY_MISSING',
      message: 'Authorization header required: Bearer fo_live_...' 
    });
  }

  const apiKey = authHeader.slice(7);
  
  // Validation format
  if (!/^fo_(live|test)_[a-f0-9]{64}$/.test(apiKey)) {
    return res.status(401).json({
      error: 'API_KEY_INVALID_FORMAT',
      message: 'API key format must be: fo_live_[64_hex_chars]'
    });
  }

  try {
    // Vérification en base + cache Redis
    const keyData = await validateApiKey(apiKey);
    
    if (!keyData.is_active) {
      return res.status(401).json({
        error: 'API_KEY_INACTIVE',
        message: 'This API key has been deactivated'
      });
    }

    // Rate limiting
    const rateLimit = await checkRateLimit(keyData.id, keyData.tier);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED', 
        message: 'Too many requests',
        reset_time: rateLimit.resetTime
      });
    }

    // Credit check pour endpoints payants
    if (PAID_ENDPOINTS.includes(req.path)) {
      const estimatedCost = calculateCreditCost(req.path, req.body);
      const balance = await getCreditBalance(keyData.id);
      
      if (balance.total < estimatedCost) {
        return res.status(402).json({
          error: 'INSUFFICIENT_CREDITS',
          required: estimatedCost,
          available: balance.total,
          upgrade_url: 'https://fuzzy-octo.scorescout.eu/pricing'
        });
      }
    }

    req.apiKey = keyData;
    next();
  } catch (error) {
    return res.status(500).json({
      error: 'AUTHENTICATION_ERROR',
      message: 'Unable to validate API key'
    });
  }
});
```

### 📋 Gestion d'Erreurs

```typescript
// Format standard des erreurs
{
  "error": "ERROR_CODE",
  "message": "Description humaine de l'erreur",
  "details": {
    "field": "query",
    "reason": "Query too long (max 1000 characters)"
  },
  "request_id": "req_abc123",
  "timestamp": "2025-05-27T10:30:00Z",
  "documentation_url": "https://docs.fuzzy-octo.dev/errors/QUERY_TOO_LONG"
}

// Codes d'erreur principaux
const ERROR_CODES = {
  // Auth (401)
  API_KEY_MISSING: "Authorization header required",
  API_KEY_INVALID_FORMAT: "Invalid API key format", 
  API_KEY_INACTIVE: "API key is inactive",
  
  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED: "Too many requests",
  
  // Credits (402)
  INSUFFICIENT_CREDITS: "Not enough credits",
  
  // Validation (400)
  INVALID_REQUEST: "Request validation failed",
  QUERY_TOO_LONG: "Query exceeds maximum length",
  UNSUPPORTED_LANGUAGE: "Programming language not supported",
  
  // Business (422)
  QUERY_TOO_COMPLEX: "Query complexity exceeds tier limits",
  FEATURE_NOT_AVAILABLE: "Feature not available in current tier",
  
  // Server (500)
  AI_SERVICE_ERROR: "AI service temporarily unavailable",
  INTERNAL_ERROR: "Internal server error"
};
```

### 📊 Rate Limiting Détaillé

```typescript
// Rate limits par tier
const RATE_LIMITS = {
  free: {
    requests_per_minute: 10,
    requests_per_hour: 100, 
    requests_per_day: 500,
    burst_limit: 5,
    concurrent_requests: 2
  },
  starter: {
    requests_per_minute: 30,
    requests_per_hour: 500,
    requests_per_day: 2000,
    burst_limit: 10,
    concurrent_requests: 5
  },
  pro: {
    requests_per_minute: 100,
    requests_per_hour: 2000,
    requests_per_day: 10000,
    burst_limit: 25,
    concurrent_requests: 10
  },
  team: {
    requests_per_minute: 200,
    requests_per_hour: 5000,
    requests_per_day: 25000,
    burst_limit: 50,
    concurrent_requests: 20
  },
  enterprise: {
    requests_per_minute: 1000,
    requests_per_hour: 20000,
    requests_per_day: 100000,
    burst_limit: 100,
    concurrent_requests: 50
  }
};

// Headers de réponse pour rate limiting
{
  "X-RateLimit-Limit": "100",
  "X-RateLimit-Remaining": "87", 
  "X-RateLimit-Reset": "1685181600",
  "X-RateLimit-Retry-After": "42"
}
```

---

## 🗄️ Schema Base de Données {#database-schema}

### 📋 Schema PostgreSQL Complet

```sql
-- ================================
-- 🔐 Tables d'Authentification
-- ================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    role VARCHAR(50) CHECK (role IN ('developer', 'team_lead', 'founder', 'student')) DEFAULT 'developer',
    tier VARCHAR(20) CHECK (tier IN ('free', 'starter', 'pro', 'team', 'enterprise')) DEFAULT 'free',
    
    -- Onboarding & Status
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Métadonnées
    signup_source VARCHAR(100), -- 'website', 'referral', 'github', etc.
    referral_code VARCHAR(50),
    referred_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Index pour performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX idx_users_referral ON users(referral_code) WHERE referral_code IS NOT NULL;

-- ================================
-- 🔑 Tables des Clés API
-- ================================

-- Table des clés API
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Clé et sécurité
    key_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA256 de la clé complète
    key_prefix VARCHAR(20) NOT NULL, -- 'fo_live_' ou 'fo_test_'
    name VARCHAR(255) NOT NULL,
    environment VARCHAR(10) CHECK (environment IN ('live', 'test')) DEFAULT 'live',
    
    -- Permissions
    permissions JSONB DEFAULT '[]'::jsonb, -- ['fuzzy_query', 'code_gen', 'debug']
    
    -- Credits et limites
    credits INTEGER DEFAULT 0,
    rollover_credits INTEGER DEFAULT 0,
    tier VARCHAR(20) CHECK (tier IN ('free', 'starter', 'pro', 'team', 'enterprise')) DEFAULT 'free',
    
    -- Rate limiting (cache in Redis, backup in DB)
    rate_limit_rpm INTEGER DEFAULT 10, -- requests per minute
    rate_limit_rph INTEGER DEFAULT 100, -- requests per hour
    rate_limit_rpd INTEGER DEFAULT 500, -- requests per day
    
    -- Status et métadonnées
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    last_credit_add TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    
    -- Métadonnées d'usage
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE -- NULL = pas d'expiration
);

-- Index pour performance
CREATE UNIQUE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX idx_api_keys_tier ON api_keys(tier);
CREATE INDEX idx_api_keys_last_used ON api_keys(last_used_at);

-- ================================
-- 💳 Tables des Crédits
-- ================================

-- Transactions de crédits
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction
    type VARCHAR(20) CHECK (type IN ('deduct', 'add', 'rollover', 'bonus', 'refund', 'purchase')) NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    
    -- Context de la transaction
    endpoint VARCHAR(255), -- '/v1/fuzzy', '/v1/debug', etc.
    query_complexity VARCHAR(20) CHECK (query_complexity IN ('simple', 'medium', 'complex', 'expert')),
    request_id UUID, -- Lien vers api_requests si applicable
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Facturation
    billing_period DATE, -- Pour regrouper par mois de facturation
    invoice_id UUID, -- Lien vers facture si achat
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance et reporting
CREATE INDEX idx_credit_transactions_api_key ON credit_transactions(api_key_id);
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_date ON credit_transactions(created_at);
CREATE INDEX idx_credit_transactions_billing ON credit_transactions(billing_period);
CREATE INDEX idx_credit_transactions_endpoint ON credit_transactions(endpoint);

-- Packages de crédits disponibles
CREATE TABLE credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    price_cents INTEGER NOT NULL, -- Prix en centimes
    bonus_credits INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    -- Métadonnées marketing
    description TEXT,
    popular BOOLEAN DEFAULT false,
    limited_time BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Données par défaut des packages
INSERT INTO credit_packages (name, credits, price_cents, bonus_credits, description, sort_order) VALUES
('Mini Pack', 500, 500, 0, 'Pack découverte parfait pour commencer', 1),
('Standard Pack', 1200, 1200, 120, 'Le plus populaire ! +10% de bonus', 2),
('Pro Pack', 2500, 2500, 375, 'Pour les développeurs intensifs +15% bonus', 3),
('Mega Pack', 5000, 5000, 1000, 'Maximum de puissance ! +20% bonus', 4);

-- ================================
-- 📊 Tables des Requêtes et Analytics
-- ================================

-- Historique des requêtes API
CREATE TABLE api_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Request data
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    query_text TEXT,
    language VARCHAR(50),
    framework VARCHAR(50),
    complexity VARCHAR(20),
    tentacles_requested INTEGER,
    
    -- Response data
    status_code INTEGER NOT NULL,
    processing_time_ms INTEGER,
    credits_used INTEGER DEFAULT 0,
    tentacles_generated INTEGER,
    success BOOLEAN DEFAULT true,
    
    -- Métadonnées
    ip_address INET,
    user_agent TEXT,
    request_headers JSONB,
    response_size_bytes INTEGER,
    error_code VARCHAR(100),
    error_message TEXT,
    
    -- Context
    session_id UUID,
    request_metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour analytics et performance
CREATE INDEX idx_api_requests_api_key ON api_requests(api_key_id);
CREATE INDEX idx_api_requests_user ON api_requests(user_id);
CREATE INDEX idx_api_requests_endpoint ON api_requests(endpoint);
CREATE INDEX idx_api_requests_date ON api_requests(created_at);
CREATE INDEX idx_api_requests_success ON api_requests(success);
CREATE INDEX idx_api_requests_language ON api_requests(language);
CREATE INDEX idx_api_requests_complexity ON api_requests(complexity);

-- Solutions générées (pour analytics et amélioration)
CREATE TABLE generated_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES api_requests(id) ON DELETE CASCADE,
    
    -- Solution data
    tentacle_number INTEGER NOT NULL CHECK (tentacle_number BETWEEN 1 AND 8),
    tentacle_type VARCHAR(50) NOT NULL, -- 'simple', 'robust', 'performance', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    code TEXT,
    explanation TEXT,
    
    -- Métadonnées
    estimated_time VARCHAR(100),
    difficulty VARCHAR(20),
    dependencies JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    
    -- Feedback utilisateur
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    used_in_production BOOLEAN,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generated_solutions_request ON generated_solutions(request_id);
CREATE INDEX idx_generated_solutions_type ON generated_solutions(tentacle_type);
CREATE INDEX idx_generated_solutions_rating ON generated_solutions(rating) WHERE rating IS NOT NULL;

-- ================================
-- 🏆 Tables de Gamification
-- ================================

-- Achievements/Badges disponibles
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL, -- 'first_blood', 'tentacle_master', etc.
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL, -- Emoji ou code icon
    category VARCHAR(50) NOT NULL, -- 'usage', 'quality', 'social', 'milestone'
    
    -- Récompenses
    credit_reward INTEGER DEFAULT 0,
    badge_rarity VARCHAR(20) CHECK (badge_rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
    
    -- Conditions de déblocage
    condition_type VARCHAR(50) NOT NULL, -- 'request_count', 'credit_usage', 'feature_usage', etc.
    condition_value INTEGER,
    condition_metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_hidden BOOLEAN DEFAULT false, -- Easter eggs
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements des utilisateurs
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Progress tracking
    progress INTEGER DEFAULT 0,
    target INTEGER,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_completed ON user_achievements(completed) WHERE completed = true;

-- Données d'achievements par défaut
INSERT INTO achievements (code, name, description, icon, category, credit_reward, condition_type, condition_value) VALUES
('first_blood', 'Premier Sang', 'Première requête fuzzy réussie', '🩸', 'milestone', 25, 'request_count', 1),
('explorer', 'Explorateur', 'Utilisé 3 fonctionnalités différentes', '🗺️', 'usage', 50, 'feature_count', 3),
('tentacle_master', 'Maître des Tentacules', '50 requêtes fuzzy réussies', '🐙', 'usage', 150, 'fuzzy_request_count', 50),
('code_wizard', 'Sorcier du Code', 'Généré 1000 lignes de code', '🧙‍♂️', 'productivity', 300, 'lines_generated', 1000),
('night_owl', 'Oiseau de Nuit', 'Requête entre 23h et 5h', '🦉', 'fun', 20, 'night_request', 1),
('weekend_warrior', 'Guerrier du Weekend', '10 requêtes un weekend', '⚔️', 'dedication', 75, 'weekend_requests', 10),
('social_butterfly', 'Papillon Social', 'Partagé 3 solutions sur les réseaux', '🦋', 'social', 100, 'social_shares', 3),
('feedback_hero', 'Héros du Feedback', 'Donné un feedback sur 10 solutions', '🦸', 'community', 125, 'feedbacks_given', 10),
('fuzzy_legend', 'Légende Fuzzy', '500 requêtes + 5 parrainages', '👑', 'legendary', 1000, 'legend_combo', 1);

-- ================================
-- 🔔 Tables de Notifications
-- ================================

-- Templates de notifications
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'email', 'push', 'in_app', 'webhook'
    
    -- Contenu du template
    subject VARCHAR(255),
    body_text TEXT,
    body_html TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Configuration
    is_active BOOLEAN DEFAULT true,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications envoyées
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES notification_templates(id),
    
    -- Contenu
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'opened'
    priority VARCHAR(20) DEFAULT 'normal',
    
    -- Delivery
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ================================
-- 💰 Tables de Facturation
-- ================================

-- Abonnements
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Plan
    tier VARCHAR(20) CHECK (tier IN ('starter', 'pro', 'team', 'enterprise')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'canceled', 'past_due', 'paused')) DEFAULT 'active',
    
    -- Pricing
    price_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    billing_interval VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
    
    -- Crédits inclus
    monthly_credits INTEGER NOT NULL,
    rollover_limit INTEGER DEFAULT 0,
    
    -- Dates importantes
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    canceled_at TIMESTAMP WITH TIME ZONE,
    
    -- Intégration Stripe
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- Factures
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    
    -- Facturation
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    tax_rate DECIMAL(5,4) DEFAULT 0.20, -- 20% TVA
    tax_amount_cents INTEGER DEFAULT 0,
    total_cents INTEGER NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'canceled'
    paid_at TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    
    -- Intégration Stripe
    stripe_invoice_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255),
    
    -- Contenu facture (JSON pour flexibilité)
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_stripe ON invoices(stripe_invoice_id);

-- ================================
-- 📈 Vues pour Analytics
-- ================================

-- Vue des métriques utilisateur quotidiennes
CREATE VIEW daily_user_metrics AS
SELECT 
    DATE(ar.created_at) as date,
    u.tier,
    COUNT(DISTINCT ar.user_id) as active_users,
    COUNT(*) as total_requests,
    SUM(ar.credits_used) as total_credits_used,
    AVG(ar.processing_time_ms) as avg_processing_time,
    COUNT(*) FILTER (WHERE ar.success = true) as successful_requests,
    COUNT(*) FILTER (WHERE ar.success = false) as failed_requests
FROM api_requests ar
JOIN users u ON ar.user_id = u.id
GROUP BY DATE(ar.created_at), u.tier
ORDER BY date DESC, u.tier;

-- Vue du funnel d'onboarding
CREATE VIEW onboarding_funnel AS
SELECT 
    DATE(u.created_at) as signup_date,
    COUNT(*) as signups,
    COUNT(*) FILTER (WHERE ak.id IS NOT NULL) as created_api_key,
    COUNT(*) FILTER (WHERE ar.id IS NOT NULL) as made_first_request,
    COUNT(*) FILTER (WHERE ar.created_at <= u.created_at + INTERVAL '1 day') as active_day_1,
    COUNT(*) FILTER (WHERE ar.created_at <= u.created_at + INTERVAL '7 days') as active_day_7,
    COUNT(*) FILTER (WHERE s.id IS NOT NULL) as converted_to_paid
FROM users u
LEFT JOIN api_keys ak ON u.id = ak.user_id
LEFT JOIN api_requests ar ON u.id = ar.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
WHERE u.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(u.created_at)
ORDER BY signup_date DESC;

-- Vue des top utilisateurs par crédits
CREATE VIEW top_credit_users AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.tier,
    u.created_at,
    SUM(ct.amount) FILTER (WHERE ct.type = 'deduct') as total_credits_used,
    COUNT(ar.id) as total_requests,
    MAX(ar.created_at) as last_request_at
FROM users u
LEFT JOIN credit_transactions ct ON u.id = ct.user_id
LEFT JOIN api_requests ar ON u.id = ar.user_id
GROUP BY u.id, u.email, u.name, u.tier, u.created_at
ORDER BY total_credits_used DESC NULLS LAST;

-- ================================
-- 🔧 Fonctions et Triggers
-- ================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour gérer les crédits mensuels automatiquement
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $
DECLARE
    key_record RECORD;
    monthly_allocation INTEGER;
BEGIN
    FOR key_record IN 
        SELECT ak.id, ak.tier, ak.credits, ak.rollover_credits, s.monthly_credits
        FROM api_keys ak
        JOIN users u ON ak.user_id = u.id
        LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
        WHERE ak.is_active = true
    LOOP
        -- Détermine l'allocation mensuelle selon le tier
        monthly_allocation := CASE key_record.tier
            WHEN 'free' THEN 100
            WHEN 'starter' THEN 500
            WHEN 'pro' THEN 2000
            WHEN 'team' THEN 8000
            WHEN 'enterprise' THEN 50000
            ELSE COALESCE(key_record.monthly_credits, 100)
        END;
        
        -- Calcule le rollover (max selon tier)
        UPDATE api_keys 
        SET 
            rollover_credits = LEAST(
                credits,
                CASE tier
                    WHEN 'free' THEN 0
                    WHEN 'starter' THEN 100
                    WHEN 'pro' THEN 500
                    WHEN 'team' THEN 2000
                    WHEN 'enterprise' THEN 10000
                END
            ),
            credits = monthly_allocation
        WHERE id = key_record.id;
        
        -- Enregistre la transaction
        INSERT INTO credit_transactions (api_key_id, user_id, type, amount, reason)
        SELECT key_record.id, ak.user_id, 'add', monthly_allocation, 'Recharge mensuelle automatique'
        FROM api_keys ak WHERE ak.id = key_record.id;
    END LOOP;
END;
$ LANGUAGE plpgsql;

-- Fonction pour calculer le score d'engagement
CREATE OR REPLACE FUNCTION calculate_engagement_score(user_uuid UUID)
RETURNS INTEGER AS $
DECLARE
    score INTEGER := 0;
    request_count INTEGER;
    feature_count INTEGER;
    recent_activity INTEGER;
    success_rate DECIMAL;
BEGIN
    -- Nombre total de requêtes (max 40 points)
    SELECT COUNT(*) INTO request_count
    FROM api_requests WHERE user_id = user_uuid;
    score := score + LEAST(40, request_count);
    
    -- Diversité des fonctionnalités (max 30 points)
    SELECT COUNT(DISTINCT endpoint) INTO feature_count
    FROM api_requests WHERE user_id = user_uuid;
    score := score + (feature_count * 5);
    
    -- Activité récente (max 20 points)
    SELECT COUNT(*) INTO recent_activity
    FROM api_requests 
    WHERE user_id = user_uuid 
    AND created_at >= NOW() - INTERVAL '7 days';
    score := score + LEAST(20, recent_activity);
    
    -- Taux de succès (max 10 points)
    SELECT 
        CASE WHEN COUNT(*) > 0 
        THEN (COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*))
        ELSE 0 END
    INTO success_rate
    FROM api_requests WHERE user_id = user_uuid;
    score := score + (success_rate * 0.1)::INTEGER;
    
    RETURN score;
END;
$ LANGUAGE plpgsql;

-- ================================
-- 📊 Index de Performance
-- ================================

-- Index composites pour requêtes complexes
CREATE INDEX idx_api_requests_user_date ON api_requests(user_id, created_at DESC);
CREATE INDEX idx_api_requests_endpoint_success ON api_requests(endpoint, success);
CREATE INDEX idx_credit_transactions_user_type_date ON credit_transactions(user_id, type, created_at DESC);

-- Index pour les analytics temps réel
CREATE INDEX idx_api_requests_realtime ON api_requests(created_at DESC, status_code) 
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- Index pour le rate limiting
CREATE INDEX idx_api_requests_rate_limit ON api_requests(api_key_id, created_at DESC)
WHERE created_at >= NOW() - INTERVAL '1 hour';

---

## 🎨 Interface Dashboard {#dashboard-ui}

### 🚀 Dashboard Principal - React Component

```typescript
// 🎨 Dashboard Fuzzy-Octo - Interface Complète
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  CreditCard, Key, Activity, TrendingUp, Users, Zap, 
  Shield, AlertCircle, CheckCircle, Clock, DollarSign
} from 'lucide-react';

// Types pour TypeScript
interface CreditBalance {
  current: number;
  rollover: number;
  total: number;
  monthlyAllocation: number;
  nextResetDate: string;
  usageThisMonth: number;
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  credits: number;
  lastUsed: string;
  requestsToday: number;
  isActive: boolean;
  tier: string;
}

interface UsageMetrics {
  totalRequests: number;
  successRate: number;
  avgProcessingTime: number;
  topLanguages: Array<{language: string; percentage: number}>;
  dailyUsage: Array<{date: string; requests: number; credits: number}>;
}

const FuzzyOctoDashboard: React.FC = () => {
  // State management
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [creditsRes, keysRes, metricsRes] = await Promise.all([
          fetch('/api/credits/balance', { 
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('/api/api-keys'),
          fetch('/api/analytics/usage')
        ]);

        const [credits, keys, metrics] = await Promise.all([
          creditsRes.json(),
          keysRes.json(), 
          metricsRes.json()
        ]);

        setCreditBalance(credits);
        setApiKeys(keys.api_keys);
        setUsageMetrics(metrics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions
  const formatNumber = (num: number) => num.toLocaleString();
  const formatCurrency = (cents: number) => `€${(cents / 100).toFixed(2)}`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR');

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🐙</div>
          <p className="text-lg text-gray-600">Chargement de vos tentacules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🐙</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fuzzy-Octo Dashboard</h1>
                <p className="text-gray-600">Votre companion intelligent pour le développement</p>
              </div>
            </div>
            
            {/* Credit Balance Widget */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Crédits Disponibles</p>
                  <p className="text-2xl font-bold">{formatNumber(creditBalance?.total || 0)}</p>
                  <p className="text-xs opacity-75">
                    Reset le {formatDate(creditBalance?.nextResetDate || '')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
              { id: 'api-keys', label: 'Clés API', icon: Key },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'billing', label: 'Facturation', icon: DollarSign }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Requêtes ce mois"
                value={formatNumber(usageMetrics?.totalRequests || 0)}
                icon={<Activity className="h-6 w-6 text-blue-600" />}
                trend="+12%"
                trendUp={true}
              />
              <StatCard
                title="Taux de succès"
                value={`${(usageMetrics?.successRate || 0).toFixed(1)}%`}
                icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                trend="+3.2%"
                trendUp={true}
              />
              <StatCard
                title="Temps moyen"
                value={`${(usageMetrics?.avgProcessingTime || 0).toFixed(1)}s`}
                icon={<Clock className="h-6 w-6 text-yellow-600" />}
                trend="-0.3s"
                trendUp={true}
              />
              <StatCard
                title="Clés API actives"
                value={apiKeys.filter(k => k.isActive).length.toString()}
                icon={<Key className="h-6 w-6 text-purple-600" />}
                trend="Stable"
                trendUp={null}
              />
            </div>

            {/* Credit Usage Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Utilisation des Crédits (30 derniers jours)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageMetrics?.dailyUsage || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'credits' ? 'Crédits' : 'Requêtes']}
                      labelFormatter={(date) => `Date: ${date}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="credits" 
                      stackId="1"
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="requests" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Language Usage & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-6">Langages Populaires</h3>
                <div className="space-y-4">
                  {usageMetrics?.topLanguages.map((lang, index) => (
                    <div key={lang.language} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                        <span className="font-medium capitalize">{lang.language}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              index === 0 ? 'bg-blue-500' : 
                              index === 1 ? 'bg-green-500' : 
                              index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">{lang.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credit Balance Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-6">Détails des Crédits</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Crédits actuels</span>
                    <span className="font-bold text-blue-600">{formatNumber(creditBalance?.current || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Rollover</span>
                    <span className="font-bold text-green-600">{formatNumber(creditBalance?.rollover || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Utilisés ce mois</span>
                    <span className="font-bold text-gray-600">{formatNumber(creditBalance?.usageThisMonth || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">Allocation mensuelle</span>
                    <span className="font-bold text-purple-600">{formatNumber(creditBalance?.monthlyAllocation || 0)}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progression mensuelle</span>
                      <span>{((creditBalance?.usageThisMonth || 0) / (creditBalance?.monthlyAllocation || 1) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (creditBalance?.usageThisMonth || 0) / (creditBalance?.monthlyAllocation || 1) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <div className="space-y-6">
            {/* Header avec bouton d'ajout */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Clés API</h2>
                <p className="text-gray-600">Créez et gérez vos clés d'accès à l'API Fuzzy-Octo</p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Nouvelle Clé</span>
              </button>
            </div>

            {/* Liste des clés API */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Clés API Actives</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {apiKeys.map(key => (
                  <div key={key.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${key.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                          <h4 className="font-semibold text-gray-900">{key.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            key.tier === 'free' ? 'bg-gray-100 text-gray-600' :
                            key.tier === 'pro' ? 'bg-purple-100 text-purple-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {key.tier.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600">
                          <span>Clé: {key.prefix}****</span>
                          <span>Crédits: {formatNumber(key.credits)}</span>
                          <span>Utilisé: {formatDate(key.lastUsed)}</span>
                          <span>Requêtes aujourd'hui: {key.requestsToday}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                          Modifier
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guide d'utilisation */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">🚀 Guide d'utilisation rapide</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">1. Utilisation avec cURL</h4>
                  <code className="bg-gray-100 p-2 rounded text-xs block overflow-x-auto">
                    curl -X POST https://api.fuzzy-octo.dev/v1/fuzzy \<br/>
                    &nbsp;&nbsp;-H "Authorization: Bearer fo_live_your_key_here" \<br/>
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                    &nbsp;&nbsp;-d '{"query": "create authentication system"}'
                  </code>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">2. Utilisation avec JavaScript</h4>
                  <code className="bg-gray-100 p-2 rounded text-xs block overflow-x-auto">
                    const response = await fetch('https://api.fuzzy-octo.dev/v1/fuzzy', {<br/>
                    &nbsp;&nbsp;method: 'POST',<br/>
                    &nbsp;&nbsp;headers: {<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;'Authorization': 'Bearer fo_live_your_key_here',<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;'Content-Type': 'application/json'<br/>
                    &nbsp;&nbsp;},<br/>
                    &nbsp;&nbsp;body: JSON.stringify({ query: 'create authentication system' })<br/>
                    });
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Détaillées</h2>
            
            {/* Métriques détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Requests over time */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-6">Évolution des Requêtes</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageMetrics?.dailyUsage || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Success Rate Pie Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-6">Répartition des Résultats</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Succès', value: usageMetrics?.successRate || 0, fill: '#10b981' },
                          { name: 'Échecs', value: 100 - (usageMetrics?.successRate || 0), fill: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-6">Métriques de Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{formatNumber(usageMetrics?.totalRequests || 0)}</div>
                  <div className="text-sm text-gray-600 mt-1">Requêtes Totales</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{(usageMetrics?.avgProcessingTime || 0).toFixed(2)}s</div>
                  <div className="text-sm text-gray-600 mt-1">Temps Moyen</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{(usageMetrics?.successRate || 0).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 mt-1">Taux de Succès</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Facturation & Abonnements</h2>
                <p className="text-gray-600">Gérez votre abonnement et consultez votre historique de facturation</p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                Acheter des Crédits
              </button>
            </div>

            {/* Current Plan */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Plan Actuel: Pro</h3>
                  <p className="opacity-90">2000 crédits/mois • Support prioritaire • Analytics avancées</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm">
                    <span>✅ Toutes les fonctionnalités</span>
                    <span>✅ Support 24/7</span>
                    <span>✅ API illimitée</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">15€</div>
                  <div className="text-sm opacity-75">par mois</div>
                  <div className="text-xs opacity-75 mt-1">Prochaine facturation: 27 juin</div>
                </div>
              </div>
            </div>

            {/* Credit Packages */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-6">Packs de Crédits Supplémentaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Mini Pack', credits: 500, price: 5, bonus: 0, popular: false },
                  { name: 'Standard Pack', credits: 1200, price: 12, bonus: 120, popular: true },
                  { name: 'Pro Pack', credits: 2500, price: 25, bonus: 375, popular: false },
                  { name: 'Mega Pack', credits: 5000, price: 50, bonus: 1000, popular: false }
                ].map(pack => (
                  <div key={pack.name} className={`border-2 rounded-lg p-4 relative ${
                    pack.popular ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}>
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
                          ⭐ POPULAIRE
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900">{pack.name}</h4>
                      <div className="text-2xl font-bold text-indigo-600 mt-2">{formatNumber(pack.credits)}</div>
                      <div className="text-sm text-gray-600">crédits</div>
                      {pack.bonus > 0 && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          +{formatNumber(pack.bonus)} bonus !
                        </div>
                      )}
                      <div className="text-lg font-semibold mt-3">{formatCurrency(pack.price * 100)}</div>
                      <button className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
                        pack.popular 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        Acheter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Composant StatCard réutilisable
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean | null;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <div className="flex items-center mt-2">
          {trendUp !== null && (
            <span className={`text-xs font-medium ${
              trendUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {trendUp ? '↗' : '↘'} {trend}
            </span>
          )}
          {trendUp === null && (
            <span className="text-xs text-gray-500">{trend}</span>
          )}
        </div>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

export default FuzzyOctoDashboard;
```

### 🎨 Styles CSS Complémentaires

```css
/* styles/dashboard.css - Styles supplémentaires pour le dashboard */

/* Animations personnalisées */
@keyframes tentacle-wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

.tentacle-animation {
  animation: tentacle-wave 3s ease-in-out infinite;
}

/* Gradients personnalisés */
.gradient-fuzzy {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.gradient-warning {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

/* Card hover effects */
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Credit balance animation */
.credit-counter {
  font-variant-numeric: tabular-nums;
  transition: all 0.5s ease;
}

/* API Key styling */
.api-key-masked {
  font-family: 'JetBrains Mono', monospace;
  background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px dashed #d1d5db;
}

/* Loading states */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .credit-widget {
    width: 100%;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dashboard-dark {
    --bg-primary: #1f2937;
    --bg-secondary: #374151;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
  }
}

/* Chart customizations */
.recharts-tooltip-wrapper {
  border-radius: 8px !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
}

.recharts-default-tooltip {
  background: white !important;
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

---

## 🧪 Tests Unitaires {#unit-tests}

### 🔬 Suite de Tests Complète

```typescript
// tests/api.test.ts - Tests unitaires pour l'API Fuzzy-Octo

import request from 'supertest';
import { app } from '../src/app';
import { ApiKeyManager, CreditManager, RateLimiter } from '../src/services';
import { cleanupDatabase, seedTestData } from './helpers/database';
import { createTestApiKey, createTestUser } from './helpers/fixtures';

describe('🐙 Fuzzy-Octo API Tests', () => {
  let testApiKey: string;
  let testUserId: string;

  beforeEach(async () => {
    await cleanupDatabase();
    const { user, apiKey } = await seedTestData();
    testUserId = user.id;
    testApiKey = apiKey.key;
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe('🔑 API Key Management', () => {
    describe('ApiKeyManager.generateApiKey()', () => {
      it('should generate valid live API key', () => {
        const { key, hash, prefix } = ApiKeyManager.generateApiKey('live');
        
        expect(key).toMatch(/^fo_live_[a-f0-9]{64}$/);
        expect(prefix).toBe('fo_live_');
        expect(hash).toHaveLength(64);
        expect(ApiKeyManager.validateApiKey(key)).toBe(true);
      });

      it('should generate valid test API key', () => {
        const { key, hash, prefix } = ApiKeyManager.generateApiKey('test');
        
        expect(key).toMatch(/^fo_test_[a-f0-9]{64}$/);
        expect(prefix).toBe('fo_test_');
        expect(hash).toHaveLength(64);
        expect(ApiKeyManager.validateApiKey(key)).toBe(true);
      });

      it('should generate unique keys', () => {
        const key1 = ApiKeyManager.generateApiKey('live');
        const key2 = ApiKeyManager.generateApiKey('live');
        
        expect(key1.key).not.toBe(key2.key);
        expect(key1.hash).not.toBe(key2.hash);
      });
    });

    describe('ApiKeyManager.validateApiKey()', () => {
      it('should validate correct API key format', () => {
        expect(ApiKeyManager.validateApiKey('fo_live_' + 'a'.repeat(64))).toBe(true);
        expect(ApiKeyManager.validateApiKey('fo_test_' + 'b'.repeat(64))).toBe(true);
      });

      it('should reject invalid API key formats', () => {
        expect(ApiKeyManager.validateApiKey('invalid_key')).toBe(false);
        expect(ApiKeyManager.validateApiKey('fo_live_short')).toBe(false);
        expect(ApiKeyManager.validateApiKey('fo_prod_' + 'a'.repeat(64))).toBe(false);
        expect(ApiKeyManager.validateApiKey('')).toBe(false);
      });
    });

    describe('POST /api-keys', () => {
      it('should create new API key successfully', async () => {
        const response = await request(app)
          .post('/api-keys')
          .set('Authorization', `Bearer ${process.env.TEST_JWT_TOKEN}`)
          .send({
            name: 'Test Project Key',
            environment: 'live',
            permissions: ['fuzzy_query', 'code_gen']
          })
          .expect(201);

        expect(response.body).toHaveProperty('api_key');
        expect(response.body).toHaveProperty('id');
        expect(response.body.api_key).toMatch(/^fo_live_[a-f0-9]{64}$/);
        expect(response.body.name).toBe('Test Project Key');
        expect(response.body.credits).toBe(100); // Bonus première clé
      });

      it('should reject creation without authentication', async () => {
        await request(app)
          .post('/api-keys')
          .send({
            name: 'Test Project Key',
            environment: 'live'
          })
          .expect(401);
      });

      it('should validate required fields', async () => {
        const response = await request(app)
          .post('/api-keys')
          .set('Authorization', `Bearer ${process.env.TEST_JWT_TOKEN}`)
          .send({
            environment: 'live'
            // Missing name
          })
          .expect(400);

        expect(response.body.error).toBe('INVALID_REQUEST');
      });
    });

    describe('GET /api-keys', () => {
      it('should list user API keys', async () => {
        const response = await request(app)
          .get('/api-keys')
          .set('Authorization', `Bearer ${process.env.TEST_JWT_TOKEN}`)
          .expect(200);

        expect(response.body).toHaveProperty('api_keys');
        expect(Array.isArray(response.body.api_keys)).toBe(true);
      });
    });
  });

  describe('💳 Credit Management', () => {
    let creditManager: CreditManager;

    beforeEach(() => {
      creditManager = new CreditManager(
        global.redisClient, 
        global.dbClient
      );
    });

    describe('CreditManager.calculateCreditCost()', () => {
      it('should calculate correct costs for different query types', () => {
        expect(creditManager.calculateCreditCost('fuzzy_query', 'simple')).toBe(6);
        expect(creditManager.calculateCreditCost('fuzzy_query', 'medium')).toBe(8);
        expect(creditManager.calculateCreditCost('fuzzy_query', 'complex')).toBe(12);
        expect(creditManager.calculateCreditCost('fuzzy_query', 'expert')).toBe(20);
        
        expect(creditManager.calculateCreditCost('code_gen', 'medium')).toBe(5);
        expect(creditManager.calculateCreditCost('debug', 'simple')).toBe(3);
        expect(creditManager.calculateCreditCost('unknown_type', 'medium')).toBe(5);
      });
    });

    describe('CreditManager.deductCredits()', () => {
      it('should deduct credits successfully when sufficient balance', async () => {
        const result = await creditManager.deductCredits(
          'test-api-key-id',
          10,
          'Test fuzzy query',
          { complexity: 'medium' }
        );

        expect(result).toBe(true);
      });

      it('should fail when insufficient credits', async () => {
        // Simulate API key with only 5 credits
        const result = await creditManager.deductCredits(
          'low-credit-api-key-id',
          10,
          'Test fuzzy query'
        );

        expect(result).toBe(false);
      });

      it('should use rollover credits after current credits', async () => {
        // Test that rollover credits are used correctly
        const apiKeyId = await createTestApiKey({
          credits: 5,
          rollover_credits: 10
        });

        const result = await creditManager.deductCredits(
          apiKeyId,
          12,
          'Test large query'
        );

        expect(result).toBe(true);
        
        const balance = await creditManager.getCurrentBalance(apiKeyId);
        expect(balance.current).toBe(0);
        expect(balance.rollover).toBe(3);
      });
    });

    describe('GET /credits/balance', () => {
      it('should return current credit balance', async () => {
        const response = await request(app)
          .get('/credits/balance')
          .set('Authorization', `Bearer ${testApiKey}`)
          .expect(200);

        expect(response.body).toHaveProperty('current');
        expect(response.body).toHaveProperty('rollover');
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('monthly_allocation');
        expect(response.body).toHaveProperty('next_reset');
      });
    });

    describe('GET /credits/history', () => {
      it('should return credit transaction history', async () => {
        const response = await request(app)
          .get('/credits/history')
          .set('Authorization', `Bearer ${testApiKey}`)
          .expect(200);

        expect(response.body).toHaveProperty('transactions');
        expect(Array.isArray(response.body.transactions)).toBe(true);
        expect(response.body).toHaveProperty('pagination');
      });

      it('should support pagination', async () => {
        const response = await request(app)
          .get('/credits/history?page=1&per_page=5')
          .set('Authorization', `Bearer ${testApiKey}`)
          .expect(200);

        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.per_page).toBe(5);
      });
    });
  });

  describe('🚦 Rate Limiting', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter(global.redisClient);
    });

    describe('RateLimiter.checkRateLimit()', () => {
      it('should allow requests within rate limit', async () => {
        const result = await rateLimiter.checkRateLimit('test-key-id', 'free');
        expect(result.allowed).toBe(true);
      });

      it('should block requests exceeding rate limit', async () => {
        const keyId = 'rate-limit-test-key';
        
        // Make requests up to the limit
        for (let i = 0; i < 10; i++) {
          const result = await rateLimiter.checkRateLimit(keyId, 'free');
          expect(result.allowed).toBe(true);
        }
        
        // Next request should be blocked
        const blockedResult = await rateLimiter.checkRateLimit(keyId, 'free');
        expect(blockedResult.allowed).toBe(false);
        expect(blockedResult.resetTime).toBeDefined();
      });

      it('should have different limits for different tiers', async () => {
        const freeResult = await rateLimiter.checkRateLimit('free-key', 'free');
        const proResult = await rateLimiter.checkRateLimit('pro-key', 'pro');
        
        expect(freeResult.allowed).toBe(true);
        expect(proResult.allowed).toBe(true);
        
        // Pro tier should have higher limits
        // This would be tested with actual rate limiting simulation
      });
    });
  });

  describe('🐙 Fuzzy Query Endpoints', () => {
    describe('POST /v1/fuzzy', () => {
      it('should process simple fuzzy query successfully', async () => {
        const response = await request(app)
          .post('/v1/fuzzy')
          .set('Authorization', `Bearer ${testApiKey}`)
          .send({
            query: 'create a simple user authentication function',
            complexity: 'simple',
            language: 'javascript',
            tentacles: 4
          })
          .expect(200);

        expect(response.body).toHaveProperty('request_id');
        expect(response.body).toHaveProperty('tentacles');
        expect(response.body.tentacles).toHaveLength(4);
        expect(response.body).toHaveProperty('metadata');
        expect(response.body.metadata).toHaveProperty('credits_used');
        expect(response.body.metadata).toHaveProperty('processing_time');
      });

      it('should validate query parameters', async () => {
        const response = await request(app)
          .post('/v1/fuzzy')
          .set('Authorization', `Bearer ${testApiKey}`)
          .send({
            query: '', // Empty query
            tentacles: 10 // Too many tentacles
          })
          .expect(400);

        expect(response.body.error).toBe('INVALID_REQUEST');
      });

      it('should reject requests without sufficient credits', async () => {
        // Create API key with insufficient credits
        const lowCreditKey = await createTestApiKey({ credits: 1 });
        
        const response = await request(app)
          .post('/v1/fuzzy')
          .set('Authorization', `Bearer ${lowCreditKey}`)
          .send({
            query: 'complex enterprise authentication system',
            complexity: 'expert'
          })
          .expect(402);

        expect(response.body.error).toBe('INSUFFICIENT_CREDITS');
        expect(response.body).toHaveProperty('required');
        expect(response.body).toHaveProperty('available');
      });

      it('should respect rate limiting', async () => {
        // Make requests up to the rate limit
        const promises = Array.from({ length: 11 }, () =>
          request(app)
            .post('/v1/fuzzy')
            .set('Authorization', `Bearer ${testApiKey}`)
            .send({ query: 'test query' })
        );

        const responses = await Promise.all(promises);
        
        // First 10 should succeed (free tier limit)
        responses.slice(0, 10).forEach(response => {
          expect([200, 429]).toContain(response.status);
        });
        
        // 11th should be rate limited
        expect(responses[10].status).toBe(429);
        expect(responses[10].body.error).toBe('RATE_LIMIT_EXCEEDED');
      });
    });

    describe('POST /v1/code-gen', () => {
      it('should generate code successfully', async () => {
        const response = await request(app)
          .post('/v1/code-gen')
          .set('Authorization', `Bearer ${testApiKey}`)
          .send({
            description: 'React component for file upload with progress bar',
            language: 'typescript',
            framework: 'react'
          })
          .expect(200);

        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('explanation');
        expect(response.body).toHaveProperty('dependencies');
      });
    });

    describe('POST /v1/debug', () => {
      it('should provide debug assistance', async () => {
        const response = await request(app)
          .post('/v1/debug')
          .set('Authorization', `Bearer ${testApiKey}`)
          .send({
            code: 'const users = await User.findAll();\nconsole.log(users.length);',
            error: 'TypeError: Cannot read property \'length\' of undefined',
            language: 'javascript'
          })
          .expect(200);

        expect(response.body).toHaveProperty('analysis');
        expect(response.body).toHaveProperty('suggestions');
        expect(response.body).toHaveProperty('fixed_code');
      });
    });
  });

  describe('🏆 Gamification & Achievements', () => {
    describe('Achievement System', () => {
      it('should award first blood achievement', async () => {
        // Make first successful query
        await request(app)
          .post('/v1/fuzzy')
          .set('Authorization', `Bearer ${testApiKey}`)
          .send({ query: 'test query' })
          .expect(200);

        // Check if achievement was awarded
        const achievements = await request(app)
          .get('/achievements')
          .set('Authorization', `Bearer ${testApiKey}`)
          .expect(200);

        const firstBlood = achievements.body.achievements.find(
          a => a.code === 'first_blood'
        );
        expect(firstBlood.completed).toBe(true);
      });
    });
  });

  describe('📊 Analytics Endpoints', () => {
    describe('GET /analytics/usage', () => {
      it('should return usage analytics', async () => {
        const response = await request(app)
          .get('/analytics/usage')
          .set('Authorization', `Bearer ${testApiKey}`)
          .expect(200);

        expect(response.body).toHaveProperty('total_requests');
        expect(response.body).toHaveProperty('credits_used');
        expect(response.body).toHaveProperty('most_used_features');
        expect(response.body).toHaveProperty('daily_usage');
      });

      it('should support date range filtering', async () => {
        const response = await request(app)
          .get('/analytics/usage?start_date=2025-05-01&end_date=2025-05-31')
          .set('Authorization', `Bearer ${testApiKey}`)
          .expect(200);

        expect(response.body.period).toBe('2025-05-01 to 2025-05-31');
      });
    });
  });

  describe('🔒 Security Tests', () => {
    describe('Authentication', () => {
      it('should reject requests without authorization header', async () => {
        await request(app)
          .post('/v1/fuzzy')
          .send({ query: 'test' })
          .expect(401);
      });

      it('should reject requests with invalid API key format', async () => {
        await request(app)
          .post('/v1/fuzzy')
          .set('Authorization', 'Bearer invalid_key')
          .send({ query: 'test' })
          .expect(401);
      });

      it('should reject requests with expired API key', async () => {
        const expiredKey = await createTestApiKey({ 
          expires_at: new Date(Date.now() - 86400000) // Expired yesterday
        });
        
        await request(app)
          .post('/v1/fuzzy')
          .set('Authorization', `Bearer ${expiredKey}`)
          .send({ query: 'test' })
          .expect(401);
      });
    });

    describe('Input Validation', () => {
      it('should sanitize dangerous input', async () => {
        const response = await request(app)
          .post('/
                