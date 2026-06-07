/*
TheMealDB returns ingredients as up to 20 separate field pairs
(strIngredient1/strMeasure1 .. strIngredient20/strMeasure20).
This pulls those into a single array of {name, measure} objects.

Example input:
{
  idMeal: "52772",
  strMeal: "Teriyaki Chicken Casserole",
  strCategory: "Chicken",
  strArea: "Japanese",
  strInstructions: "...",
  strMealThumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  strYoutube: "https://www.youtube.com/watch?v=4aZr5hZXP_s",
  strIngredient1: "soy sauce",
  strMeasure1: "3/4 cup",
  strIngredient2: "water",
  strMeasure2: "1/2 cup",
  ...
} 

Extract the ingredients into a more usable format.
Example output:
[
  { name: "soy sauce", measure: "3/4 cup" },
  { name: "water", measure: "1/2 cup" },
  ...
] 
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
Converts a raw meal object from TheMealDB into a 
standardized meal response format.

Example output:
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
  ],
  protein: "-",
  fat: "-",
  sugar: "-"
} 
*/
function toMealResponse(meal) {
  return {
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
  };
}

export { extractIngredients, toMealResponse };
