package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)

type Job struct {
	Type    string
	Payload interface{}
	Retries int
}

var (
	JobQueue chan Job
	wg       sync.WaitGroup
)

// InitJobPool starts a pool of background workers.
func InitJobPool(workers int) {
	JobQueue = make(chan Job, 1000)

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go worker(i)
	}
	log.Printf("Background job pool started with %d workers", workers)
}

func SendWebhook(url string, payload interface{}) {
	JobQueue <- Job{
		Type:    "webhook",
		Payload: map[string]interface{}{"url": url, "data": payload},
		Retries: 3,
	}
}

func SendEmail(to, subject, html string) {
	JobQueue <- Job{
		Type:    "email",
		Payload: map[string]string{"to": to, "subject": subject, "html": html},
		Retries: 3,
	}
}

func worker(id int) {
	defer wg.Done()
	client := &http.Client{Timeout: 5 * time.Second}

	for job := range JobQueue {
		switch job.Type {
		case "webhook":
			processWebhook(client, job)
		case "email":
			processEmail(client, job)
		}
	}
}

func processEmail(client *http.Client, job Job) {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		log.Println("RESEND_API_KEY not set, skipping email")
		return
	}

	data, ok := job.Payload.(map[string]string)
	if !ok {
		return
	}

	payload := map[string]interface{}{
		"from":    "Form Builder <onboarding@resend.dev>",
		"to":      []string{data["to"]},
		"subject": data["subject"],
		"html":    data["html"],
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	for i := 0; i < job.Retries; i++ {
		resp, err := client.Do(req)
		if err == nil {
			defer resp.Body.Close()
			if resp.StatusCode < 300 {
				log.Printf("Email delivered to %s", data["to"])
				return
			}
			log.Printf("Email failed with status %d, retrying...", resp.StatusCode)
		}
		time.Sleep(2 * time.Second)
	}
}

func processWebhook(client *http.Client, job Job) {
	data, ok := job.Payload.(map[string]interface{})
	if !ok {
		return
	}
	
	urlStr, ok := data["url"].(string)
	if !ok || urlStr == "" {
		return
	}

	body, err := json.Marshal(data["data"])
	if err != nil {
		return
	}

	req, err := http.NewRequestWithContext(context.Background(), "POST", urlStr, bytes.NewBuffer(body))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")

	for i := 0; i < job.Retries; i++ {
		resp, err := client.Do(req)
		if err == nil {
			defer resp.Body.Close()
			if resp.StatusCode >= 200 && resp.StatusCode < 300 {
				log.Printf("Webhook delivered to %s", urlStr)
				return
			}
			log.Printf("Webhook failed to %s with status %d, retrying...", urlStr, resp.StatusCode)
		} else {
			log.Printf("Webhook failed to %s: %v, retrying...", urlStr, err)
		}
		time.Sleep(2 * time.Second)
	}
	log.Printf("Webhook completely failed to %s after %d retries", urlStr, job.Retries)
}
