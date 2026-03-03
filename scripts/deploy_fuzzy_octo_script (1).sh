#!/bin/bash

# 🚀 Fuzzy-Octo API - Script de Déploiement Automatique
# Déploie automatiquement sur Railway (API) + Vercel (Frontend)
# Usage: ./deploy-fuzzy-octo.sh [environment]

set -e  # Exit on any error

# ================================
# 🎨 Colors and Styling
# ================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# ================================
# 🚀 Configuration
# ================================
ENVIRONMENT=${1:-production}
PROJECT_NAME="fuzzy-octo"
API_SERVICE="${PROJECT_NAME}-api"
FRONTEND_SERVICE="${PROJECT_NAME}-frontend"

# ================================
# 🐙 ASCII Art
# ================================
print_deploy_logo() {
    echo -e "${PURPLE}"
    cat << "EOF"
    
    🚀 FUZZY-OCTO DEPLOYMENT 🚀
    
     ╔══════════════════════════════════╗
     ║     Railway + Vercel Deploy      ║
     ║    Production Ready in Minutes   ║
     ╚══════════════════════════════════╝
    
EOF
    echo -e "${NC}"
}

# ================================
# 🔧 Helper Functions
# ================================
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${CYAN}🚀 $1${NC}"
}

log_deploy() {
    echo -e "${PURPLE}🌐 $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Wait for user confirmation
confirm() {
    local prompt="$1"
    echo -ne "${WHITE}$prompt (y/N): ${NC}"
    read -r response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Generate random string for database passwords
generate_password() {
    openssl rand -base64 16 2>/dev/null | tr -d "=+/" | cut -c1-16
}

# Check git status
check_git_status() {
    if [ ! -d ".git" ]; then
        log_error "Not a git repository. Please initialize git first:"
        echo "  git init"
        echo "  git add ."
        echo "  git commit -m 'Initial commit'"
        exit 1
    fi
    
    if ! git diff --quiet; then
        log_warning "You have uncommitted changes"
        if confirm "Commit changes before deployment?"; then
            git add .
            echo -ne "${WHITE}Commit message: ${NC}"
            read -r commit_message
            git commit -m "${commit_message:-Auto-commit before deployment}"
            log_success "Changes committed"
        else
            log_warning "Deploying with uncommitted changes"
        fi
    fi
}

# ================================
# 🔍 Prerequisites Check
# ================================
check_deployment_prerequisites() {
    log_step "Checking deployment prerequisites..."
    
    local missing_tools=()
    
    # Check Railway CLI
    if ! command_exists "railway"; then
        log_warning "Railway CLI not found. Installing..."
        if command_exists "npm"; then
            npm install -g @railway/cli
            log_success "Railway CLI installed"
        else
            missing_tools+=("Railway CLI (npm install -g @railway/cli)")
        fi
    else
        log_success "Railway CLI found"
    fi
    
    # Check Vercel CLI
    if ! command_exists "vercel"; then
        log_warning "Vercel CLI not found. Installing..."
        if command_exists "npm"; then
            npm install -g vercel
            log_success "Vercel CLI installed"
        else
            missing_tools+=("Vercel CLI (npm install -g vercel)")
        fi
    else
        log_success "Vercel CLI found"
    fi
    
    # Check git
    if ! command_exists "git"; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing tools: ${missing_tools[*]}"
        exit 1
    fi
    
    log_success "All deployment tools are ready!"
}

# ================================
# 🔐 Authentication Check
# ================================
check_authentication() {
    log_step "Checking authentication..."
    
    # Check Railway login
    if ! railway whoami >/dev/null 2>&1; then
        log_warning "Not logged in to Railway"
        log_info "Please login to Railway:"
        railway login
        if ! railway whoami >/dev/null 2>&1; then
            log_error "Railway authentication failed"
            exit 1
        fi
    fi
    log_success "Railway authentication OK"
    
    # Check Vercel login
    if ! vercel whoami >/dev/null 2>&1; then
        log_warning "Not logged in to Vercel"
        log_info "Please login to Vercel:"
        vercel login
        if ! vercel whoami >/dev/null 2>&1; then
            log_error "Vercel authentication failed"
            exit 1
        fi
    fi
    log_success "Vercel authentication OK"
}

# ================================
# 📝 Environment Configuration
# ================================
collect_deployment_config() {
    log_step "Collecting deployment configuration..."
    
    echo -e "${WHITE}Let's configure your production deployment!${NC}\n"
    
    # Get environment variables from .env if exists
    if [ -f ".env" ]; then
        log_info "Found .env file, reading configuration..."
        source .env
    fi
    
    # OpenAI API Key
    if [ -z "$OPENAI_API_KEY" ]; then
        echo -ne "${WHITE}OpenAI API Key ${RED}(required)${NC}: "
        read -s OPENAI_API_KEY
        echo
    fi
    
    # JWT Secret
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(openssl rand -base64 32)
        log_info "Generated JWT secret"
    fi
    
    # Database password
    DB_PASSWORD_PROD=$(generate_password)
    REDIS_PASSWORD_PROD=$(generate_password)
    
    # Domain configuration
    echo -ne "${WHITE}Custom domain for API (optional): ${NC}"
    read -r API_DOMAIN
    
    echo -ne "${WHITE}Custom domain for frontend (optional): ${NC}"
    read -r FRONTEND_DOMAIN
    
    log_success "Deployment configuration ready"
}

# ================================
# 🗄️ Database Deployment
# ================================
deploy_database() {
    log_step "Setting up production databases..."
    
    # Check if Railway project exists
    if ! railway status >/dev/null 2>&1; then
        log_info "Creating new Railway project..."
        railway init "$API_SERVICE"
    fi
    
    # Add PostgreSQL
    log_info "Adding PostgreSQL database..."
    if ! railway add postgresql --yes >/dev/null 2>&1; then
        log_warning "PostgreSQL might already exist"
    else
        log_success "PostgreSQL database added"
    fi
    
    # Add Redis
    log_info "Adding Redis cache..."
    if ! railway add redis --yes >/dev/null 2>&1; then
        log_warning "Redis might already exist"
    else
        log_success "Redis cache added"
    fi
    
    # Wait for services to be ready
    log_info "Waiting for databases to be ready..."
    sleep 10
    
    log_success "Production databases configured"
}

# ================================
# 🚀 API Deployment (Railway)
# ================================
deploy_api() {
    log_step "Deploying API to Railway..."
    
    # Set environment variables
    log_info "Setting environment variables..."
    
    railway variables set NODE_ENV=production
    railway variables set OPENAI_API_KEY="$OPENAI_API_KEY"
    railway variables set JWT_SECRET="$JWT_SECRET"
    railway variables set ENABLE_ACHIEVEMENT_SYSTEM=true
    railway variables set ENABLE_ONBOARDING_BONUSES=true
    railway variables set DEFAULT_CREDIT_ALLOCATION=300
    railway variables set MAX_TENTACLES_PER_QUERY=8
    
    # CORS origins
    local cors_origins="https://${FRONTEND_DOMAIN:-$API_SERVICE.vercel.app}"
    if [ -n "$FRONTEND_DOMAIN" ]; then
        cors_origins="$cors_origins,https://$FRONTEND_DOMAIN"
    fi
    railway variables set ALLOWED_ORIGINS="$cors_origins"
    
    # Create railway.json if it doesn't exist
    if [ ! -f "railway.json" ]; then
        cat > railway.json << EOF
{
  "build": {
    "builder": "dockerfile"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "always"
  }
}
EOF
        log_info "Created railway.json configuration"
    fi
    
    # Create optimized Dockerfile for production
    cat > Dockerfile << EOF
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci --only=development

COPY src/ ./src/
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install production dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S fuzzy -u 1001
USER fuzzy

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:\${PORT}/health || exit 1

EXPOSE 8000

CMD ["npm", "start"]
EOF
    
    # Deploy to Railway
    log_deploy "Deploying to Railway..."
    railway up --detach
    
    # Wait for deployment
    log_info "Waiting for deployment to complete..."
    sleep 30
    
    # Get the deployed URL
    local api_url
    api_url=$(railway domain 2>/dev/null || echo "https://$API_SERVICE.up.railway.app")
    
    # Test the deployment
    log_info "Testing API deployment..."
    local health_check="$api_url/health"
    local attempts=0
    local max_attempts=20
    
    while [ $attempts -lt $max_attempts ]; do
        if curl -s "$health_check" | grep -q "healthy"; then
            log_success "API deployment successful!"
            log_success "API URL: $api_url"
            break
        fi
        attempts=$((attempts + 1))
        sleep 10
        echo -n "."
    done
    
    if [ $attempts -eq $max_attempts ]; then
        log_error "API deployment verification failed"
        log_info "Check Railway logs: railway logs"
        exit 1
    fi
    
    # Setup custom domain if provided
    if [ -n "$API_DOMAIN" ]; then
        log_info "Setting up custom domain: $API_DOMAIN"
        railway domain add "$API_DOMAIN"
        log_warning "Don't forget to configure DNS for $API_DOMAIN"
    fi
    
    echo "$api_url" > .api_url
    log_success "API deployed successfully!"
}

# ================================
# 🌐 Frontend Deployment (Vercel)
# ================================
deploy_frontend() {
    log_step "Deploying Frontend to Vercel..."
    
    # Check if frontend directory exists
    local frontend_dir=""
    local possible_dirs=("frontend" "web" "client" "app" "src")
    
    for dir in "${possible_dirs[@]}"; do
        if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
            frontend_dir="$dir"
            break
        fi
    done
    
    if [ -z "$frontend_dir" ]; then
        log_warning "No frontend directory found. Creating basic Next.js frontend..."
        create_basic_frontend
        frontend_dir="frontend"
    fi
    
    cd "$frontend_dir"
    
    # Get API URL
    local api_url
    if [ -f "../.api_url" ]; then
        api_url=$(cat ../.api_url)
    else
        echo -ne "${WHITE}API URL: ${NC}"
        read -r api_url
    fi
    
    # Create vercel.json configuration
    cat > vercel.json << EOF
{
  "version": 2,
  "name": "$FRONTEND_SERVICE",
  "env": {
    "NEXT_PUBLIC_API_URL": "$api_url",
    "NEXT_PUBLIC_APP_NAME": "Fuzzy-Octo",
    "NEXT_PUBLIC_APP_VERSION": "1.0.0"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "$api_url"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF
    
    # Deploy to Vercel
    log_deploy "Deploying to Vercel..."
    
    # Deploy with production flag
    if [ "$ENVIRONMENT" = "production" ]; then
        vercel --prod --yes
    else
        vercel --yes
    fi
    
    # Get deployment URL
    local frontend_url
    frontend_url=$(vercel ls | grep "$FRONTEND_SERVICE" | head -1 | awk '{print $2}' || echo "")
    
    if [ -z "$frontend_url" ]; then
        frontend_url="https://$FRONTEND_SERVICE.vercel.app"
    fi
    
    # Setup custom domain if provided
    if [ -n "$FRONTEND_DOMAIN" ]; then
        log_info "Setting up custom domain: $FRONTEND_DOMAIN"
        vercel domains add "$FRONTEND_DOMAIN"
        frontend_url="https://$FRONTEND_DOMAIN"
        log_warning "Don't forget to configure DNS for $FRONTEND_DOMAIN"
    fi
    
    cd ..
    
    log_success "Frontend deployed successfully!"
    log_success "Frontend URL: $frontend_url"
    
    echo "$frontend_url" > .frontend_url
}

# ================================
# 🎨 Create Basic Frontend
# ================================
create_basic_frontend() {
    log_info "Creating basic Next.js frontend..."
    
    npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
    
    cd frontend
    
    # Install additional dependencies
    npm install lucide-react recharts framer-motion
    
    # Create basic fuzzy query page
    mkdir -p src/app/api
    
    cat > src/app/page.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Solution {
  id: number;
  type: string;
  title: string;
  code: string;
  explanation: string;
  confidence: number;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/fuzzy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY_HERE`
        },
        body: JSON.stringify({
          query,
          complexity: 'medium',
          tentacles: 8
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSolutions(data.tentacles || []);
      } else {
        console.error('API request failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐙 Fuzzy-Octo
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered 8-tentacle solution generator
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe what you want to build..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Generate Solutions
            </button>
          </div>
        </form>

        {solutions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{solution.explanation}</p>
                <div className="bg-gray-100 rounded p-3 mb-4">
                  <code className="text-sm text-gray-800">
                    {solution.code.substring(0, 100)}...
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">
                    {solution.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {solution.confidence}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
EOF
    
    cd ..
    log_success "Basic frontend created"
}

# ================================
# 🗄️ Database Migration
# ================================
run_database_migration() {
    log_step "Running database migration..."
    
    # Get database URL from Railway
    local db_url
    db_url=$(railway variables get DATABASE_URL 2>/dev/null || echo "")
    
    if [ -n "$db_url" ]; then
        log_info "Running schema migration..."
        
        # Create a temporary migration script
        cat > migrate.js << 'EOF'
const { Client } = require('pg');
const fs = require('fs');

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    if (fs.existsSync('src/database/schema.sql')) {
      const schema = fs.readFileSync('src/database/schema.sql', 'utf8');
      await client.query(schema);
      console.log('✅ Database schema migrated successfully');
    } else {
      console.log('⚠️  No schema file found');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

migrate();
EOF
        
        # Run migration
        DATABASE_URL="$db_url" node migrate.js
        rm migrate.js
        
        log_success "Database migration completed"
    else
        log_warning "Could not get database URL for migration"
    fi
}

# ================================
# 🧪 Post-Deployment Testing
# ================================
test_deployment() {
    log_step "Testing deployment..."
    
    # Test API
    if [ -f ".api_url" ]; then
        local api_url
        api_url=$(cat .api_url)
        
        log_info "Testing API health: $api_url/health"
        if curl -s "$api_url/health" | grep -q "healthy"; then
            log_success "✅ API is healthy"
        else
            log_warning "⚠️  API health check failed"
        fi
        
        # Test API endpoints
        log_info "Testing API endpoints..."
        local endpoints=("/" "/health")
        for endpoint in "${endpoints[@]}"; do
            local status_code
            status_code=$(curl -s -o /dev/null -w "%{http_code}" "$api_url$endpoint")
            if [ "$status_code" = "200" ]; then
                log_success "✅ $endpoint: $status_code"
            else
                log_warning "⚠️  $endpoint: $status_code"
            fi
        done
    fi
    
    # Test Frontend
    if [ -f ".frontend_url" ]; then
        local frontend_url
        frontend_url=$(cat .frontend_url)
        
        log_info "Testing frontend: $frontend_url"
        local status_code
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$frontend_url")
        if [ "$status_code" = "200" ]; then
            log_success "✅ Frontend is accessible"
        else
            log_warning "⚠️  Frontend returned: $status_code"
        fi
    fi
    
    log_success "Deployment testing completed"
}

# ================================
# 📋 Post-Deployment Setup
# ================================
show_deployment_summary() {
    echo -e "\n${GREEN}🎉 Fuzzy-Octo Deployment Complete! 🎉${NC}\n"
    
    local api_url=""
    local frontend_url=""
    
    if [ -f ".api_url" ]; then
        api_url=$(cat .api_url)
        echo -e "${WHITE}🚀 API URL:${NC} $api_url"
        echo -e "${WHITE}📚 API Health:${NC} $api_url/health"
        echo -e "${WHITE}📖 API Docs:${NC} $api_url (coming soon)"
    fi
    
    if [ -f ".frontend_url" ]; then
        frontend_url=$(cat .frontend_url)
        echo -e "${WHITE}🌐 Frontend URL:${NC} $frontend_url"
    fi
    
    echo -e "\n${CYAN}🔧 Management Commands:${NC}"
    echo -e "${YELLOW}  railway logs${NC}                    # View API logs"
    echo -e "${YELLOW}  railway status${NC}                  # Check API status"
    echo -e "${YELLOW}  vercel logs${NC}                     # View frontend logs"
    echo -e "${YELLOW}  vercel ls${NC}                       # List deployments"
    
    echo -e "\n${CYAN}📋 Next Steps:${NC}"
    echo -e "${WHITE}1.${NC} Set up monitoring and alerts"
    echo -e "${WHITE}2.${NC} Configure custom domains (if not done)"
    echo -e "${WHITE}3.${NC} Set up CI/CD pipelines"
    echo -e "${WHITE}4.${NC} Configure error tracking (Sentry)"
    echo -e "${WHITE}5.${NC} Set up analytics and metrics"
    
    echo -e "\n${CYAN}🔗 Useful Links:${NC}"
    echo -e "${WHITE}  Railway Dashboard:${NC} https://railway.app/dashboard"
    echo -e "${WHITE}  Vercel Dashboard:${NC} https://vercel.com/dashboard"
    echo -e "${WHITE}  Monitor APIs:${NC} Use the health endpoints for uptime monitoring"
    
    echo -e "\n${PURPLE}🐙 Environment Variables to Set:${NC}"
    echo -e "${WHITE}  Frontend:${NC} Add your API keys for production use"
    echo -e "${WHITE}  Monitoring:${NC} Configure Sentry DSN, analytics keys"
    echo -e "${WHITE}  Payments:${NC} Add Stripe keys when ready for billing"
    
    if [ -n "$api_url" ] && [ -n "$frontend_url" ]; then
        echo -e "\n${GREEN}🌟 Your Fuzzy-Octo is now LIVE! 🌟${NC}"
        echo -e "${GREEN}Users can start generating 8-tentacle solutions immediately!${NC}"
    fi
    
    echo -e "\n${GREEN}Happy deploying! 🚀✨${NC}\n"
}

# ================================
# 🎬 Main Execution
# ================================
main() {
    print_deploy_logo
    
    log_info "Starting Fuzzy-Octo deployment process..."
    
    # Pre-deployment checks
    check_deployment_prerequisites
    check_authentication
    check_git_status
    
    # Collect configuration
    collect_deployment_config
    
    echo -e "\n${WHITE}🚀 Ready to deploy to $ENVIRONMENT environment${NC}"
    if ! confirm "Continue with deployment?"; then
        log_info "Deployment cancelled"
        exit 0
    fi
    
    # Deploy backend (Railway)
    deploy_database
    deploy_api
    run_database_migration
    
    # Deploy frontend (Vercel) 
    deploy_frontend
    
    # Test deployment
    test_deployment
    
    # Show summary
    show_deployment_summary
    
    log_success "🐙 Fuzzy-Octo deployment completed successfully!"
}

# ================================
# 🔧 Script Options
# ================================
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [environment]"
        echo ""
        echo "Environments:"
        echo "  production  (default) - Deploy to production"
        echo "  staging                - Deploy to staging"
        echo ""
        echo "Examples:"
        echo "  $0                     # Deploy to production"
        echo "  $0 staging             # Deploy to staging"
        echo "  $0 --help              # Show this help"
        exit 0
        ;;
    --version|-v)
        echo "Fuzzy-Octo Deployment Script v1.0.0"
        exit 0
        ;;
esac

# ================================
# 🚀 Script Entry Point
# ================================
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi