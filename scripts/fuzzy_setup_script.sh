#!/bin/bash

# 🐙 Fuzzy-Octo API - Script d'Installation Automatique
# Usage: curl -sSL https://raw.githubusercontent.com/fullmeo/fuzzy-octo/main/setup-fuzzy-octo.sh | bash
# Or: chmod +x setup-fuzzy-octo.sh && ./setup-fuzzy-octo.sh

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
# 🐙 ASCII Art
# ================================
print_logo() {
    echo -e "${PURPLE}"
    cat << "EOF"
    
    🐙 FUZZY-OCTO API SETUP 🐙
    
     ╔══════════════════════════════════╗
     ║   AI-Powered 8-Tentacle System   ║
     ║      Smart Developer Solutions    ║
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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Generate random string
generate_secret() {
    openssl rand -base64 32 2>/dev/null || date | md5sum | cut -d' ' -f1
}

# Prompt for user input with default
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -ne "${WHITE}$prompt${NC}"
    if [ -n "$default" ]; then
        echo -ne " ${YELLOW}(default: $default)${NC}"
    fi
    echo -n ": "
    
    read user_input
    if [ -z "$user_input" ]; then
        user_input="$default"
    fi
    
    eval "$var_name='$user_input'"
}

# ================================
# 🔍 System Checks
# ================================
check_prerequisites() {
    log_step "Checking system prerequisites..."
    
    local missing_deps=()
    
    # Check essential commands
    if ! command_exists "curl"; then missing_deps+=("curl"); fi
    if ! command_exists "git"; then missing_deps+=("git"); fi
    if ! command_exists "node"; then missing_deps+=("node.js"); fi
    if ! command_exists "npm"; then missing_deps+=("npm"); fi
    
    # Check Docker (optional but recommended)
    if ! command_exists "docker"; then
        log_warning "Docker not found. You'll need to install PostgreSQL and Redis manually."
        USE_DOCKER=false
    else
        log_success "Docker found"
        USE_DOCKER=true
        if ! command_exists "docker-compose"; then
            log_warning "docker-compose not found. Installing..."
            # Try to install docker-compose
            if command_exists "pip"; then
                pip install docker-compose
            else
                log_error "Please install docker-compose manually"
                exit 1
            fi
        fi
    fi
    
    # Check Node.js version
    if command_exists "node"; then
        local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            log_error "Node.js 18+ required. Current version: $(node --version)"
            log_info "Please update Node.js: https://nodejs.org/"
            exit 1
        else
            log_success "Node.js $(node --version) found"
        fi
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_info "Please install them and run this script again."
        exit 1
    fi
    
    log_success "All prerequisites check passed!"
}

# ================================
# 📝 Configuration Collection
# ================================
collect_configuration() {
    log_step "Collecting configuration..."
    
    echo -e "${WHITE}Let's configure your Fuzzy-Octo API!${NC}\n"
    
    # Project directory
    prompt_with_default "Project directory" "fuzzy-octo-api" PROJECT_DIR
    
    # OpenAI API Key (required)
    while [ -z "$OPENAI_API_KEY" ]; do
        echo -ne "${WHITE}OpenAI API Key ${RED}(required)${NC}: "
        read -s OPENAI_API_KEY
        echo
        if [ -z "$OPENAI_API_KEY" ]; then
            log_error "OpenAI API Key is required!"
            log_info "Get one at: https://platform.openai.com/api-keys"
        fi
    done
    log_success "OpenAI API Key provided"
    
    # Database configuration
    if [ "$USE_DOCKER" = true ]; then
        DB_HOST="localhost"
        DB_PORT="5432"
        DB_NAME="fuzzy_octo"
        DB_USER="postgres"
        DB_PASSWORD="fuzzy123"
        REDIS_HOST="localhost"
        REDIS_PORT="6379"
        log_info "Using Docker defaults for database"
    else
        log_warning "Manual database setup required"
        prompt_with_default "PostgreSQL host" "localhost" DB_HOST
        prompt_with_default "PostgreSQL port" "5432" DB_PORT
        prompt_with_default "PostgreSQL database" "fuzzy_octo" DB_NAME
        prompt_with_default "PostgreSQL user" "postgres" DB_USER
        prompt_with_default "PostgreSQL password" "" DB_PASSWORD
        prompt_with_default "Redis host" "localhost" REDIS_HOST
        prompt_with_default "Redis port" "6379" REDIS_PORT
    fi
    
    # Server configuration
    prompt_with_default "API Port" "8000" API_PORT
    
    # Generate secrets
    JWT_SECRET=$(generate_secret)
    API_KEY_SALT=$(generate_secret)
    
    # Environment
    prompt_with_default "Environment" "development" NODE_ENV
    
    log_success "Configuration collected!"
}

# ================================
# 📂 Project Setup
# ================================
setup_project_structure() {
    log_step "Setting up project structure..."
    
    # Create project directory
    if [ -d "$PROJECT_DIR" ]; then
        log_warning "Directory $PROJECT_DIR already exists"
        echo -ne "${WHITE}Continue anyway? (y/N): ${NC}"
        read continue_setup
        if [[ ! "$continue_setup" =~ ^[Yy]$ ]]; then
            log_info "Setup cancelled"
            exit 0
        fi
    else
        mkdir -p "$PROJECT_DIR"
        log_success "Created project directory: $PROJECT_DIR"
    fi
    
    cd "$PROJECT_DIR"
    
    # Create directory structure
    local dirs=(
        "src/services"
        "src/routes" 
        "src/middleware"
        "src/types"
        "src/utils"
        "src/database"
        "tests"
        "docs"
        "scripts"
    )
    
    for dir in "${dirs[@]}"; do
        mkdir -p "$dir"
    done
    
    log_success "Project structure created"
}

# ================================
# 📦 Package Installation
# ================================
setup_package_json() {
    log_step "Setting up package.json..."
    
    # Create package.json
    cat > package.json << EOF
{
  "name": "fuzzy-octo-api",
  "version": "1.0.0",
  "description": "🐙 AI-powered 8-tentacle solution generator API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "start:prod": "NODE_ENV=production node dist/server.js",
    "test": "jest",
    "db:setup": "psql \$DATABASE_URL -f src/database/schema.sql",
    "health": "curl http://localhost:$API_PORT/health"
  },
  "keywords": ["ai", "api", "fuzzy", "octopus", "solutions"],
  "author": "Fuzzy-Octo Setup Script",
  "license": "MIT"
}
EOF
    
    log_success "package.json created"
}

install_dependencies() {
    log_step "Installing dependencies..."
    
    # Production dependencies
    local prod_deps=(
        "express@^4.18.2"
        "cors@^2.8.5"
        "helmet@^7.1.0"
        "morgan@^1.10.0"
        "dotenv@^16.3.1"
        "pg@^8.11.3"
        "ioredis@^5.3.2"
        "openai@^4.28.0"
        "jsonwebtoken@^9.0.2"
        "bcryptjs@^2.4.3"
        "zod@^3.22.4"
        "compression@^1.7.4"
    )
    
    # Development dependencies
    local dev_deps=(
        "@types/node@^20.10.6"
        "@types/express@^4.17.21"
        "@types/cors@^2.8.17"
        "@types/morgan@^1.9.9"
        "@types/pg@^8.10.9"
        "@types/jsonwebtoken@^9.0.5"
        "@types/bcryptjs@^2.4.6"
        "typescript@^5.3.3"
        "ts-node@^10.9.2"
        "nodemon@^3.0.2"
        "jest@^29.7.0"
        "@types/jest@^29.5.11"
    )
    
    log_info "Installing production dependencies..."
    npm install "${prod_deps[@]}" --save
    
    log_info "Installing development dependencies..."
    npm install "${dev_deps[@]}" --save-dev
    
    log_success "Dependencies installed"
}

# ================================
# ⚙️ Configuration Files
# ================================
create_config_files() {
    log_step "Creating configuration files..."
    
    # TypeScript config
    cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    
    # Environment file
    cat > .env << EOF
# 🐙 Fuzzy-Octo API Configuration
NODE_ENV=$NODE_ENV
PORT=$API_PORT

# Database
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# Redis
REDIS_HOST=$REDIS_HOST
REDIS_PORT=$REDIS_PORT
REDIS_URL=redis://$REDIS_HOST:$REDIS_PORT

# OpenAI
OPENAI_API_KEY=$OPENAI_API_KEY

# Security
JWT_SECRET=$JWT_SECRET
API_KEY_SALT=$API_KEY_SALT

# Features
ENABLE_ACHIEVEMENT_SYSTEM=true
ENABLE_ONBOARDING_BONUSES=true
DEFAULT_CREDIT_ALLOCATION=300
EOF
    
    # Docker Compose (if using Docker)
    if [ "$USE_DOCKER" = true ]; then
        cat > docker-compose.yml << EOF
version: '3.8'

services:
  api:
    build: .
    ports:
      - "$API_PORT:$API_PORT"
    environment:
      - NODE_ENV=$NODE_ENV
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: $DB_NAME
      POSTGRES_USER: $DB_USER
      POSTGRES_PASSWORD: $DB_PASSWORD
    ports:
      - "$DB_PORT:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "$REDIS_PORT:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF
    fi
    
    # Dockerfile
    cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE $API_PORT
CMD ["npm", "start"]
EOF
    
    # .gitignore
    cat > .gitignore << EOF
node_modules/
dist/
.env
*.log
coverage/
.DS_Store
.vscode/
.idea/
EOF
    
    log_success "Configuration files created"
}

# ================================
# 🗄️ Database Setup
# ================================
setup_database() {
    log_step "Setting up database..."
    
    if [ "$USE_DOCKER" = true ]; then
        log_info "Starting database with Docker..."
        docker-compose up -d postgres redis
        
        # Wait for postgres to be ready
        log_info "Waiting for PostgreSQL to be ready..."
        local attempts=0
        local max_attempts=30
        
        while [ $attempts -lt $max_attempts ]; do
            if docker-compose exec -T postgres pg_isready -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
                log_success "PostgreSQL is ready"
                break
            fi
            attempts=$((attempts + 1))
            sleep 2
            echo -n "."
        done
        
        if [ $attempts -eq $max_attempts ]; then
            log_error "PostgreSQL failed to start"
            exit 1
        fi
        
    else
        log_warning "Manual database setup required"
        log_info "Please ensure PostgreSQL and Redis are running"
        echo -ne "${WHITE}Continue? (y/N): ${NC}"
        read continue_db
        if [[ ! "$continue_db" =~ ^[Yy]$ ]]; then
            log_info "Database setup skipped"
            return
        fi
    fi
    
    log_success "Database setup completed"
}

# ================================
# 📁 Create Source Files
# ================================
create_core_files() {
    log_step "Creating core application files..."
    
    # Create a minimal server.ts to get started
    cat > src/server.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: '🐙 Fuzzy-Octo API is running!',
    tentacles: '8 strategies ready'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: '🐙 Fuzzy-Octo API',
    version: '1.0.0',
    description: 'AI-powered 8-tentacle solution generator',
    endpoints: {
      health: '/health',
      docs: 'Coming soon...'
    }
  });
});

app.listen(PORT, () => {
  console.log(`
🐙 ===============================================
   FUZZY-OCTO API SERVER STARTED
🐙 ===============================================
   
   🌐 Server: http://localhost:${PORT}
   📚 Health: http://localhost:${PORT}/health
   
   Environment: ${process.env.NODE_ENV}
   
   🐙 Ready to generate solutions!
   ===============================================
  `);
});

export default app;
EOF
    
    # Create a basic database schema
    cat > src/database/schema.sql << 'EOF'
-- Basic Fuzzy-Octo Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table  
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    key_hash VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INTEGER DEFAULT 300,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test data
INSERT INTO users (email, name) VALUES ('test@fuzzy-octo.dev', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT '🐙 Fuzzy-Octo database schema created successfully!' as status;
EOF
    
    log_success "Core application files created"
}

# ================================
# 🧪 Testing
# ================================
test_installation() {
    log_step "Testing installation..."
    
    # Start the application in background
    log_info "Starting application..."
    npm run dev &
    local app_pid=$!
    
    # Wait for app to start
    sleep 5
    
    # Test health endpoint
    local health_response
    if health_response=$(curl -s "http://localhost:$API_PORT/health" 2>/dev/null); then
        if echo "$health_response" | grep -q "healthy"; then
            log_success "✅ API is running and healthy!"
            echo -e "${GREEN}Response: $health_response${NC}"
        else
            log_warning "API responded but may not be fully healthy"
            echo "Response: $health_response"
        fi
    else
        log_error "Failed to connect to API"
    fi
    
    # Stop the background process
    kill $app_pid 2>/dev/null || true
    wait $app_pid 2>/dev/null || true
    
    log_success "Installation test completed"
}

# ================================
# 📋 Final Instructions
# ================================
show_next_steps() {
    echo -e "\n${GREEN}🎉 Fuzzy-Octo API Setup Complete! 🎉${NC}\n"
    
    echo -e "${WHITE}📁 Project Location:${NC} $(pwd)"
    echo -e "${WHITE}🌐 API URL:${NC} http://localhost:$API_PORT"
    echo -e "${WHITE}📚 Health Check:${NC} http://localhost:$API_PORT/health"
    
    echo -e "\n${CYAN}🚀 Quick Start Commands:${NC}"
    echo -e "${YELLOW}  cd $PROJECT_DIR${NC}"
    
    if [ "$USE_DOCKER" = true ]; then
        echo -e "${YELLOW}  docker-compose up -d${NC}  # Start services"
    fi
    
    echo -e "${YELLOW}  npm run dev${NC}           # Start development server"
    echo -e "${YELLOW}  npm test${NC}              # Run tests"
    echo -e "${YELLOW}  curl http://localhost:$API_PORT/health${NC}  # Test API"
    
    echo -e "\n${CYAN}📋 Next Steps:${NC}"
    echo -e "${WHITE}1.${NC} Complete the FuzzyEngine implementation"
    echo -e "${WHITE}2.${NC} Add authentication and API key management"
    echo -e "${WHITE}3.${NC} Implement the 8-tentacle solution system"
    echo -e "${WHITE}4.${NC} Connect your frontend and Fuzzy-Sea-Quest game"
    echo -e "${WHITE}5.${NC} Deploy to Railway/Vercel for production"
    
    echo -e "\n${PURPLE}🔗 Useful Links:${NC}"
    echo -e "${WHITE}  OpenAI API:${NC} https://platform.openai.com/api-keys"
    echo -e "${WHITE}  Railway:${NC} https://railway.app"
    echo -e "${WHITE}  Documentation:${NC} Coming soon..."
    
    echo -e "\n${GREEN}Happy coding with Fuzzy-Octo! 🐙✨${NC}\n"
}

# ================================
# 🎬 Main Execution
# ================================
main() {
    print_logo
    
    log_info "Starting Fuzzy-Octo API setup..."
    
    # System checks
    check_prerequisites
    
    # Collect user configuration
    collect_configuration
    
    # Setup project
    setup_project_structure
    setup_package_json
    install_dependencies
    create_config_files
    create_core_files
    
    # Setup database if using Docker
    if [ "$USE_DOCKER" = true ]; then
        setup_database
    fi
    
    # Test installation
    test_installation
    
    # Show final instructions
    show_next_steps
    
    log_success "🐙 Fuzzy-Octo API setup completed successfully!"
}

# ================================
# 🚀 Script Entry Point
# ================================
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi