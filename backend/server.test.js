import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "./server.js";
import { extractIngredients } from "./transformers/mealTransformer.js";

describe("extractIngredients", () => {
  it("builds an array of {name, measure} pairs from strIngredientN/strMeasureN fields", () => {
    const meal = {
      strIngredient1: "Chicken",
      strMeasure1: "200g",
      strIngredient2: "Rice",
      strMeasure2: "1 cup"
    };

    expect(extractIngredients(meal)).toEqual([
      { name: "Chicken", measure: "200g" },
      { name: "Rice", measure: "1 cup" }
    ]);
  });

  it("skips entries whose ingredient name is empty or whitespace", () => {
    const meal = {
      strIngredient1: "Salt",
      strMeasure1: "1 tsp",
      strIngredient2: "",
      strMeasure2: "2 tbsp",
      strIngredient3: "   ",
      strMeasure3: "3 tbsp"
    };

    expect(extractIngredients(meal)).toEqual([{ name: "Salt", measure: "1 tsp" }]);
  });

  it("defaults measure to an empty string when missing", () => {
    const meal = { strIngredient1: "Pepper", strMeasure1: null };

    expect(extractIngredients(meal)).toEqual([{ name: "Pepper", measure: "" }]);
  });

  it("only reads up to 20 ingredient/measure pairs", () => {
    const meal = { strIngredient21: "Truffle", strMeasure21: "1 shaving" };

    expect(extractIngredients(meal)).toEqual([]);
  });

  it("returns an empty array when the meal has no ingredients", () => {
    expect(extractIngredients({})).toEqual([]);
  });
});

describe("GET /", () => {
  it("returns basic API info", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Meal Generator API",
      randomMealEndpoint: "/meal/random"
    });
  });
});

describe("GET /health", () => {
  it("reports the service as up with a timestamp", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("UP");
    expect(typeof response.body.timestamp).toBe("string");
    expect(new Date(response.body.timestamp).toString()).not.toBe("Invalid Date");
  });
});

describe("GET /meal/random", () => {
  const sampleMeal = {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken Casserole",
    strCategory: "Chicken",
    strArea: "Japanese",
    strMealThumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    strInstructions: "Preheat oven to 350 F...",
    strYoutube: "https://www.youtube.com/watch?v=4aZr5hZXP_s",
    strIngredient1: "soy sauce",
    strMeasure1: "3/4 cup",
    strIngredient2: "water",
    strMeasure2: "1/2 cup",
    strIngredient3: "",
    strMeasure3: ""
  };

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches a random meal from TheMealDB and returns it in the API's normalized shape", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ meals: [sampleMeal] })
    });

    const response = await request(app).get("/meal/random");

    expect(fetch).toHaveBeenCalledWith(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "52772",
      name: "Teriyaki Chicken Casserole",
      category: "Chicken",
      area: "Japanese",
      image: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      instructions: "Preheat oven to 350 F...",
      youtube: "https://www.youtube.com/watch?v=4aZr5hZXP_s",
      ingredients: [
        { name: "soy sauce", measure: "3/4 cup" },
        { name: "water", measure: "1/2 cup" }
      ],
      protein: "-",
      fat: "-",
      sugar: "-"
    });
  });

  it("returns a 500 with an error message when the upstream request fails", async () => {
    fetch.mockRejectedValue(new Error("network down"));

    const response = await request(app).get("/meal/random");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Could not load a random meal." });
  });
});
