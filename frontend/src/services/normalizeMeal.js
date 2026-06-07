// Translates raw API responses (local JSON or TheMealDB shape) into one
// canonical meal object, so the rest of the app never has to branch on source.

/*
Syntax note: the nullish coalescing operator (??) is used here to provide default values for each field.
  It checks if the left-hand side is null or undefined, and if so, it evaluates and returns the right-hand side.
  This allows the function to handle cases where certain fields might be missing from the input data, 
  ensuring that the returned meal object always has a consistent structure with default values where necessary.

We get data from: TheMealDB API.
*/
export function normalizeMeal(data) {
  return {
    id: data.id ?? data.idMeal ?? "",
    name: data.name ?? data.strMeal ?? "Unknown meal",
    category: data.category ?? data.strCategory ?? "",
    area: data.area ?? data.strArea ?? "",
    image: data.image ?? data.strMealThumb ?? "",
    instructions: data.instructions ?? data.strInstructions ?? "",
    youtube: data.youtube ?? data.strYoutube ?? "",
    ingredients: data.ingredients ?? [],
    protein: data.protein ?? "",
    fat: data.fat ?? "",
    sugar: data.sugar ?? "",
  };
}
