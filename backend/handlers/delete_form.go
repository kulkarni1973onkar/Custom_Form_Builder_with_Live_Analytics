// DeleteForm removes a form by ID and cascades delete to its responses.

package handlers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/kulkarni1973onkar/dune-security-assignment/backend/config"
	"github.com/kulkarni1973onkar/dune-security-assignment/backend/models"
)

// DELETE /forms/:id
func DeleteForm(c *fiber.Ctx) error {
	formsCol := c.Locals("forms").(*mongo.Collection)
	responsesCol := c.Locals("responses").(*mongo.Collection)

	oid, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	userIdStr, ok := c.Locals("userId").(string)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}
	ownerID, _ := primitive.ObjectIDFromHex(userIdStr)

	// Delete the form document by _id and ownerId, fetching it to get the slug.
	var form models.Form
	err = formsCol.FindOneAndDelete(c.Context(), bson.M{"_id": oid, "ownerId": ownerID}).Decode(&form)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "form not found or unauthorized")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "failed to delete form")
	}

	if config.RedisClient != nil && form.Slug != "" {
		config.RedisClient.Del(c.Context(), "form:slug:"+form.Slug)
	}

	if _, err := responsesCol.DeleteMany(c.Context(), bson.M{"formId": oid}); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "form deleted, but failed to delete responses")
	}

	// No content returned on success.
	return c.SendStatus(204)
}
