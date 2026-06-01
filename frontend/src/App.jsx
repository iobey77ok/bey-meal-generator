/* webpage logic/UI */

import { useState } from "react";

// send requests to this URL to get random meals from backend.
const API_URL = "http://localhost:3000/meal/random";

function App() {
  /*
  meal stores the meal data from backend.
  setMeal(...) updates it.
  */
  const [meal, setMeal] = useState(null);
  // tracks whether the app is waiting for a response from the backend.
  const [isLoading, setIsLoading] = useState(false);
  // show an error message if the backend request fails.
  const [error, setError] = useState("");

  // called when the user clicks the "Generate Meal" button.
  // async means the function can wait for slow things, like API requests.
  async function handleGenerateMeal() {
    // show loading state and clear any previous error message.
    setIsLoading(true);
    setError("");

    try {
      // fetch() sends an HTTP request to Express backend. -> GET /meal/random
      //    await means wait until backend replies.
      const response = await fetch(API_URL);

      // If backend fails, create an error.
      if (!response.ok) {
        throw new Error("The server could not generate a meal.");
      }

      // Convert backend JSON response into JavaScript object.
      const data = await response.json();
      // Save meal into React state. This makes React redraw the page.
      setMeal(data);
      // If anything failed, clear meal and show error.
    } catch (requestError) {
      setMeal(null);
      setError(requestError.message);
      // Stop loading, whether success or error.
    } finally {
      setIsLoading(false);
    }
  }

  // the UI that React shows. CSS decorates it.
  return (
    <main className="app">
      <section className="meal-panel" aria-labelledby="page-title">
        <p className="eyebrow">Meal Generator</p>
        <h1 id="page-title">Find a random meal </h1>
        <p className="intro">
          Click the button to request one meal from the Express API.
        </p>

        {/* When User Clicks Button, call handleGenerateMeal()*/}
        <button onClick={handleGenerateMeal} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Meal"}
        </button>

        {error && <p className="error">{error}</p>}

        {/* if meal has data, show meal result */}
        {meal && (
          <div className="meal-result">
            <img src={meal.image} alt={meal.name} className="meal-image" />
            <h2>{meal.name}</h2>
            <p className="category">{meal.category}</p>

            <dl className="nutrition-list">
              <div>
                <dt>Protein</dt>
                <dd>{meal.protein}</dd>
              </div>
              <div>
                <dt>Fat</dt>
                <dd>{meal.fat}</dd>
              </div>
              <div>
                <dt>Sugar</dt>
                <dd>{meal.sugar}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
