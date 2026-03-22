package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"

	"github.com/kulkarni1973onkar/dune-security-assignment/backend/models"
)

// POST /api/forms/generate
// Uses Ollama local API to generate form fields from a prompt.
func GenerateForm(c *fiber.Ctx) error {
	var body struct {
		Prompt string `json:"prompt"`
	}

	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	if body.Prompt == "" {
		return fiber.NewError(fiber.StatusBadRequest, "prompt is required")
	}

	systemPrompt := `
You are an expert form designer. Given the user's prompt, generate a JSON array of fields corresponding to the form.
Each field must follow this JSON schema:
{
  "id": "string (unique snake_case)",
  "type": "string (must be one of: text, mc, checkbox, rating, number)",
  "label": "string",
  "required": boolean,
  "options": ["string", "string"] (only if type is mc or checkbox),
  "min": number (only if type is rating),
  "max": number (only if type is rating)
}
Return ONLY the JSON array of fields without markdown formatting, backticks, or any additional text.
`
	
	ollamaReq := map[string]interface{}{
		"model":  "llama3.2", // Assuming user has standard 3.2 locally.
		"prompt": systemPrompt + "\nUser Prompt: " + body.Prompt,
		"stream": false,
	}
	reqData, _ := json.Marshal(ollamaReq)

	ollamaHost := "http://localhost:11434/api/generate"
	resp, err := http.Post(ollamaHost, "application/json", bytes.NewBuffer(reqData))
	if err != nil {
		return fiber.NewError(fiber.StatusServiceUnavailable, "Failed to connect to local Ollama instance: "+err.Error())
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fiber.NewError(fiber.StatusServiceUnavailable, "Ollama returned error")
	}

	var ollamaResp struct {
		Response string `json:"response"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&ollamaResp); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to decode Ollama response")
	}

	// Clean up markdown block if it replied with them.
	raw := strings.TrimSpace(ollamaResp.Response)
	if strings.HasPrefix(raw, "```json") {
		raw = strings.TrimPrefix(raw, "```json")
		raw = strings.TrimSuffix(raw, "```")
		raw = strings.TrimSpace(raw)
	}

	var fields []models.Field
	if err := json.Unmarshal([]byte(raw), &fields); err != nil {
		// Log the error and the raw response
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to parse generated schema as JSON")
	}

	return c.JSON(fiber.Map{
		"fields": fields,
	})
}
