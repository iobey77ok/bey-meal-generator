const RANDOM_MEAL_URL = "https://www.themealdb.com/api/json/v1/1/random.php";


/*
Fetches a random meal from the MealDB API.
*/
async function fetchRandomMeal() {
  const response = await fetch(RANDOM_MEAL_URL);
  const data = await response.json();
  return data.meals[0];
}

export { fetchRandomMeal };
