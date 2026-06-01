/*
express creates the web server/API
cors allows frontend 5173 to talk to backend 3000
*/

import express from "express";
import cors from "cors";
// Lets Node read files, like meals.json.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

/* backend/API logic */


/*
create server
  app is your Express server.
  It will run on port 3000.
*/
const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Find meals.json
// create full path to backend/data/meals.json
const mealsFilePath = path.join(__dirname, "data", "meals.json");

// CORS lets the React app on a different port request data from this API.
app.use(cors());


/*
Home Route
  when open http://localhost:3000 -> It returns basic API info.
*/
app.get("/", (request, response) => {
  response.json({
    message: "Meal Generator API",
    randomMealEndpoint: "/meal/random"
  });
});

/*
Random Meal Route
  GET http://localhost:3000/meal/random
  this function runs.
*/
app.get("/meal/random", async (request, response) => {
  try {
    // reads meals.json.
    const mealsFile = await readFile(mealsFilePath, "utf8");
    // Turns JSON text into JavaScript array.
    const meals = JSON.parse(mealsFile);

    if (!Array.isArray(meals) || meals.length === 0) {
      return response.status(500).json({ error: "No meals are available." });
    }

    // Chooses random position in the array.
    const randomIndex = Math.floor(Math.random() * meals.length);
    // Gets that meal.
    const randomMeal = meals[randomIndex];
    // Sends the meal back to frontend as JSON.
    response.json(randomMeal);


    // If reading file fails, backend sends error response.
  } catch (error) {
    console.error("Could not read meals data:", error);
    response.status(500).json({ error: "Could not load a random meal." });
  }
});


// Starts backend at port 3000 we defined above
app.listen(PORT, () => {
  console.log(`Meal Generator API is running at http://localhost:${PORT}`);
});
