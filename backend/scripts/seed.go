package main

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/kulkarni1973onkar/dune-security-assignment/backend/models"
)

func main() {
	_ = godotenv.Load("../.env") // Load .env from root

	uri := "mongodb://localhost:27017"
	dbName := "formbuilder"

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.TODO())

	db := client.Database(dbName)
	formsCol := db.Collection("forms")
	resCol := db.Collection("responses")

	// Clear existing? Wait, maybe just insert new test form
	fmt.Println("Seeding test data...")

	f1 := models.Form{
		ID:          primitive.NewObjectID(),
		OwnerID:     primitive.NewObjectID(),
		Title:       "Demo Form - Customer Feedback",
		Description: "A pre-seeded form to test analytics.",
		Status:      "published",
		Slug:        "demo-feedback-" + strings.ToLower(primitive.NewObjectID().Hex()[:4]),
		Version:     1,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Fields: []models.Field{
			{ID: "f_text", Type: "text", Label: "Your Name", Required: true},
			{
				ID:       "f_mc",
				Type:     "multiple",
				Label:    "Favorite Color",
				Required: true,
				Options:  []string{"Red", "Blue", "Green", "Other"},
			},
			{
				ID:       "f_rating",
				Type:     "rating",
				Label:    "Rate our service",
				Required: true,
				Min:      ptr(1),
				Max:      ptr(5),
			},
		},
	}

	_, err = formsCol.InsertOne(context.TODO(), f1)
	if err != nil {
		log.Fatalf("Insert form error: %v", err)
	}

	// Insert 20 random responses
	var responses []interface{}
	for i := 0; i < 20; i++ {
		score := 3 + (i % 3) // 3, 4, 5
		color := "Blue"
		if i%3 == 0 {
			color = "Red"
		} else if i%5 == 0 {
			color = "Green"
		}

		r := models.Response{
			ID:          primitive.NewObjectID(),
			FormID:      f1.ID,
			Version:     1,
			SubmittedAt: time.Now().Add(-time.Duration(i*2) * time.Hour), // stagger
			Answers: []models.Answer{
				{FieldID: "f_text", Value: fmt.Sprintf("User %d", i)},
				{FieldID: "f_mc", Value: color},
				{FieldID: "f_rating", Value: float64(score)},
			},
		}
		responses = append(responses, r)
	}

	_, err = resCol.InsertMany(context.TODO(), responses)
	if err != nil {
		log.Fatalf("Insert responses error: %v", err)
	}

	fmt.Printf("✅ Seeding complete! Check form: /public/forms/%s\n", f1.Slug)
}

func ptr[T any](v T) *T { return &v }
