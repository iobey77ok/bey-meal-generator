/* webpage logic/UI */

import { useState } from "react";

// send requests to this URL to get random meals from backend.
const API_URL = "http://localhost:3000/meal/random";

function normalizeMeal(data) {
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
  // tracks whether the meal image has loaded, to show loading state until then.
  const [imageLoaded, setImageLoaded] = useState(false);

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
      // When new meal is generated, reset image loaded state to show loading until new image loads.
      setImageLoaded(false);
      // Save meal into React state. This makes React redraw the page.
      setMeal(data);


      // If anything failed, clear meal and show error.
    } catch (requestError) {
      setMeal(null);
      setError(err.message || "Something went wrong.");
      // Stop loading, whether success or error.
    } finally {
      setIsLoading(false);
    }
  }

  // the UI that React shows. CSS decorates it.
  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark">🍲</span>
            <span className="brand-name">Bey Meal Generator</span>
          </div>
          <button className="btn btn-ghost" onClick={handleGenerateMeal} disabled={isLoading}>
            New meal
          </button>
        </div>
      </header>

      <main className="app-main">
        {!meal && !isLoading && !error && (
          <section className="hero">
            <div className="hero-badge">Random recipe finder</div>
            <h1>What&apos;s cooking today?</h1>
            <p>
              Click generate to discover a random meal with picture, ingredients,
              instructions, and video when available.
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleGenerateMeal}>
              Generate a Meal
            </button>
          </section>
        )}

        {isLoading && (
          <section className="state-card">
            <div className="spinner" />
            <p>Finding your next meal...</p>
          </section>
        )}

        {error && (
          <section className="state-card">
            <h2>Oops, something went wrong</h2>
            <p className="error-text">{error}</p>
            <button className="btn btn-primary" onClick={handleGenerateMeal}>
              Try again
            </button>
          </section>
        )}

        {meal && !isLoading && (
          <article className="meal-card">
            <div className="meal-image-wrap">
              {meal.image ? (
                <img
                  src={meal.image}
                  alt={meal.name}
                  className={imageLoaded ? "meal-image loaded" : "meal-image"}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="meal-image-placeholder">No image</div>
              )}
              <div className="meal-tags">
                {meal.category && <span>{meal.category}</span>}
                {meal.area && <span>{meal.area}</span>}
              </div>
            </div>

            <div className="meal-body">
              <h2>{meal.name}</h2>

              <div className="meta-grid">
                {meal.protein !== "" && <div><span>Protein</span><strong>{meal.protein}</strong></div>}
                {meal.fat !== "" && <div><span>Fat</span><strong>{meal.fat}</strong></div>}
                {meal.sugar !== "" && <div><span>Sugar</span><strong>{meal.sugar}</strong></div>}
              </div>

              {Array.isArray(meal.ingredients) && meal.ingredients.length > 0 && (
                <section className="section">
                  <h3>Ingredients</h3>
                  <ul className="ingredients-list">
                    {meal.ingredients.map((item, index) => (
                      <li key={index}>
                        <span>{item.name}</span>
                        <span>{item.measure}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {meal.instructions && (
                <section className="section">
                  <h3>Instructions</h3>
                  <div className="instructions">
                    {meal.instructions.split(/\r?\n/).map((line, index) =>
                      line.trim() ? <p key={index}>{line.trim()}</p> : null
                    )}
                  </div>
                </section>
              )}

              {meal.youtube && (
                <section className="section">
                  <h3>YouTube Video</h3>
                  <a className="yt-link" href={meal.youtube} target="_blank" rel="noreferrer">
                    Watch on YouTube
                  </a>
                </section>
              )}

              <button className="btn btn-primary" onClick={handleGenerateMeal}>
                Generate another meal
              </button>
            </div>
          </article>
        )}
      </main>
    </main>
  );
}

export default App;
