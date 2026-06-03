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
const cors = require('cors');
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
Extract ingredients from a meal object.
  TheMealDB API returns ingredients in a awkward format, 
  with up to 20 ingredient/measure pairs as separate fields (strIngredient1, strMeasure1, 
  strIngredient2, strMeasure2, etc.). This function loops through those fields and 
  constructs a more convenient array of ingredient objects.
*/
function extractIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        measure: measure || ""
      });
    }
  }

  return ingredients;
}

/*
Random Meal Route
  GET http://localhost:3000/meal/random
  this function runs.
*/
app.get("/meal/random", async (request, response) => {
  try {
    const apiResponse = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const apiData = await apiResponse.json();
    const meal = apiData.meals[0];

    response.json({
      id: meal.idMeal,
      name: meal.strMeal,

      category: meal.strCategory,
      area: meal.strArea,

      image: meal.strMealThumb,

      instructions: meal.strInstructions,
      youtube: meal.strYoutube,

      ingredients: extractIngredients(meal),

      protein: "-",
      fat: "-",
      sugar: "-"
    });


    // If reading file fails, backend sends error response.
  } catch (error) {
    console.error("Could not read meals data:", error);
    response.status(500).json({ error: "Could not load a random meal." });
  }
});

/* Healthcheck Endpoint for docker or 
  monitoring tools to verify the API is running and responsive.*/
app.get('/health', (req, response) => {
  response.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Starts backend at port 3000 we defined above
app.listen(PORT, () => {
  console.log(`Meal Generator API is running at http://localhost:${PORT}`);
});
