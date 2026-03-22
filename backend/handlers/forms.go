// Handlers for creating a new form and retrieving a form by ID.

package handlers

import (
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/kulkarni1973onkar/dune-security-assignment/backend/models"
	"github.com/kulkarni1973onkar/dune-security-assignment/backend/repository"
)

// POST /forms
func CreateForm(c *fiber.Ctx) error {
	col := c.Locals("forms").(*mongo.Collection)

	var body models.Form
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid body")
	}

	userIdStr, ok := c.Locals("userId").(string)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}
	ownerID, _ := primitive.ObjectIDFromHex(userIdStr)
	body.OwnerID = ownerID
	body.Version = 1

	// validation
	if body.Title == "" || len(body.Fields) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "title and at least one field are required")
	}
	for _, f := range body.Fields {
		if f.ID == "" || f.Type == "" || f.Label == "" {
			return fiber.NewError(fiber.StatusBadRequest, "each field requires id, type, label")
		}
		if (f.Type == "mc" || f.Type == "checkbox") && len(f.Options) == 0 {
			return fiber.NewError(fiber.StatusBadRequest, "mc/checkbox require options")
		}
		if f.Type == "rating" && (f.Min == nil || f.Max == nil || *f.Min >= *f.Max) {
			return fiber.NewError(fiber.StatusBadRequest, "rating needs valid min/max")
		}
	}

	// field IDs
	seen := make(map[string]struct{}, len(body.Fields))
	for _, f := range body.Fields {
		if _, dup := seen[f.ID]; dup {
			return fiber.NewError(fiber.StatusBadRequest, "duplicate field id: "+f.ID)
		}
		seen[f.ID] = struct{}{}
	}

	now := time.Now()
	if body.Slug == "" {
		body.Slug = primitive.NewObjectID().Hex()[:8]
	}
	body.Status = "draft"
	body.CreatedAt = now
	body.UpdatedAt = now

	repo := repository.NewFormRepository(col)
	body, err := repo.Create(c.Context(), body)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to save form")
	}
	return c.Status(201).JSON(body)
}

// GET /forms/:id
func GetForm(c *fiber.Ctx) error {
	col := c.Locals("forms").(*mongo.Collection)

	oid, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid id")
	}

	repo := repository.NewFormRepository(col)
	form, err := repo.GetByID(c.Context(), oid)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return fiber.NewError(fiber.StatusNotFound, "form not found")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "failed to fetch form")
	}

	userIdStr, ok := c.Locals("userId").(string)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}
	ownerID, _ := primitive.ObjectIDFromHex(userIdStr)
	
	if form.OwnerID != ownerID {
		return fiber.NewError(fiber.StatusForbidden, "unauthorized access to form")
	}

	return c.JSON(form)
}
