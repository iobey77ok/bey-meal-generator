import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mealsFilePath = path.join(__dirname, "data", "meals.json");

// CORS lets the React app on a different port request data from this API.
app.use(cors());

app.get("/", (request, response) => {
  response.json({
    message: "Meal Generator API",
    randomMealEndpoint: "/meal/random"
  });
});

app.get("/meal/random", async (request, response) => {
  try {
    const mealsFile = await readFile(mealsFilePath, "utf8");
    const meals = JSON.parse(mealsFile);

    if (!Array.isArray(meals) || meals.length === 0) {
      return response.status(500).json({ error: "No meals are available." });
    }

    const randomIndex = Math.floor(Math.random() * meals.length);
    const randomMeal = meals[randomIndex];

    response.json(randomMeal);
  } catch (error) {
    console.error("Could not read meals data:", error);
    response.status(500).json({ error: "Could not load a random meal." });
  }
});

app.listen(PORT, () => {
  console.log(`Meal Generator API is running at http://localhost:${PORT}`);
});
