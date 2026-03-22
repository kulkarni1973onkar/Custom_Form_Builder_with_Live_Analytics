#!/bin/bash
# test-all.sh - Run all tests for the project

echo "=========================================="
echo "Custom Form Builder - Test Suite"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Tests
echo -e "${YELLOW}Running Backend Tests...${NC}"
echo "=========================================="
cd backend

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo -e "${RED}Go is not installed${NC}"
    exit 1
fi

# Run tests
if go test -v -race -coverprofile=coverage.out ./...; then
    echo -e "${GREEN}✓ Backend tests passed${NC}"
    
    # Show coverage
    echo ""
    echo "Coverage Report:"
    go tool cover -func=coverage.out | tail -5
    echo ""
else
    echo -e "${RED}✗ Backend tests failed${NC}"
    exit 1
fi

cd ..

# Frontend Tests (if Jest is configured)
echo ""
echo -e "${YELLOW}Frontend Tests Check...${NC}"
echo "=========================================="
cd frontend

if [ -f "package.json" ] && grep -q '"jest"' package.json; then
    echo "Found Jest configuration"
    echo "To run frontend tests:"
    echo "  cd frontend && npm test"
    echo ""
else
    echo "Jest not configured for frontend"
    echo "To set up testing:"
    echo "  npm install --save-dev jest @testing-library/react"
    echo ""
fi

cd ..

echo -e "${GREEN}=========================================="
echo "Test Summary"
echo "==========================================${NC}"
echo "✓ Backend: All tests passed with race detection"
echo "• Frontend: Ready for testing (run: npm test in frontend/)"
echo ""
echo "For detailed coverage report:"
echo "  cd backend && go tool cover -html=coverage.out"
echo ""
