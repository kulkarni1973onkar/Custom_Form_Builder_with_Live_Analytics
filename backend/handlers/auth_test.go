package handlers

import (
	"os"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestGenerateTokens(t *testing.T) {
	// Set test environment variable
	t.Setenv("JWT_SECRET", "testsecret")

	userID := primitive.NewObjectID()
	aToken, rToken, err := generateTokens(userID)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if aToken == "" || rToken == "" {
		t.Error("Expected tokens to be generated")
	}

	// Verify the access token
	token, err := jwt.Parse(aToken, func(token *jwt.Token) (interface{}, error) {
		return []byte("testsecret"), nil
	})

	if err != nil {
		t.Fatalf("Failed to parse access token: %v", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		t.Error("Invalid token or claims")
	}

	if claims["sub"] != userID.Hex() {
		t.Errorf("Expected sub claim to be %s, got %s", userID.Hex(), claims["sub"])
	}
}

func TestGenerateTokensMissingSecret(t *testing.T) {
	os.Unsetenv("JWT_SECRET")

	userID := primitive.NewObjectID()
	_, _, err := generateTokens(userID)
	if err == nil {
		t.Error("Expected error when JWT_SECRET is missing, got nil")
	}
}
