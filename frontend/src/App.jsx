import { useState } from "react";

const API_URL = "http://localhost:3000/meal/random";

function App() {
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerateMeal() {
    setIsLoading(true);
    setError("");

    try {
      // fetch sends an HTTP request from React to the Express backend.
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("The server could not generate a meal.");
      }

      const data = await response.json();
      setMeal(data);
    } catch (requestError) {
      setMeal(null);
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="meal-panel" aria-labelledby="page-title">
        <p className="eyebrow">Meal Generator</p>
        <h1 id="page-title">Find a random meal</h1>
        <p className="intro">
          Click the button to request one meal from the Express API.
        </p>

        <button onClick={handleGenerateMeal} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Meal"}
        </button>

        {error && <p className="error">{error}</p>}

        {meal && (
          <div className="meal-result">
            <h2>{meal.name}</h2>
            <p className="category">{meal.category}</p>

            <dl className="nutrition-list">
              <div>
                <dt>Protein</dt>
                <dd>{meal.protein}g</dd>
              </div>
              <div>
                <dt>Fat</dt>
                <dd>{meal.fat}g</dd>
              </div>
              <div>
                <dt>Sugar</dt>
                <dd>{meal.sugar}g</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
