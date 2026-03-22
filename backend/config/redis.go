package config

import (
	"context"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func InitRedis() {
	url := os.Getenv("REDIS_URL")
	if url == "" {
		log.Println("REDIS_URL not set, skipping Redis initialization")
		return
	}

	opts, err := redis.ParseURL(url)
	if err != nil {
		log.Fatalf("Failed to parse REDIS_URL: %v", err)
	}

	client := redis.NewClient(opts)
	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		log.Fatalf("Redis ping failed: %v", err)
	}

	RedisClient = client
	log.Println("Connected to Redis")
}
