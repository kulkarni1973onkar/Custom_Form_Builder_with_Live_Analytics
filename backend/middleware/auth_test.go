package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func TestProtectedMiddleware(t *testing.T) {
	// Set a test secret
	t.Setenv("JWT_SECRET", "testsecret")

	app := fiber.New()
	app.Use(Protected())
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	// Generate a valid token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "user123",
		"exp": time.Now().Add(time.Hour).Unix(),
	})
	validTokenString, _ := token.SignedString([]byte("testsecret"))

	// Generate an expired token
	expiredToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "user123",
		"exp": time.Now().Add(-time.Hour).Unix(),
	})
	expiredTokenString, _ := expiredToken.SignedString([]byte("testsecret"))

	tests := []struct {
		name         string
		setupRequest func(*fiber.App) *http.Response
		expectedCode int
	}{
		{
			name: "No Token",
			setupRequest: func(app *fiber.App) *http.Response {
				req := httptest.NewRequest("GET", "/test", nil)
				resp, _ := app.Test(req, -1)
				return resp
			},
			expectedCode: fiber.StatusUnauthorized,
		},
		{
			name: "Valid Token in Header",
			setupRequest: func(app *fiber.App) *http.Response {
				req := httptest.NewRequest("GET", "/test", nil)
				req.Header.Set("Authorization", "Bearer "+validTokenString)
				resp, _ := app.Test(req, -1)
				return resp
			},
			expectedCode: fiber.StatusOK,
		},
		{
			name: "Expired Token",
			setupRequest: func(app *fiber.App) *http.Response {
				req := httptest.NewRequest("GET", "/test", nil)
				req.Header.Set("Authorization", "Bearer "+expiredTokenString)
				resp, _ := app.Test(req, -1)
				return resp
			},
			expectedCode: fiber.StatusUnauthorized,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			actualResp := tc.setupRequest(app)
			if actualResp != nil && tc.expectedCode != 0 {
				if actualResp.StatusCode != tc.expectedCode {
					t.Errorf("Expected status %d but got %d", tc.expectedCode, actualResp.StatusCode)
				}
			}
		})
	}
}
