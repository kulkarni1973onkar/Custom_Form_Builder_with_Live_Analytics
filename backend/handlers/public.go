// Handler for fetching a published form by slug for public access.

package handlers

import (
	"context"
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/kulkarni1973onkar/dune-security-assignment/backend/config"
)

// GET /public/forms/:slug
func GetFormBySlug(c *fiber.Ctx) error {
	col := c.Locals("forms").(*mongo.Collection)
	slug := c.Params("slug")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cacheKey := "form:slug:" + slug
	if config.RedisClient != nil {
		if cached, err := config.RedisClient.Get(ctx, cacheKey).Result(); err == nil {
			var form interface{}
			if json.Unmarshal([]byte(cached), &form) == nil {
				return c.JSON(form)
			}
		}
	}

	// Return a "public-safe" view of the form (no admin metadata)
	var form struct {
		ID     string      `bson:"_id" json:"id"`
		Title  string      `bson:"title" json:"title"`
		Fields interface{} `bson:"fields" json:"fields"`
		Slug   string      `bson:"slug" json:"slug"`
		Status string      `bson:"status" json:"status"`
	}

	if err := col.FindOne(ctx, bson.M{"slug": slug, "status": "published"}).Decode(&form); err != nil {
		return fiber.NewError(fiber.StatusNotFound, "form not found or unpublished")
	}

	if config.RedisClient != nil {
		if b, err := json.Marshal(form); err == nil {
			// TTL-based invalidation (e.g., 1 hour)
			config.RedisClient.Set(ctx, cacheKey, b, 1*time.Hour)
		}
	}

	return c.JSON(form)
}
