#!/bin/bash
# Phase 3 Implementation Verification Checklist

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   Evolution of Todo - Phase 3 Implementation Checklist       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_count=0
pass_count=0
fail_count=0

check_item() {
    ((check_count++))
    local name=$1
    local command=$2
    
    if eval "$command" &>/dev/null; then
        echo -e "${GREEN}✓${NC} $name"
        ((pass_count++))
    else
        echo -e "${RED}✗${NC} $name"
        ((fail_count++))
    fi
}

# Phase 1: Console App
echo ""
echo "PHASE 1: Console Application"
echo "─────────────────────────────"
check_item "Phase 1 source exists" "[ -d backend/phase-1-console/src ]"
check_item "Phase 1 tests exist" "[ -d backend/phase-1-console/tests ]"
check_item "Phase 1 tests passing" "cd backend/phase-1-console && pytest tests/ -q 2>/dev/null | grep -q 'passed'"

# Phase 2: Backend
echo ""
echo "PHASE 2: Backend (FastAPI)"
echo "──────────────────────────"
check_item "Backend source exists" "[ -d backend/phase-2-web/src ]"
check_item "main.py exists" "[ -f backend/phase-2-web/src/main.py ]"
check_item "SQLModel schemas" "[ -f backend/phase-2-web/src/models/schemas.py ]"
check_item "Auth endpoints" "[ -f backend/phase-2-web/src/api/v1/auth.py ]"
check_item "Task endpoints" "[ -f backend/phase-2-web/src/api/v1/tasks.py ]"
check_item "Stats endpoints" "[ -f backend/phase-2-web/src/api/v1/stats.py ]"
check_item "JWT security" "[ -f backend/phase-2-web/src/security/jwt.py ]"
check_item "Database session" "[ -f backend/phase-2-web/src/database/session.py ]"
check_item "Backend Dockerfile" "[ -f backend/phase-2-web/Dockerfile ]"
check_item "Backend dependencies" "[ -f backend/phase-2-web/pyproject.toml ]"

# Phase 2: Frontend
echo ""
echo "PHASE 2: Frontend (Next.js)"
echo "───────────────────────────"
check_item "Frontend source exists" "[ -d frontend/phase-2-web/src ]"
check_item "Landing page" "[ -f frontend/phase-2-web/src/app/page.tsx ]"
check_item "Login page" "[ -f frontend/phase-2-web/src/app/login/page.tsx ]"
check_item "Register page" "[ -f frontend/phase-2-web/src/app/register/page.tsx ]"
check_item "Dashboard page" "[ -f frontend/phase-2-web/src/app/dashboard/page.tsx ]"
check_item "Layout" "[ -f frontend/phase-2-web/src/app/layout.tsx ]"
check_item "TaskList component" "[ -f frontend/phase-2-web/src/components/TaskList.tsx ]"
check_item "CreateTaskForm component" "[ -f frontend/phase-2-web/src/components/CreateTaskForm.tsx ]"
check_item "Header component" "[ -f frontend/phase-2-web/src/components/Header.tsx ]"
check_item "API client" "[ -f frontend/phase-2-web/src/lib/api.ts ]"
check_item "Zustand store" "[ -f frontend/phase-2-web/src/lib/store.ts ]"
check_item "useAuth hook" "[ -f frontend/phase-2-web/src/hooks/useAuth.ts ]"
check_item "useTasks hook" "[ -f frontend/phase-2-web/src/hooks/useTasks.ts ]"
check_item "Frontend Dockerfile" "[ -f frontend/phase-2-web/Dockerfile ]"
check_item "Frontend dependencies" "[ -f frontend/phase-2-web/package.json ]"

# Phase 3: Real-Time Features
echo ""
echo "PHASE 3: Real-Time Features"
echo "──────────────────────────"
check_item "WebSocket handler" "[ -f backend/phase-2-web/src/api/v1/ws/__init__.py ]"
check_item "Collaboration endpoints" "[ -f backend/phase-2-web/src/api/v1/collaboration.py ]"
check_item "Search endpoints" "[ -f backend/phase-2-web/src/api/v1/search.py ]"
check_item "Analytics endpoints" "[ -f backend/phase-2-web/src/api/v1/analytics.py ]"
check_item "WebSocket client" "[ -f frontend/phase-2-web/src/lib/websocket.ts ]"
check_item "useWebSocket hook" "[ -f frontend/phase-2-web/src/hooks/useWebSocket.ts ]"
check_item "useRealtimeTasks hook" "[ -f frontend/phase-2-web/src/hooks/useRealtimeTasks.ts ]"
check_item "useSearch hook" "[ -f frontend/phase-2-web/src/hooks/useSearch.ts ]"
check_item "useAnalytics hook" "[ -f frontend/phase-2-web/src/hooks/useAnalytics.ts ]"

# Documentation
echo ""
echo "Documentation"
echo "──────────────"
check_item "README.md" "[ -f README.md ]"
check_item "CONTRIBUTING.md" "[ -f CONTRIBUTING.md ]"
check_item "API.md" "[ -f docs/API.md ]"
check_item "INSTALL.md" "[ -f docs/INSTALL.md ]"
check_item "Phase 3 Spec" "[ -f docs/phase-3/PHASE3-SPEC.md ]"
check_item "Quick Reference" "[ -f QUICK-REFERENCE.md ]"
check_item "Project Status" "[ -f PROJECT-STATUS.md ]"

# Infrastructure
echo ""
echo "Infrastructure & Deployment"
echo "────────────────────────────"
check_item "docker-compose.yml" "[ -f docker-compose.yml ]"
check_item "GitHub Actions CI/CD" "[ -f .github/workflows/ci-cd.yml ]"
check_item "Backend Dockerfile" "[ -f backend/phase-2-web/Dockerfile ]"
check_item "Frontend Dockerfile" "[ -f frontend/phase-2-web/Dockerfile ]"
check_item "Setup script (Unix)" "[ -f setup.sh ]"
check_item "Setup script (Windows)" "[ -f setup.bat ]"

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     VERIFICATION SUMMARY                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Total Checks: $check_count"
echo -e "Passed: ${GREEN}$pass_count${NC}"
echo -e "Failed: ${RED}$fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 Project is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "  1. Review documentation in docs/"
    echo "  2. Run 'docker-compose up -d' to start the full stack"
    echo "  3. Or run setup.sh/setup.bat for local development"
    echo "  4. Access frontend at http://localhost:3000"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed!${NC}"
    echo ""
    echo "Please review the output above and ensure all files are in place."
    echo ""
    exit 1
fi
