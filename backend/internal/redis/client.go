package redis

import (
	"context"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type Client struct {
	rdb *redis.Client
}

var Instance *Client

func NewClient(redisURL string) *Client {
	if redisURL == "" {
		log.Println("Redis URL not configured, Redis will be disabled")
		return &Client{rdb: nil}
	}

	rdb := redis.NewClient(&redis.Options{
		Addr:     redisURL,
		Password: "",
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Printf("Failed to connect to Redis: %v, Redis will be disabled", err)
		return &Client{rdb: nil}
	}

	log.Println("Connected to Redis")
	return &Client{rdb: rdb}
}

func (c *Client) IsConnected() bool {
	return c != nil && c.rdb != nil
}

func (c *Client) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	if !c.IsConnected() {
		return nil
	}
	return c.rdb.Set(ctx, key, value, expiration).Err()
}

func (c *Client) Get(ctx context.Context, key string) (string, error) {
	if !c.IsConnected() {
		return "", redis.Nil
	}
	return c.rdb.Get(ctx, key).Result()
}

func (c *Client) Del(ctx context.Context, keys ...string) error {
	if !c.IsConnected() {
		return nil
	}
	return c.rdb.Del(ctx, keys...).Err()
}

func (c *Client) Incr(ctx context.Context, key string) (int64, error) {
	if !c.IsConnected() {
		return 0, nil
	}
	return c.rdb.Incr(ctx, key).Result()
}

func (c *Client) Publish(ctx context.Context, channel string, message interface{}) error {
	if !c.IsConnected() {
		return nil
	}
	return c.rdb.Publish(ctx, channel, message).Err()
}

func (c *Client) Subscribe(ctx context.Context, channel string) *redis.PubSub {
	if !c.IsConnected() {
		return nil
	}
	return c.rdb.Subscribe(ctx, channel)
}

func (c *Client) Close() error {
	if !c.IsConnected() {
		return nil
	}
	return c.rdb.Close()
}
