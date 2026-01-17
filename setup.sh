#!/bin/bash

# Setup script for Evolution of Todo

echo "🚀 Setting up Evolution of Todo..."

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    command -v python3 &> /dev/null || { echo "❌ Python 3 required"; exit 1; }
    command -v node &> /dev/null || { echo "❌ Node.js required"; exit 1; }
    command -v docker &> /dev/null || { echo "⚠️  Docker not found (optional for local dev)"; }
    
    echo "✅ Prerequisites OK"
}

# Setup backend
setup_backend() {
    echo "🔧 Setting up backend..."
    
    cd backend/phase-2-web
    
    # Create virtual environment
    python3 -m venv venv
    source venv/bin/activate
    
    # Install dependencies
    pip install --upgrade pip
    pip install -e ".[dev]"
    
    # Create .env if not exists
    if [ ! -f .env ]; then
        cat > .env << EOF
DATABASE_URL=postgresql+asyncpg://todo_user:todo_password@localhost:5432/evolution_todo
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ALLOWED_ORIGINS=http://localhost:3000
EOF
    fi
    
    cd ../..
    echo "✅ Backend setup complete"
}

# Setup frontend
setup_frontend() {
    echo "🎨 Setting up frontend..."
    
    cd frontend/phase-2-web
    
    # Install dependencies
    npm install
    
    # Create .env.local if not exists
    if [ ! -f .env.local ]; then
        echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
    fi
    
    cd ../..
    echo "✅ Frontend setup complete"
}

# Run database
setup_database() {
    echo "📊 Setting up database..."
    
    docker run -d \
        --name evolution-postgres \
        -e POSTGRES_DB=evolution_todo \
        -e POSTGRES_USER=todo_user \
        -e POSTGRES_PASSWORD=todo_password \
        -p 5432:5432 \
        postgres:16-alpine
    
    echo "✅ Database setup complete"
}

# Main flow
main() {
    check_prerequisites
    
    read -p "Setup backend? (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]] && setup_backend
    
    read -p "Setup frontend? (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]] && setup_frontend
    
    read -p "Setup database (Docker)? (y/n) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]] && setup_database
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Backend: cd backend/phase-2-web && source venv/bin/activate && uvicorn src.main:app --reload"
    echo "2. Frontend: cd frontend/phase-2-web && npm run dev"
    echo "3. Open http://localhost:3000"
}

main
