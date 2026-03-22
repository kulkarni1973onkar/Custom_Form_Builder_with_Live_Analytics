package middleware

import (
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
)

// GlobalErrorHandler shapes all returning errors into standardized JSON.
func GlobalErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"
	
	// Fast path for Fiber errors
	var e *fiber.Error
	if errors.As(err, &e) {
		code = e.Code
		message = e.Message
	} else {
		log.Printf("Unhandled error: %v", err)
	}

	return c.Status(code).JSON(fiber.Map{
		"error":   true,
		"message": message,
		"code":    code,
	})
}
