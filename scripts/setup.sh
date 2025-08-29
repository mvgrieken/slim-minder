#!/bin/bash

# Slim Minder Setup Script
# This script sets up the development environment for Slim Minder

set -e

echo "🚀 Slim Minder Setup Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18.17+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18.17+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You'll need to install Docker for full functionality."
    else
        print_success "Docker version: $(docker --version)"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. You'll need to install Docker Compose for full functionality."
    else
        print_success "Docker Compose version: $(docker-compose --version)"
    fi
    
    # Check Expo CLI
    if ! command -v expo &> /dev/null; then
        print_warning "Expo CLI is not installed. Installing globally..."
        npm install -g @expo/cli
    fi
    
    print_success "Expo CLI version: $(expo --version)"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Root dependencies
    npm install
    
    # API dependencies
    cd apps/api
    npm install
    cd ../..
    
    # Mobile dependencies
    cd apps/mobile
    npm install
    cd ../..
    
    # Worker dependencies
    cd apps/worker
    npm install
    cd ../..
    
    # Package dependencies
    cd packages/types
    npm install
    cd ../..
    
    cd packages/ui
    npm install
    cd ../..
    
    cd packages/utils
    npm install
    cd ../..
    
    print_success "All dependencies installed successfully"
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            print_success "Created .env file from template"
            print_warning "Please edit .env file with your actual configuration values"
        else
            print_warning "No env.example file found. Please create .env file manually"
        fi
    else
        print_success ".env file already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        # Start database services
        docker-compose up postgres redis -d
        
        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10
        
        # Run database migrations
        cd apps/api
        npm run prisma:generate
        npm run prisma:migrate
        
        # Seed database
        if [ -f "prisma/seed.ts" ]; then
            npm run prisma:seed
        fi
        
        cd ../..
        
        print_success "Database setup completed"
    else
        print_warning "Docker not available. Please set up database manually:"
        echo "1. Install PostgreSQL and Redis"
        echo "2. Create database 'slimminder'"
        echo "3. Run: cd apps/api && npm run prisma:migrate"
    fi
}

# Build packages
build_packages() {
    print_status "Building packages..."
    
    # Build types package
    cd packages/types
    npm run build
    cd ../..
    
    # Build utils package
    cd packages/utils
    npm run build
    cd ../..
    
    # Build UI package
    cd packages/ui
    npm run build
    cd ../..
    
    print_success "All packages built successfully"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d .git ]; then
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
npm run lint

# Run type checking
npm run typecheck

echo "Pre-commit checks completed"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks configured"
    else
        print_warning "Not a Git repository. Skipping Git hooks setup"
    fi
}

# Main setup function
main() {
    echo ""
    print_status "Starting Slim Minder setup..."
    echo ""
    
    check_requirements
    echo ""
    
    install_dependencies
    echo ""
    
    setup_environment
    echo ""
    
    setup_database
    echo ""
    
    build_packages
    echo ""
    
    setup_git_hooks
    echo ""
    
    print_success "🎉 Slim Minder setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your configuration"
    echo "2. Start the API server: cd apps/api && npm run dev"
    echo "3. Start the mobile app: cd apps/mobile && npm start"
    echo ""
    echo "For more information, see README.md"
    echo ""
}

# Run main function
main "$@"
