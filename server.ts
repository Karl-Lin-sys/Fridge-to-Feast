import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  app.post("/api/analyze-fridge", async (req, res) => {
    try {
      const { image, mimeType, dietaryRestrictions } = req.body;

      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }
      
      const restrictionsText = dietaryRestrictions && dietaryRestrictions.length > 0
        ? `Adhere strictly to the following dietary restrictions: ${dietaryRestrictions.join(', ')}.`
        : "No specific dietary restrictions.";

      const prompt = `
        You are an expert culinary assistant. Analyze this image of a fridge or ingredients.
        1. Identify all visible food items and ingredients.
        2. Suggest 3 cohesive recipes that utilize these ingredients as the base.
        3. ${restrictionsText}
        4. For each recipe, list the required ingredients, and clearly separate the ones found in the image from the "missing ingredients" the user needs to buy.
        5. Provide a step-by-step cooking guide.
      `;

      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          identifiedIngredients: {
            type: Type.ARRAY,
            description: "List of ingredients identified in the image.",
            items: { type: Type.STRING },
          },
          suggestedRecipes: {
            type: Type.ARRAY,
            description: "List of exactly 3 recipe suggestions.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A unique identifier string" },
                title: { type: Type.STRING },
                difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
                prepTimeMinutes: { type: Type.INTEGER },
                calories: { type: Type.INTEGER },
                ingredients: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Full list of required ingredients"
                },
                missingIngredients: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Ingredients needed for the recipe that were NOT found in the image"
                },
                steps: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Step-by-step cooking instructions"
                }
              },
              required: ["id", "title", "difficulty", "prepTimeMinutes", "calories", "ingredients", "missingIngredients", "steps"]
            }
          }
        },
        required: ["identifiedIngredients", "suggestedRecipes"]
      };

      // Depending on @google/genai version, generation setup varies
      // This is for ^2.4.0
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          prompt,
          {
            inlineData: {
              data: image,
              mimeType: mimeType || "image/jpeg"
            }
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      });

      if (!response.text) {
        throw new Error("No text returned from Gemini");
      }

      const result = JSON.parse(response.text);
      res.json(result);
    } catch (error) {
      console.error("Error analyzing fridge:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
