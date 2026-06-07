import { Router } from "express";
import { fetchRandomMeal } from "../services/mealdbService.js";
import { toMealResponse } from "../transformers/mealTransformer.js";

/*
Express router for meal-related endpoints. 
This file defines the API routes for meals,
*/
const router = Router();

/*
GET /meal/random
  Fetches a random meal from TheMealDB and returns it in our normalized shape.

Example request:
GET http://localhost:3000/meal/random

Example response:
{
  id: "52772",
  name: "Teriyaki Chicken Casserole",
  category: "Chicken",
  area: "Japanese",
  image: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  instructions: "...",
  youtube: "https://www.youtube.com/watch?v=4aZr5hZXP_s",
  ingredients: [
    { name: "soy sauce", measure: "3/4 cup" },
    { name: "water", measure: "1/2 cup" },
    ...
  ]
} 

Example request when fetching from deployed backend (replace with your 
deployed URL):
GET https://your-deployed-backend.com/meal/random
*/
router.get("/random", async (request, response) => {
  try {
    // call the service to fetch a random meal from TheMealDB
    const meal = await fetchRandomMeal();
    // transform the raw meal data into our API response format
    // the code located at /transformers/mealTransformer.js
    response.json(toMealResponse(meal));
  } catch (error) {
    console.error("Could not fetch a random meal:", error);
    response.status(500).json({ error: "Could not load a random meal." });
  }
});

export { router as mealRouter };
