// Handler for streaming real-time form analytics via WebSockets.

package handlers

import (
	"context"
	"encoding/json"
	"log"

	"github.com/gofiber/contrib/websocket"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// WsAnalytics handles WebSocket connections for real-time form analytics.
func WsAnalytics(c *websocket.Conn) {
	respCol := c.Locals("responses").(*mongo.Collection)

	formOID, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		c.WriteMessage(websocket.TextMessage, []byte(`{"error": "invalid id"}`))
		return
	}
	formID := formOID.Hex()

	ch, unsubscribe := rtSubscribe(formID)
	defer unsubscribe()

	// Initial payload on connect
	payload, err := computeAnalytics(context.TODO(), respCol, formOID) // Assuming computeAnalytics doesn't strictly need *fiber.Ctx if we mock/use background context
	if err == nil {
		b, _ := json.Marshal(payload)
		if err := c.WriteMessage(websocket.TextMessage, b); err != nil {
			log.Println("ws write error:", err)
			return
		}
	}

	// Listen for drops or messages to handle close
	go func() {
		for {
			if _, _, err := c.ReadMessage(); err != nil {
				return // client disconnected
			}
		}
	}()

	for range ch {
		payload, err := computeAnalytics(context.TODO(), respCol, formOID)
		if err == nil {
			b, _ := json.Marshal(payload)
			if err := c.WriteMessage(websocket.TextMessage, b); err != nil {
				log.Println("ws broadcast error:", err)
				return
			}
		}
	}
}
