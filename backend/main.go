// Application entrypoint: sets up DB, middleware, routes, and starts the server.

package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/gofiber/swagger"
	"github.com/joho/godotenv"

	_ "github.com/kulkarni1973onkar/dune-security-assignment/backend/docs"

	"github.com/kulkarni1973onkar/dune-security-assignment/backend/config"
	"github.com/kulkarni1973onkar/dune-security-assignment/backend/handlers"
	"github.com/kulkarni1973onkar/dune-security-assignment/backend/middleware"
	"github.com/kulkarni1973onkar/dune-security-assignment/backend/utils"
)

func main() {
	_ = godotenv.Load()

	client, db := config.ConnectMongo()
	defer func() { _ = client.Disconnect(context.Background()) }()

	config.EnsureIndexes(db)
	config.InitRedis()
	utils.InitJobPool(5)

	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.GlobalErrorHandler,
		EnableTrustedProxyCheck: true,
	})
	
	// Structured logging for all requests
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${latency} ${method} ${path}\n",
	}))

	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000,http://127.0.0.1:3000" // Dev defaults
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	// Expose collections to handlers
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("db", db)
		c.Locals("forms", db.Collection("forms"))
		c.Locals("responses", db.Collection("responses"))
		return c.Next()
	})

	// Health check
	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.SendString("API is running")
	})

	app.Get("/readyz", func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(c.Context(), 2*time.Second)
		defer cancel()
		if err := client.Ping(ctx, nil); err != nil {
			return fiber.NewError(fiber.StatusServiceUnavailable, "not ready")
		}
		return c.JSON(fiber.Map{"status": "ready"})
	})

	app.Get("/metrics", monitor.New())

	app.Get("/docs/*", swagger.HandlerDefault)

	// AI form generation
	app.Post("/api/forms/generate", handlers.GenerateForm)

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	app.Get("/ws/forms/:id/analytics", websocket.New(handlers.WsAnalytics))

	// Auth routes
	app.Post("/auth/register", handlers.Register)
	app.Post("/auth/login", handlers.Login)

	// Public routes
	app.Get("/public/forms/:slug", handlers.GetFormBySlug)
	app.Post("/forms/:id/responses", limiter.New(limiter.Config{
		Max:        100, // 100 requests
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return fiber.NewError(fiber.StatusTooManyRequests, "rate limit exceeded")
		},
	}), handlers.SubmitResponse)
	app.Get("/forms/:id/analytics", handlers.FormAnalytics)
	app.Get("/forms/:id/analytics/stream", handlers.StreamAnalytics)
	app.Get("/forms/:id/responses", handlers.ListResponses)

	// Protected Admin routes
	admin := app.Group("/", middleware.Protected())
	admin.Post("/forms", handlers.CreateForm)
	admin.Get("/forms", handlers.ListForms)
	admin.Get("/forms/:id", handlers.GetForm)
	admin.Patch("/forms/:id", handlers.UpdateForm)
	admin.Delete("/forms/:id", handlers.DeleteForm)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server running on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
