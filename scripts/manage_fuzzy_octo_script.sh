#!/bin/bash

# 🛠️ Fuzzy-Octo API - Script de Maintenance et Monitoring
# Usage: ./manage-fuzzy-octo.sh [command] [options]

set -e

# ================================
# 🎨 Colors
# ================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# ================================
# 🔧 Helper Functions
# ================================
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_step() { echo -e "${CYAN}🔧 $1${NC}"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

# ================================
# 📊 Health Check Functions
# ================================
check_api_health() {
    log_step "Checking API health..."
    
    local api_url="${1:-http://localhost:8000}"
    local health_endpoint="$api_url/health"
    
    echo -e "${WHITE}Testing: $health_endpoint${NC}"
    
    local response
    local status_code
    
    if response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$health_endpoint" 2>/dev/null); then
        status_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
        response_body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]*$//')
        
        if [ "$status_code" -eq 200 ]; then
            log_success "API is healthy (HTTP $status_code)"
            
            # Parse response for detailed health info
            if echo "$response_body" | jq -e '.services' > /dev/null 2>&1; then
                echo -e "${CYAN}Service Status:${NC}"
                echo "$response_body" | jq -r '.services | to_entries[] | "  \(.key): \(.value)"'
                
                local tentacles=$(echo "$response_body" | jq -r '.tentacles // "Unknown"')
                echo -e "  ${PURPLE}🐙 $tentacles${NC}"
            fi
        else
            log_error "API health check failed (HTTP $status_code)"
            echo "$response_body"
            return 1
        fi
    else
        log_error "Could not connect to API"
        return 1
    fi
}

check_database_health() {
    log_step "Checking database health..."
    
    if [ -f ".env" ]; then
        source .env
    fi
    
    local db_url="${DATABASE_URL:-postgresql://postgres:password@localhost:5432/fuzzy_octo}"
    
    if command_exists psql; then
        local query="SELECT 
            current_database() as database,
            current_user as user,
            version() as version,
            now() as timestamp;"
            
        if psql "$db_url" -c "$query" 2>/dev/null; then
            log_success "Database connection successful"
            
            # Check table counts
            local table_count
            table_count=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
            echo -e "  Tables: ${WHITE}$table_count${NC}"
            
            # Check recent activity
            local recent_requests
            recent_requests=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM api_requests WHERE created_at >= NOW() - INTERVAL '1 hour';" 2>/dev/null | tr -d ' ')
            echo -e "  Requests (1h): ${WHITE}$recent_requests${NC}"
        else
            log_error "Database connection failed"
            return 1
        fi
    else
        log_warning "psql not found, skipping database check"
    fi
}

check_redis_health() {
    log_step "Checking Redis health..."
    
    local redis_host="${REDIS_HOST:-localhost}"
    local redis_port="${REDIS_PORT:-6379}"
    
    if command_exists redis-cli; then
        if redis-cli -h "$redis_host" -p "$redis_port" ping > /dev/null 2>&1; then
            log_success "Redis connection successful"
            
            # Get Redis info
            local memory_used
            memory_used=$(redis-cli -h "$redis_host" -p "$redis_port" info memory | grep "used_memory_human" | cut -d: -f2 | tr -d '\r')
            echo -e "  Memory used: ${WHITE}$memory_used${NC}"
            
            local keys_count
            keys_count=$(redis-cli -h "$redis_host" -p "$redis_port" dbsize)
            echo -e "  Keys: ${WHITE}$keys_count${NC}"
        else
            log_error "Redis connection failed"
            return 1
        fi
    else
        log_warning "redis-cli not found, skipping Redis check"
    fi
}

# ================================
# 📊 Analytics Functions
# ================================
show_usage_stats() {
    log_step "Fetching usage statistics..."
    
    if [ -f ".env" ]; then
        source .env
    fi
    
    local db_url="${DATABASE_URL:-postgresql://postgres:password@localhost:5432/fuzzy_octo}"
    
    if ! command_exists psql; then
        log_error "psql not found"
        return 1
    fi
    
    echo -e "${WHITE}📊 Usage Statistics (Last 24 Hours)${NC}\n"
    
    # Total requests
    local total_requests
    total_requests=$(psql "$db_url" -t -c "
        SELECT COUNT(*) FROM api_requests 
        WHERE created_at >= NOW() - INTERVAL '24 hours';" 2>/dev/null | tr -d ' ')
    echo -e "Total Requests: ${GREEN}$total_requests${NC}"
    
    # Success rate
    local success_rate
    success_rate=$(psql "$db_url" -t -c "
        SELECT ROUND(
            (COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*)), 1
        ) FROM api_requests 
        WHERE created_at >= NOW() - INTERVAL '24 hours';" 2>/dev/null | tr -d ' ')
    echo -e "Success Rate: ${GREEN}$success_rate%${NC}"
    
    # Active users
    local active_users
    active_users=$(psql "$db_url" -t -c "
        SELECT COUNT(DISTINCT user_id) FROM api_requests 
        WHERE created_at >= NOW() - INTERVAL '24 hours';" 2>/dev/null | tr -d ' ')
    echo -e "Active Users: ${GREEN}$active_users${NC}"
    
    # Credits consumed
    local credits_used
    credits_used=$(psql "$db_url" -t -c "
        SELECT COALESCE(SUM(amount), 0) FROM credit_transactions 
        WHERE type = 'deduct' AND created_at >= NOW() - INTERVAL '24 hours';" 2>/dev/null | tr -d ' ')
    echo -e "Credits Used: ${GREEN}$credits_used${NC}"
    
    echo -e "\n${WHITE}🔥 Top Endpoints (24h)${NC}"
    psql "$db_url" -c "
        SELECT 
            endpoint,
            COUNT(*) as requests,
            ROUND(AVG(processing_time_ms), 1) as avg_time_ms
        FROM api_requests 
        WHERE created_at >= NOW() - INTERVAL '24 hours'
        GROUP BY endpoint 
        ORDER BY requests DESC 
        LIMIT 5;" 2>/dev/null || echo "Could not fetch endpoint stats"
    
    echo -e "\n${WHITE}📈 Hourly Request Distribution${NC}"
    psql "$db_url" -c "
        SELECT 
            EXTRACT(hour FROM created_at) as hour,
            COUNT(*) as requests
        FROM api_requests 
        WHERE created_at >= NOW() - INTERVAL '24 hours'
        GROUP BY EXTRACT(hour FROM created_at) 
        ORDER BY hour;" 2>/dev/null || echo "Could not fetch hourly stats"
}

show_user_stats() {
    log_step "Fetching user statistics..."
    
    if [ -f ".env" ]; then
        source .env
    fi
    
    local db_url="${DATABASE_URL:-postgresql://postgres:password@localhost:5432/fuzzy_octo}"
    
    echo -e "${WHITE}👥 User Statistics${NC}\n"
    
    # Total users
    local total_users
    total_users=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
    echo -e "Total Users: ${GREEN}$total_users${NC}"
    
    # Active users (7 days)
    local active_7d
    active_7d=$(psql "$db_url" -t -c "
        SELECT COUNT(DISTINCT u.id) FROM users u
        JOIN api_requests ar ON u.id = ar.user_id
        WHERE ar.created_at >= NOW() - INTERVAL '7 days';" 2>/dev/null | tr -d ' ')
    echo -e "Active Users (7d): ${GREEN}$active_7d${NC}"
    
    # User distribution by tier
    echo -e "\n${WHITE}📊 Users by Tier${NC}"
    psql "$db_url" -c "
        SELECT tier, COUNT(*) as users 
        FROM users 
        GROUP BY tier 
        ORDER BY users DESC;" 2>/dev/null || echo "Could not fetch tier stats"
    
    # Top users by activity
    echo -e "\n${WHITE}🏆 Most Active Users (7d)${NC}"
    psql "$db_url" -c "
        SELECT 
            u.name,
            u.tier,
            COUNT(ar.id) as requests,
            SUM(ar.credits_used) as credits_used
        FROM users u
        JOIN api_requests ar ON u.id = ar.user_id
        WHERE ar.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY u.id, u.name, u.tier
        ORDER BY requests DESC
        LIMIT 10;" 2>/dev/null || echo "Could not fetch user activity stats"
}

# ================================
# 🔧 Maintenance Functions
# ================================
backup_database() {
    log_step "Creating database backup..."
    
    if [ -f ".env" ]; then
        source .env
    fi
    
    local db_url="${DATABASE_URL:-postgresql://postgres:password@localhost:5432/fuzzy_octo}"
    local backup_dir="backups"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_dir/fuzzy_octo_backup_$timestamp.sql"
    
    mkdir -p "$backup_dir"
    
    if command_exists pg_dump; then
        log_info "Creating backup: $backup_file"
        
        if pg_dump "$db_url" > "$backup_file"; then
            log_success "Backup created successfully"
            
            # Compress backup
            if command_exists gzip; then
                gzip "$backup_file"
                backup_file="$backup_file.gz"
                log_info "Backup compressed: $backup_file"
            fi
            
            # Show backup size
            local size
            size=$(du -h "$backup_file" | cut -f1)
            echo -e "Backup size: ${WHITE}$size${NC}"
            
            # Cleanup old backups (keep last 5)
            local backup_count
            backup_count=$(find "$backup_dir" -name "fuzzy_octo_backup_*.sql*" | wc -l)
            if [ "$backup_count" -gt 5 ]; then
                log_info "Cleaning up old backups..."
                find "$backup_dir" -name "fuzzy_octo_backup_*.sql*" -type f | sort | head -n -5 | xargs rm -f
                log_success "Old backups cleaned up"
            fi
        else
            log_error "Backup failed"
            return 1
        fi
    else
        log_error "pg_dump not found"
        return 1
    fi
}

cleanup_logs() {
    log_step "Cleaning up old logs..."
    
    local log_dirs=("logs" "node_modules/.cache" "coverage" "dist")
    local cleaned=0
    
    for dir in "${log_dirs[@]}"; do
        if [ -d "$dir" ]; then
            local size_before
            size_before=$(du -sm "$dir" 2>/dev/null | cut -f1 || echo "0")
            
            case "$dir" in
                "logs")
                    find "$dir" -name "*.log" -mtime +7 -delete 2>/dev/null || true
                    ;;
                "node_modules/.cache")
                    rm -rf "$dir" 2>/dev/null || true
                    ;;
                "coverage")
                    find "$dir" -type f -mtime +30 -delete 2>/dev/null || true
                    ;;
                "dist")
                    # Keep dist but clean old builds
                    find "$dir" -name "*.map" -mtime +7 -delete 2>/dev/null || true
                    ;;
            esac
            
            local size_after
            size_after=$(du -sm "$dir" 2>/dev/null | cut -f1 || echo "0")
            local saved=$((size_before - size_after))
            
            if [ $saved -gt 0 ]; then
                echo -e "  $dir: freed ${GREEN}${saved}MB${NC}"
                cleaned=$((cleaned + saved))
            fi
        fi
    done
    
    if [ $cleaned -gt 0 ]; then
        log_success "Cleaned up ${cleaned}MB total"
    else
        log_info "No cleanup needed"
    fi
}

reset_rate_limits() {
    log_step "Resetting rate limits..."
    
    local redis_host="${REDIS_HOST:-localhost}"
    local redis_port="${REDIS_PORT:-6379}"
    
    if command_exists redis-cli; then
        local keys_deleted
        keys_deleted=$(redis-cli -h "$redis_host" -p "$redis_port" --scan --pattern "rate_limit:*" | xargs -r redis-cli -h "$redis_host" -p "$redis_port" del)
        
        if [ "$keys_deleted" -gt 0 ]; then
            log_success "Reset $keys_deleted rate limit keys"
        else
            log_info "No rate limit keys to reset"
        fi
    else
        log_error "redis-cli not found"
        return 1
    fi
}

# ================================
# 🚀 Deployment Functions
# ================================
check_deployment_status() {
    log_step "Checking deployment status..."
    
    # Check Railway status
    if command_exists railway; then
        echo -e "${WHITE}🚂 Railway Status:${NC}"
        if railway status 2>/dev/null; then
            log_success "Railway service is running"
        else
            log_warning "Could not get Railway status"
        fi
    fi
    
    # Check Vercel status
    if command_exists vercel; then
        echo -e "\n${WHITE}▲ Vercel Status:${NC}"
        if vercel ls 2>/dev/null | head -5; then
            log_success "Vercel deployments listed"
        else
            log_warning "Could not get Vercel status"
        fi
    fi
    
    # Check local services if running in Docker
    if command_exists docker-compose; then
        echo -e "\n${WHITE}🐳 Docker Services:${NC}"
        if docker-compose ps 2>/dev/null; then
            log_success "Docker services status retrieved"
        else
            log_info "No Docker Compose services running"
        fi
    fi
}

restart_services() {
    log_step "Restarting services..."
    
    local service="${1:-all}"
    
    case "$service" in
        "railway"|"api")
            if command_exists railway; then
                log_info "Restarting Railway service..."
                railway up --detach
                log_success "Railway service restarted"
            else
                log_error "Railway CLI not found"
            fi
            ;;
        "vercel"|"frontend")
            if command_exists vercel; then
                log_info "Redeploying to Vercel..."
                vercel --prod --yes
                log_success "Vercel redeployed"
            else
                log_error "Vercel CLI not found"
            fi
            ;;
        "docker"|"local")
            if command_exists docker-compose; then
                log_info "Restarting Docker services..."
                docker-compose restart
                log_success "Docker services restarted"
            else
                log_error "Docker Compose not found"
            fi
            ;;
        "all")
            restart_services "railway"
            restart_services "vercel"
            restart_services "docker"
            ;;
        *)
            log_error "Unknown service: $service"
            echo "Available services: railway, vercel, docker, all"
            return 1
            ;;
    esac
}

# ================================
# 📊 Monitoring Functions
# ================================
monitor_realtime() {
    log_step "Starting real-time monitoring..."
    
    local api_url="${1:-http://localhost:8000}"
    local interval="${2:-10}"
    
    echo -e "${WHITE}Monitoring $api_url every ${interval}s (Ctrl+C to stop)${NC}\n"
    
    while true; do
        local timestamp
        timestamp=$(date '+%H:%M:%S')
        
        local response_time
        local status_code
        
        if response_time=$(curl -s -w "%{time_total}" -o /dev/null "$api_url/health" 2>/dev/null); then
            status_code=$(curl -s -o /dev/null -w "%{http_code}" "$api_url/health" 2>/dev/null)
            
            local response_ms
            response_ms=$(echo "$response_time * 1000" | bc -l 2>/dev/null | cut -d. -f1)
            
            if [ "$status_code" = "200" ]; then
                echo -e "[$timestamp] ${GREEN}✅ HTTP $status_code${NC} - Response: ${WHITE}${response_ms}ms${NC}"
            else
                echo -e "[$timestamp] ${RED}❌ HTTP $status_code${NC} - Response: ${WHITE}${response_ms}ms${NC}"
            fi
        else
            echo -e "[$timestamp] ${RED}❌ Connection failed${NC}"
        fi
        
        sleep "$interval"
    done
}

tail_logs() {
    log_step "Tailing application logs..."
    
    local service="${1:-api}"
    
    case "$service" in
        "railway"|"api")
            if command_exists railway; then
                railway logs --follow
            else
                log_error "Railway CLI not found"
            fi
            ;;
        "vercel"|"frontend")
            if command_exists vercel; then
                vercel logs --follow
            else
                log_error "Vercel CLI not found"
            fi
            ;;
        "docker"|"local")
            if command_exists docker-compose; then
                docker-compose logs -f
            else
                log_error "Docker Compose not found"
            fi
            ;;
        *)
            log_error "Unknown service: $service"
            echo "Available services: railway, vercel, docker"
            ;;
    esac
}

# ================================
# 🔄 Update Functions
# ================================
update_dependencies() {
    log_step "Updating dependencies..."
    
    # Check for outdated packages
    if command_exists npm; then
        log_info "Checking for outdated packages..."
        npm outdated || true
        
        echo -ne "${WHITE}Update dependencies? (y/N): ${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            npm update
            log_success "Dependencies updated"
            
            # Run security audit
            log_info "Running security audit..."
            npm audit --audit-level=moderate || true
        fi
    fi
}

# ================================
# 📋 Help Function
# ================================
show_help() {
    echo -e "${PURPLE}🛠️  Fuzzy-Octo Management Script${NC}\n"
    
    echo -e "${WHITE}USAGE:${NC}"
    echo -e "  $0 <command> [options]\n"
    
    echo -e "${WHITE}HEALTH COMMANDS:${NC}"
    echo -e "  ${CYAN}health${NC} [url]           Check API health"
    echo -e "  ${CYAN}db-health${NC}             Check database connectivity"
    echo -e "  ${CYAN}redis-health${NC}          Check Redis connectivity"
    echo -e "  ${CYAN}full-health${NC}           Run all health checks\n"
    
    echo -e "${WHITE}ANALYTICS COMMANDS:${NC}"
    echo -e "  ${CYAN}stats${NC}                 Show usage statistics"
    echo -e "  ${CYAN}users${NC}                 Show user statistics"
    echo -e "  ${CYAN}monitor${NC} [url] [sec]   Real-time monitoring\n"
    
    echo -e "${WHITE}MAINTENANCE COMMANDS:${NC}"
    echo -e "  ${CYAN}backup${NC}                Create database backup"
    echo -e "  ${CYAN}cleanup${NC}               Clean up logs and cache"
    echo -e "  ${CYAN}reset-limits${NC}          Reset rate limits"
    echo -e "  ${CYAN}update${NC}                Update dependencies\n"
    
    echo -e "${WHITE}DEPLOYMENT COMMANDS:${NC}"
    echo -e "  ${CYAN}status${NC}                Check deployment status"
    echo -e "  ${CYAN}restart${NC} [service]     Restart services"
    echo -e "  ${CYAN}logs${NC} [service]        Tail service logs\n"
    
    echo -e "${WHITE}EXAMPLES:${NC}"
    echo -e "  $0 health                          # Check local API"
    echo -e "  $0 health https://api.example.com  # Check remote API"
    echo -e "  $0 monitor                         # Monitor every 10s"
    echo -e "  $0 monitor localhost:8000 5        # Monitor every 5s"
    echo -e "  $0 restart railway                 # Restart API on Railway"
    echo -e "  $0 logs docker                     # Tail Docker logs\n"
    
    echo -e "${WHITE}SERVICES:${NC}"
    echo -e "  ${CYAN}railway${NC} | ${CYAN}api${NC}        Railway/API service"
    echo -e "  ${CYAN}vercel${NC} | ${CYAN}frontend${NC}   Vercel/Frontend service"
    echo -e "  ${CYAN}docker${NC} | ${CYAN}local${NC}      Local Docker services"
    echo -e "  ${CYAN}all${NC}                   All services\n"
}

# ================================
# 🎬 Main Function
# ================================
main() {
    local command="${1:-help}"
    
    case "$command" in
        "health")
            check_api_health "$2"
            ;;
        "db-health")
            check_database_health
            ;;
        "redis-health")
            check_redis_health
            ;;
        "full-health")
            check_api_health "$2"
            check_database_health
            check_redis_health
            ;;
        "stats")
            show_usage_stats
            ;;
        "users")
            show_user_stats
            ;;
        "backup")
            backup_database
            ;;
        "cleanup")
            cleanup_logs
            ;;
        "reset-limits")
            reset_rate_limits
            ;;
        "status")
            check_deployment_status
            ;;
        "restart")
            restart_services "$2"
            ;;
        "logs")
            tail_logs "$2"
            ;;
        "monitor")
            monitor_realtime "$2" "$3"
            ;;
        "update")
            update_dependencies
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            log_error "Unknown command: $command"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# ================================
# 🚀 Script Entry Point
# ================================
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi