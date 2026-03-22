# Testing Guide - Custom Form Builder

## Overview

This project uses:
- **Backend**: Go's native `testing` package with `httptest` for HTTP testing
- **Frontend**: Jest + React Testing Library (optional - can be added)
- **Integration**: Docker Compose for end-to-end testing

---

## 🧪 Backend Testing (Go)

### Running Tests

#### 1. Run All Backend Tests
```bash
cd backend
go test ./...
```

#### 2. Run Tests in Specific Package
```bash
# Test middleware package
go test ./middleware

# Test handlers package
go test ./handlers

# Test with verbose output
go test -v ./...
```

#### 3. Run Specific Test
```bash
# Run only auth middleware tests
go test -run TestProtectedMiddleware ./middleware

# Run only token generation tests
go test -run TestGenerateTokens ./handlers
```

#### 4. Run with Coverage Report
```bash
# Generate coverage
go test -cover ./...

# Generate detailed coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

#### 5. Run Tests with Timeout
```bash
# Set timeout (default 10m)
go test -timeout 30s ./...
```

### Existing Test Files

#### **Middleware Tests** (`backend/middleware/auth_test.go`)
Tests JWT authentication middleware:
- ✅ Protected middleware with no token
- ✅ Protected middleware with valid token
- ✅ Protected middleware with expired token

**Run:**
```bash
cd backend
go test -v ./middleware
```

#### **Handler Tests** (`backend/handlers/auth_test.go`)
Tests authentication handlers:
- ✅ Token generation with valid inputs
- ✅ Token generation with missing JWT_SECRET

**Run:**
```bash
cd backend
go test -v ./handlers
```

### Writing New Backend Tests

#### Example: Test Form Handler

```go
// handlers/forms_test.go
package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func TestCreateForm(t *testing.T) {
	app := fiber.New()
	
	// Create a mock database and inject it
	app.Post("/forms", CreateForm)

	payload := map[string]interface{}{
		"title": "My Test Form",
		"fields": []map[string]interface{}{
			{
				"id":   "field1",
				"type": "text",
				"label": "Name",
			},
		},
	}

	body, _ := json.Marshal(payload)
	req := httptest.NewRequest("POST", "/forms", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer " + validToken)

	resp, _ := app.Test(req, -1)

	if resp.StatusCode != fiber.StatusCreated {
		t.Errorf("Expected status %d, got %d", fiber.StatusCreated, resp.StatusCode)
	}
}

func TestGetForm(t *testing.T) {
	app := fiber.New()
	app.Get("/forms/:id", GetForm)

	req := httptest.NewRequest("GET", "/forms/507f1f77bcf86cd799439011", nil)
	resp, _ := app.Test(req, -1)

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected status %d, got %d", fiber.StatusOK, resp.StatusCode)
	}
}
```

**Test Patterns:**
- Use `httptest.NewRequest()` to create mock requests
- Use `app.Test()` to execute handlers
- Check `StatusCode` and response body
- Mock database collections using dependency injection

---

## 🧪 Frontend Testing (TypeScript/React)

### Setup Testing Framework (Optional)

To add testing to the frontend, install Jest and React Testing Library:

```bash
cd frontend
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

### Create Jest Configuration

```typescript
// frontend/jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/./$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
```

### Example: Component Tests

#### Test Button Component
```typescript
// components/UI/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/UI/Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports different variants', () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('outline');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

#### Test Form Builder Hook
```typescript
// hooks/useFormDraft.test.ts
import { renderHook, act } from '@testing-library/react';
import { useFormDraft } from '@/hooks/useFormDraft';

describe('useFormDraft Hook', () => {
  it('initializes with default draft', () => {
    const { result } = renderHook(() => useFormDraft());
    expect(result.current.draft).toBeDefined();
    expect(result.current.draft.fields).toEqual([]);
  });

  it('adds field to draft', () => {
    const { result } = renderHook(() => useFormDraft());
    
    act(() => {
      result.current.actions.add('text');
    });

    expect(result.current.draft.fields).toHaveLength(1);
    expect(result.current.draft.fields[0].type).toBe('text');
  });

  it('updates field in draft', () => {
    const { result } = renderHook(() => useFormDraft());
    
    act(() => {
      result.current.actions.add('text');
      result.current.actions.update(result.current.draft.fields[0].id, {
        label: 'Updated Label',
      });
    });

    expect(result.current.draft.fields[0].label).toBe('Updated Label');
  });

  it('removes field from draft', () => {
    const { result } = renderHook(() => useFormDraft());
    
    act(() => {
      result.current.actions.add('text');
      const fieldId = result.current.draft.fields[0].id;
      result.current.actions.remove(fieldId);
    });

    expect(result.current.draft.fields).toHaveLength(0);
  });
});
```

#### Test API Service
```typescript
// lib/api.test.ts
import { api } from '@/lib/api';

describe('API Service', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a form', async () => {
    const mockForm = {
      id: '123',
      title: 'Test Form',
      fields: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockForm,
    });

    const result = await api.createForm(mockForm);
    expect(result).toEqual(mockForm);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/forms'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(api.getForm('invalid-id')).rejects.toThrow();
  });
});
```

### Running Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- Button.test.tsx

# Run with coverage
npm test -- --coverage
```

---

## 🔄 Integration Testing

### Test Full User Flow with Docker Compose

#### 1. Start Services
```bash
docker-compose up -d
```

#### 2. Run Integration Tests
```bash
# Test form creation flow
curl -X POST http://localhost:8080/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Integration Test Form",
    "fields": [{
      "id": "field1",
      "type": "text",
      "label": "Test Field"
    }]
  }'

# Test form submission
curl -X POST http://localhost:8080/forms/{form-id}/responses \
  -H "Content-Type: application/json" \
  -d '{
    "field1": "test response"
  }'

# Test analytics
curl http://localhost:8080/forms/{form-id}/analytics
```

#### 3. Test WebSocket Connection
```bash
# Using websocat or similar tool
websocat ws://localhost:8080/ws/forms/{form-id}/analytics
```

---

## ✅ Testing Checklist

### Backend Tests Coverage
- [ ] Authentication & Authorization
- [ ] Form CRUD operations
- [ ] Response submission & validation
- [ ] Analytics calculation
- [ ] Error handling
- [ ] Rate limiting
- [ ] WebSocket connections

### Frontend Tests Coverage
- [ ] Component rendering
- [ ] User interactions (clicks, typing)
- [ ] Form validation
- [ ] API integration
- [ ] Error boundaries
- [ ] Loading states
- [ ] Theme toggling

### Integration Tests Coverage
- [ ] Complete form creation flow
- [ ] Form publishing & sharing
- [ ] Response submission
- [ ] Real-time analytics updates
- [ ] Authentication flow

---

## 🚀 CI/CD Testing Setup

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v4
        with:
          go-version: '1.25'
      - run: cd backend && go test -v -coverprofile=coverage.out ./...
      - uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.out

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

---

## 📊 Coverage Goals

- **Backend**: Aim for 80%+ coverage on critical paths
- **Frontend**: Aim for 70%+ coverage on components and hooks
- **Priority**: Test authentication, form operations, and data validation first

---

## 🔧 Useful Testing Commands

```bash
# Backend
go test -v -race ./...                    # Detect race conditions
go test -bench=. ./...                    # Run benchmarks
go test -memprofile=mem.prof ./...        # Memory profiling

# Frontend
npm test -- --coverage --watchAll=false   # Generate coverage report
npm test -- --testPathPattern="Button"    # Run specific test file
npm test -- --bail                        # Stop on first failure
```

---

## Resources

- **Go Testing**: https://golang.org/doc/effective_go#testing
- **Fiber Testing**: https://docs.gofiber.io/guide/testing
- **React Testing Library**: https://testing-library.com/
- **Jest Documentation**: https://jestjs.io/
