FROM golang:1.22-alpine

WORKDIR /app

# Install dependencies first (caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and build
COPY . .
RUN go build -o main .

EXPOSE 8080
CMD ["./main"]
