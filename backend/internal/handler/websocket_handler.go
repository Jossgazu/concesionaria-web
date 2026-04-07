package handler

import (
	"context"
	"encoding/json"
	"log"
	"sync"

	"github.com/concesionaria-web/backend/internal/middleware"
	"github.com/concesionaria-web/backend/internal/redis"
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

func (h *WebSocketHandler) Handle(c *websocket.Conn) {
	token := c.Query("token")
	if token == "" {
		log.Printf("WebSocket connection rejected: missing token")
		c.Close()
		return
	}

	userID, err := middleware.GetUserIDFromToken(token)
	if err != nil {
		log.Printf("WebSocket connection rejected: invalid token: %v", err)
		c.Close()
		return
	}

	ctx := context.Background()

	h.mu.Lock()
	h.connections[userID.String()] = c
	h.mu.Unlock()

	log.Printf("WebSocket connected: user=%s", userID.String())

	if h.redisClient != nil && h.redisClient.IsConnected() {
		channel := "user:" + userID.String() + ":messages"
		go h.subscribeToChannel(ctx, c, channel)
	}

	for {
		messageType, msg, err := c.ReadMessage()
		if err != nil {
			log.Printf("WebSocket read error for user %s: %v", userID.String(), err)
			break
		}

		if messageType == websocket.CloseMessage {
			break
		}

		log.Printf("WebSocket message from %s: %s", userID.String(), string(msg))
	}

	h.mu.Lock()
	delete(h.connections, userID.String())
	h.mu.Unlock()

	log.Printf("WebSocket disconnected: user=%s", userID.String())
}

func (h *WebSocketHandler) subscribeToChannel(ctx context.Context, c *websocket.Conn, channel string) {
	if h.redisClient == nil || !h.redisClient.IsConnected() {
		return
	}

	pubsub := h.redisClient.Subscribe(ctx, channel)
	if pubsub == nil {
		return
	}
	defer pubsub.Close()

	ch := pubsub.Channel()
	for msg := range ch {
		var event map[string]interface{}
		if json.Unmarshal([]byte(msg.Payload), &event) == nil {
			if err := c.WriteJSON(event); err != nil {
				log.Printf("WebSocket send error: %v", err)
				return
			}
		}
	}
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
