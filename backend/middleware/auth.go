package middleware

import (
	"errors"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func Protected() fiber.Handler {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET environment variable is required")
	}

	return func(c *fiber.Ctx) error {
		// Try to get token from header
		authHeader := c.Get("Authorization")
		var tokenStr string

		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			// Try cookie as fallback
			tokenStr = c.Cookies("access_token")
		}

		if tokenStr == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Missing or malformed JWT")
		}

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid or expired JWT")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid JWT claims")
		}

		c.Locals("userId", claims["sub"])
		return c.Next()
	}
}
