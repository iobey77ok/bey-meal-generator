/* webpage logic/UI */

import { useState } from "react";
import * as Lucide from "lucide-react";

// The base URL for our backend API. Kept outside the component because it's a global constant.
const API_URL = "http://localhost:3000/meal/random";

/**
 * DATA NORMALIZER: Standardizes the meal data format.
 * * Why we need this: 
 * Our app gets data from two places: our local JSON file (uses 'name', 'image') 
 * and TheMealDB API (uses 'strMeal', 'strMealThumb'). 
 * * This function translates both styles into a single, reliable object structure 
 * so our frontend UI code stays clean and never breaks due to missing fields.
 */
function normalizeMeal(data) {
  return {
    // Read this as: Use data.id if it exists. 
    // If not, try data.idMeal. 
    // If that doesn't exist either, fall back to an empty string "".
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
  // Core Data States
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState("");

  /**
   * SOLID Design Principle: UI Status State Machine
   * Instead of multiple booleans (isLoading, isError) which can conflict, we use a single string.
   * Allowed values: 'idle' (welcome screen), 'loading', 'error', 'success'.
   */
  const [status, setStatus] = useState("idle");

  // Tracks visual state of the image asset specifically
  const [imageLoaded, setImageLoaded] = useState(false);

  /**
   * Orchestrates the API workflow. 
   * Designed to be highly extensible: if you want to support filters or searches later,
   * you can easily add parameters to this function.
   */
  async function handleGenerateMeal() {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("The server could not generate a meal.");
      }

      const data = await response.json();

      setImageLoaded(false); // Reset image visibility trigger for the new asset
      setMeal(normalizeMeal(data)); // Normalize ensures the object shape matches expectations perfectly
      setStatus("success");
    } catch (requestError) {
      setMeal(null);
      setError(requestError.message || "Something went wrong.");
      setStatus("error");
    }
  }

  /**
   * Clear all states to cleanly reset the view machine back to the homepage.
   */
  function handleGoHome() {
    setMeal(null);
    setError("");
    setImageLoaded(false);
    setStatus("idle");
  }

  // Convenient derived flags to keep our JSX clean and highly readable
  const isIdle = status === "idle";
  const isLoading = status === "loading";
  const isError = status === "error";
  const isSuccess = status === "success" && meal;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <button className="brand" onClick={handleGoHome} type="button">
            <span className="brand-icon">
              <Lucide.UtensilsCrossed size={22} />
            </span>
            <span className="brand-name">Bey Meal Generator</span>
          </button>
          <button className="btn btn-ghost" onClick={handleGenerateMeal} disabled={isLoading}>
            <Lucide.Shuffle size={16} />
            <span>New meal</span>
          </button>
        </div>
      </header>

      <main className="app-main">

        {/* PHASE 1: IDLE / WELCOME SCREEN */}
        {isIdle && (
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

        {/* PHASE 2: LOADING */}
        {isLoading && (
          <section className="state-card">
            <div className="spinner" />
            <p>Finding your next meal...</p>
          </section>
        )}

        {/* PHASE 3: ERROR */}
        {isError && (
          <section className="state-card">
            <h2>Oops, something went wrong</h2>
            <p className="error-text">{error}</p>
            <button className="btn btn-primary" onClick={handleGenerateMeal}>
              Try again
            </button>
          </section>
        )}

        {/* PHASE 4: SUCCESS / MEAL DISPLAY */}
        {isSuccess && (
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
                {meal.category &&
                  <span className="tag-category">
                    <Lucide.ChefHat size={12} />
                    {meal.category}
                  </span>}

                {meal.area &&
                  <span className="tag-area">
                    <Lucide.Globe size={12} />
                    {meal.area}
                  </span>}
              </div>
            </div>

            <div className="meal-body">
              <h2>{meal.name}</h2>


              {/* <div className="meta-grid">
                {meal.protein !== "" && <div><span>Protein</span><strong>{meal.protein}</strong></div>}
                {meal.fat !== "" && <div><span>Fat</span><strong>{meal.fat}</strong></div>}
                {meal.sugar !== "" && <div><span>Sugar</span><strong>{meal.sugar}</strong></div>}
              </div> */}


              {Array.isArray(meal.ingredients) && meal.ingredients.length > 0 && (
                <section className="section">
                  <h3>Ingredients</h3>
                  <ul className="ingredients-list">
                    {meal.ingredients.map((item, index) => (
                      <li key={index}>
                        <span className="ingredient-name">
                          <span className="ingredient-dot"></span>
                          {item.name}
                        </span>
                        <span className="ingredient-measure">{item.measure}</span>
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
                  <a className="yt-link" href={meal.youtube} target="_blank" rel="noreferrer">
                    <span className="yt-link-left">
                      <Lucide.PlayCircle size={18} className="play-circle" />
                      Watch on YouTube
                    </span>
                    <Lucide.ExternalLink size={14} className="open-link" />
                  </a>
                </section>
              )}

            </div>
          </article>
        )}

        {isSuccess && (
          <div className="generate-another-wrap">
            <button className="btn-generate-another" onClick={handleGenerateMeal}>
              <Lucide.Shuffle size={16} />
              <span>Generate another meal</span>
            </button>
          </div>
        )}

      </main>
    </main>
  );
}

export default App;