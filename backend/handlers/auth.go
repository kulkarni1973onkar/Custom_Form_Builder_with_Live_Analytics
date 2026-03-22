package handlers

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"

	"github.com/kulkarni1973onkar/dune-security-assignment/backend/models"
)

func generateTokens(userID primitive.ObjectID) (string, string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", "", errors.New("JWT_SECRET environment variable is required")
	}

	// Access token generates 15m expiration
	accessClaims := jwt.MapClaims{
		"sub": userID.Hex(),
		"exp": time.Now().Add(15 * time.Minute).Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	aToken, err := accessToken.SignedString([]byte(secret))
	if err != nil {
		return "", "", err
	}

	// Refresh token generates 7d expiration
	refreshClaims := jwt.MapClaims{
		"sub": userID.Hex(),
		"exp": time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	rToken, err := refreshToken.SignedString([]byte(secret))
	if err != nil {
		return "", "", err
	}

	return aToken, rToken, nil
}

func Register(c *fiber.Ctx) error {
	db := c.Locals("db").(*mongo.Database)
	usersColl := db.Collection("users")

	type reqBody struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=6"`
	}

	req := new(reqBody)
	if err := c.BodyParser(req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	// Simplistic duplicate email check
	count, _ := usersColl.CountDocuments(context.Background(), bson.M{"email": req.Email})
	if count > 0 {
		return fiber.NewError(fiber.StatusConflict, "Email already exists")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to hash password")
	}

	user := models.User{
		ID:        primitive.NewObjectID(),
		Email:     req.Email,
		Password:  string(hash),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if _, err := usersColl.InsertOne(context.Background(), user); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to create user")
	}

	aToken, rToken, err := generateTokens(user.ID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to generate tokens")
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    rToken,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HTTPOnly: true,
	})

	return c.Status(201).JSON(fiber.Map{
		"accessToken": aToken,
		"user": fiber.Map{
			"id":    user.ID.Hex(),
			"email": user.Email,
		},
	})
}

func Login(c *fiber.Ctx) error {
	db := c.Locals("db").(*mongo.Database)
	usersColl := db.Collection("users")

	type reqBody struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}

	req := new(reqBody)
	if err := c.BodyParser(req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	var user models.User
	if err := usersColl.FindOne(context.Background(), bson.M{"email": req.Email}).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid credentials")
		}
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid credentials")
	}

	aToken, rToken, err := generateTokens(user.ID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to generate tokens")
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    rToken,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HTTPOnly: true,
	})

	return c.JSON(fiber.Map{
		"accessToken": aToken,
		"user": fiber.Map{
			"id":    user.ID.Hex(),
			"email": user.Email,
		},
	})
}
