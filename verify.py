#!/usr/bin/env python3
"""
Verification script to check all components are in place.
Run: python verify.py
"""

import os
import sys
from pathlib import Path

class Verifier:
    def __init__(self):
        self.root = Path.cwd()
        self.checks = []
        self.passed = 0
        self.failed = 0

    def check_file(self, path, name=""):
        """Check if file exists"""
        label = name or path
        if Path(path).exists():
            self.checks.append(("✅", f"File: {label}"))
            self.passed += 1
        else:
            self.checks.append(("❌", f"Missing: {label}"))
            self.failed += 1

    def check_dir(self, path, name=""):
        """Check if directory exists"""
        label = name or path
        if Path(path).is_dir():
            self.checks.append(("✅", f"Dir: {label}"))
            self.passed += 1
        else:
            self.checks.append(("❌", f"Missing: {label}"))
            self.failed += 1

    def check_contains(self, path, text, name=""):
        """Check if file contains text"""
        label = name or f"{path} contains '{text}'"
        try:
            with open(path) as f:
                if text in f.read():
                    self.checks.append(("✅", f"Content: {label}"))
                    self.passed += 1
                else:
                    self.checks.append(("⚠️", f"Missing content: {label}"))
                    self.failed += 1
        except Exception as e:
            self.checks.append(("❌", f"Error: {label} - {str(e)}"))
            self.failed += 1

    def print_results(self):
        """Print verification results"""
        print("\n" + "="*60)
        print("EVOLUTION OF TODO - VERIFICATION REPORT")
        print("="*60 + "\n")

        for status, message in self.checks:
            print(f"{status} {message}")

        print("\n" + "="*60)
        print(f"PASSED: {self.passed} | FAILED: {self.failed}")
        print("="*60 + "\n")

        return self.failed == 0

def main():
    verifier = Verifier()

    print("\n🔍 Verifying Evolution of Todo Implementation...\n")

    # Check root files
    print("📁 Root Files:")
    verifier.check_file("README.md")
    verifier.check_file("CONTRIBUTING.md")
    verifier.check_file("PROJECT-STATUS.md")
    verifier.check_file("QUICK-REFERENCE.md")
    verifier.check_file("docker-compose.yml")
    verifier.check_file("setup.sh")
    verifier.check_file("setup.bat")

    # Check documentation
    print("\n📚 Documentation:")
    verifier.check_file("docs/API.md")
    verifier.check_file("docs/INSTALL.md")
    verifier.check_file("docs/IMPLEMENTATION-SUMMARY.md")
    verifier.check_file("docs/phase-3/PHASE3-SPEC.md")

    # Check backend structure
    print("\n🔧 Backend Structure:")
    verifier.check_dir("backend/phase-2-web/src")
    verifier.check_file("backend/phase-2-web/src/main.py")
    verifier.check_file("backend/phase-2-web/src/models/schemas.py")
    verifier.check_file("backend/phase-2-web/src/security/jwt.py")
    verifier.check_file("backend/phase-2-web/Dockerfile")
    verifier.check_file("backend/phase-2-web/pyproject.toml")

    # Check backend API
    print("\n🔌 Backend API Endpoints:")
    verifier.check_file("backend/phase-2-web/src/api/v1/auth.py")
    verifier.check_file("backend/phase-2-web/src/api/v1/tasks.py")
    verifier.check_file("backend/phase-2-web/src/api/v1/stats.py")
    verifier.check_file("backend/phase-2-web/src/api/v1/ws/__init__.py")
    verifier.check_file("backend/phase-2-web/src/api/v1/collaboration.py")
    verifier.check_file("backend/phase-2-web/src/api/v1/search.py")
    verifier.check_file("backend/phase-2-web/src/api/v1/analytics.py")

    # Check backend tests
    print("\n🧪 Backend Tests:")
    verifier.check_dir("backend/phase-2-web/tests")
    verifier.check_file("backend/phase-2-web/tests/conftest.py")

    # Check frontend structure
    print("\n⚛️  Frontend Structure:")
    verifier.check_dir("frontend/phase-2-web/src")
    verifier.check_file("frontend/phase-2-web/package.json")
    verifier.check_file("frontend/phase-2-web/tsconfig.json")
    verifier.check_file("frontend/phase-2-web/next.config.js")
    verifier.check_file("frontend/phase-2-web/Dockerfile")

    # Check frontend pages
    print("\n📄 Frontend Pages:")
    verifier.check_file("frontend/phase-2-web/src/app/page.tsx")
    verifier.check_file("frontend/phase-2-web/src/app/login/page.tsx")
    verifier.check_file("frontend/phase-2-web/src/app/register/page.tsx")
    verifier.check_file("frontend/phase-2-web/src/app/dashboard/page.tsx")
    verifier.check_file("frontend/phase-2-web/src/app/layout.tsx")

    # Check frontend components
    print("\n🎨 Frontend Components:")
    verifier.check_file("frontend/phase-2-web/src/components/TaskList.tsx")
    verifier.check_file("frontend/phase-2-web/src/components/CreateTaskForm.tsx")
    verifier.check_file("frontend/phase-2-web/src/components/Header.tsx")

    # Check frontend lib
    print("\n🔧 Frontend Library:")
    verifier.check_file("frontend/phase-2-web/src/lib/api.ts")
    verifier.check_file("frontend/phase-2-web/src/lib/websocket.ts")
    verifier.check_file("frontend/phase-2-web/src/lib/store.ts")

    # Check frontend hooks
    print("\n🪝 Frontend Hooks:")
    verifier.check_file("frontend/phase-2-web/src/hooks/useAuth.ts")
    verifier.check_file("frontend/phase-2-web/src/hooks/useTasks.ts")
    verifier.check_file("frontend/phase-2-web/src/hooks/useWebSocket.ts")
    verifier.check_file("frontend/phase-2-web/src/hooks/useAnalytics.ts")

    # Check CI/CD
    print("\n🚀 CI/CD:")
    verifier.check_file(".github/workflows/ci-cd.yml")

    # Check Phase 1
    print("\n📦 Phase 1 Console App:")
    verifier.check_dir("backend/phase-1-console/src")
    verifier.check_dir("backend/phase-1-console/tests")

    # Print results
    success = verifier.print_results()

    if success:
        print("✅ ALL CHECKS PASSED! Project is complete.\n")
        sys.exit(0)
    else:
        print("⚠️  Some checks failed. Review the output above.\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
