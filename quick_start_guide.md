# 🚀 Fuzzy-Octo API - Quick Start Guide

## 🎯 **Setup Complet en 10 Minutes**

### **Prérequis**
- Node.js 18+ 
- PostgreSQL 14+ 
- Redis 7+
- Clé API OpenAI

---

## ⚡ **Option 1: Docker Setup (Recommandé)**

### **1. Clone & Setup**
```bash
# Clone your repository
git clone https://github.com/fullmeo/fuzzy-octo.git
cd fuzzy-octo/api

# Copy environment file
cp .env.example .env
```

### **2. Configure Environment**
```bash
# Edit .env file
nano .env

# Required variables:
OPENAI_API_KEY=sk-your-openai-key-here
JWT_SECRET=your-super-secret-jwt-key-long-and-random
```

### **3. Start Everything**
```bash
# Start all services (API + PostgreSQL + Redis)
make dev

# OR manually:
docker-compose --profile dev up --build
```

### **4. Verify Setup**
```bash
# Check health
curl http://localhost:8000/health

# Should return:
{
  "status": "healthy", 
  "services": {
    "database": "✅ Connected",
    "redis": "✅ Connected", 
    "openai": "✅ Configured"
  },
  "tentacles": "🐙 8 strategies ready"
}
```

---

## 🔧 **Option 2: Manual Setup**

### **1. Install Dependencies**
```bash
cd api/
npm install
```

### **2. Setup Database**
```bash
# Create PostgreSQL database
createdb fuzzy_octo

# Run schema
psql fuzzy_octo -f database/schema.sql
```

### **3. Setup Redis**
```bash
# Start Redis (varies by OS)
redis-server

# OR with Homebrew (macOS):
brew services start redis
```

### **4. Configure Environment**
```bash
# Copy and edit .env
cp .env.example .env
nano .env

# Set these variables:
DB_HOST=localhost
DB_NAME=fuzzy_octo
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-secret
```

### **5. Start API**
```bash
# Development mode
npm run dev

# Production mode
npm run build && npm start
```

---

## 🧪 **Test Your API**

### **1. Create User Account**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### **2. Create API Key**
```bash
# Use the JWT token from registration
curl -X POST http://localhost:8000/api-keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Key",
    "permissions": ["fuzzy_query"]
  }'
```

### **3. Test Fuzzy Query** 🐙
```bash
curl -X POST http://localhost:8000/v1/fuzzy \
  -H "Authorization: Bearer fo_live_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "create a simple todo app",
    "complexity": "medium",
    "language": "javascript"
  }'
```

**Expected Response:**
```json
{
  "request_id": "req_abc123",
  "tentacles": [
    {
      "id": 1,
      "type": "simple_quick",
      "title": "🏃‍♂️ Basic Todo App",
      "code": "// Simple todo implementation...",
      "explanation": "This approach creates...",
      "confidence": 85
    },
    // ... 7 more solutions
  ],
  "metadata": {
    "processing_time": "1.2s",
    "credits_used": 8,
    "credits_remaining": 292
  }
}
```

---

## 🎨 **Frontend Integration**

### **Connect Your Frontend**
```typescript
// Example React integration
const fuzzyQuery = async (query: string) => {
  const response = await fetch('http://localhost:8000/v1/fuzzy', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      query,
      complexity: 'medium',
      tentacles: 8 
    })
  });
  
  const data = await response.json();
  console.log('🐙 8 solutions generated:', data.tentacles);
  return data;
};
```

---

## 🚀 **Deployment**

### **Railway Deployment** (Recommandé)
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway up

# 3. Set environment variables
railway variables set OPENAI_API_KEY=sk-your-key
railway variables set JWT_SECRET=your-secret

# 4. Add PostgreSQL and Redis
railway add postgresql
railway add redis
```

### **Vercel Frontend Deployment**
```bash
# Deploy frontend to Vercel
vercel --prod

# Set API URL environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Value: https://your-railway-app.railway.app
```

---

## 📊 **Monitoring & Management**

### **Health Monitoring**
```bash
# API Health
curl http://localhost:8000/health

# Database status
make db-status

# Logs
make logs
```

### **Database Management**
```bash
# Backup database
make backup

# Reset database
make db-reset

# Access pgAdmin
open http://localhost:5050
```

### **Redis Management**
```bash
# Access Redis Commander  
open http://localhost:8081

# Redis CLI
docker-compose exec redis redis-cli
```

---

## 🎮 **Integration avec Fuzzy-Sea-Quest**

### **Connect Your Game**
```typescript
// In your game component
const earnCreditsFromGame = async (playerId: string, amount: number) => {
  await fetch('/v1/credits/game-reward', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ 
      player_id: playerId,
      amount,
      activity: 'puzzle_solved' // fishing, building, etc.
    })
  });
};
```

---

## 🔧 **Useful Commands**

```bash
# Development
make dev          # Start dev environment
make logs         # View logs
make test         # Run tests
make health       # Check API health

# Database
make db-setup     # Setup database
make db-reset     # Reset database  
make backup       # Backup database

# Production
make build        # Build for production
make deploy       # Deploy to production
make monitor      # Open monitoring

# Maintenance
make clean        # Clean containers
make update       # Update dependencies
make security     # Security audit
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

**❌ "Database connection failed"**
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection
psql "postgresql://postgres:fuzzy123@localhost:5432/fuzzy_octo" -c "SELECT 1;"
```

**❌ "Redis connection failed"**
```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
redis-cli ping
```

**❌ "OpenAI API error"**
```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**❌ "Port already in use"**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill

# Or change port in .env
PORT=8001
```

### **Reset Everything**
```bash
# Nuclear option - reset everything
make clean
docker system prune -a -f
make dev
```

---

## 📚 **Next Steps**

1. **📖 Read Documentation**: [API Docs](https://docs.fuzzy-octo.dev)
2. **🎮 Try the Game**: Connect Fuzzy-Sea-Quest
3. **🔌 VS Code Extension**: Install your extension 
4. **💰 Setup Billing**: Configure Stripe for payments
5. **📊 Analytics**: Setup monitoring and metrics
6. **🚀 Scale**: Move to production with Railway/Vercel

---

## 🆘 **Support**

- **📧 Email**: serignetrumpet@gmail.com
- **🐙 GitHub Issues**: [Create Issue](https://github.com/fullmeo/fuzzy-octo/issues)
- **💬 Discord**: [Join Community](https://discord.gg/fuzzy-octo)
- **📖 Documentation**: [docs.fuzzy-octo.dev](https://docs.fuzzy-octo.dev)

---

**🎉 Congratulations! Your Fuzzy-Octo API is ready to generate 8 intelligent solutions! 🐙✨**