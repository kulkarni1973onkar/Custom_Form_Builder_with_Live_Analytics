// Data model for storing form responses with answers and submission time.

package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Answer struct {
	FieldID string      `json:"fieldId" bson:"fieldId"`
	Value   interface{} `json:"value" bson:"value"`
}

type Response struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	FormID      primitive.ObjectID `json:"formId" bson:"formId"`
	Version     int                `json:"version" bson:"version"`
	Answers     []Answer           `json:"answers" bson:"answers"`
	SubmittedAt time.Time          `json:"submittedAt" bson:"submittedAt"`
}
