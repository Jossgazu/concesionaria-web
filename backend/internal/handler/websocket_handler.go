package handler

import (
	"context"
	"encoding/json"
	"log"
	"sync"

	"github.com/concesionaria-web/backend/internal/middleware"
	"github.com/concesionaria-web/backend/internal/redis"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

type WebSocketHandler struct {
	redisClient *redis.Client
	connections map[string]*websocket.Conn
	mu          sync.RWMutex
}

func NewWebSocketHandler(redisClient *redis.Client) *WebSocketHandler {
	return &WebSocketHandler{
		redisClient: redisClient,
		connections: make(map[string]*websocket.Conn),
	}
}

func (h *WebSocketHandler) Upgrade(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		token := c.Query("token")
		if token == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing token"})
		}

		userID, err := middleware.GetUserIDFromToken(token)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid token"})
		}

		c.Locals("user_id", userID.String())
		return c.Next()
	}
	return fiber.ErrUpgradeRequired
}

func (h *WebSocketHandler) Handle(c *websocket.Conn) {
	userID := c.Locals("user_id").(string)
	ctx := context.Background()

	h.mu.Lock()
	h.connections[userID] = c
	h.mu.Unlock()

	log.Printf("WebSocket connected: user=%s", userID)

	if h.redisClient != nil && h.redisClient.IsConnected() {
		channel := "user:" + userID + ":messages"
		pubsub := h.redisClient.Subscribe(ctx, channel)
		if pubsub != nil {
			defer pubsub.Close()
			ch := pubsub.Channel()
			for msg := range ch {
				var event map[string]interface{}
				if json.Unmarshal([]byte(msg.Payload), &event) == nil {
					if err := c.WriteJSON(event); err != nil {
						log.Printf("WebSocket send error: %v", err)
						break
					}
				}
			}
		}
	}

	h.mu.Lock()
	delete(h.connections, userID)
	h.mu.Unlock()

	log.Printf("WebSocket disconnected: user=%s", userID)
}

func (h *WebSocketHandler) SendToUser(userID string, message interface{}) error {
	h.mu.RLock()
	conn, exists := h.connections[userID]
	h.mu.RUnlock()

	if !exists {
		return nil
	}

	return conn.WriteJSON(message)
}

func (h *WebSocketHandler) Broadcast(message interface{}) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	for _, conn := range h.connections {
		if err := conn.WriteJSON(message); err != nil {
			log.Printf("WebSocket broadcast error: %v", err)
		}
	}
}

func (h *WebSocketHandler) GetConnectionCount() int {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return len(h.connections)
}
