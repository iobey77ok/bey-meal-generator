/*
This file is responsible for communicating with the backend API. 
It abstracts away the details of the API endpoints and response shapes, 
providing a clean interface for the rest of the frontend to use.

in easy words: this file is the "translator" between the frontend and backend.
*/

import { normalizeMeal } from "./normalizeMeal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/*
This helper function centralizes the logic for making API requests 
and handling errors.

path is the endpoint path (e.g. "/meal/random").
*/
async function fetchJson(path, errorMessage) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

// Single place that knows about backend endpoints and response shapes.
// Components only ever see normalized meal objects.
export const mealApi = {
  async getRandomMeal() {
    const data = await fetchJson("/meal/random", "The server could not generate a meal.");
    return normalizeMeal(data);
  },
};
