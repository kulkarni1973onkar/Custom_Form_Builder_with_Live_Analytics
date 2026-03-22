package repository

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"github.com/kulkarni1973onkar/dune-security-assignment/backend/models"
)

type FormRepository interface {
	Create(ctx context.Context, form models.Form) (models.Form, error)
	GetByID(ctx context.Context, id primitive.ObjectID) (models.Form, error)
}

type formRepository struct {
	collection *mongo.Collection
}

func NewFormRepository(collection *mongo.Collection) FormRepository {
	return &formRepository{collection}
}

func (r *formRepository) Create(ctx context.Context, form models.Form) (models.Form, error) {
	res, err := r.collection.InsertOne(ctx, form)
	if err != nil {
		return form, err
	}
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		form.ID = oid
	}
	return form, nil
}

func (r *formRepository) GetByID(ctx context.Context, id primitive.ObjectID) (models.Form, error) {
	var form models.Form
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&form)
	return form, err
}
