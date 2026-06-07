/* webpage logic/UI */

import * as Lucide from "lucide-react";
// The "what's the current meal / what state are we in / how do we change it"
// brain now lives in this hook (hooks/useMealGenerator.js), built on top of
// mealApi from the previous step. App used to own four useState calls plus
// two handler functions for this — now it just asks the hook for the current
// values and the two actions it can trigger (generateMeal, goHome).
//
// Why move it out: that state-machine logic doesn't care *how* it's
// rendered, and the rendering below doesn't care *how* status changes —
// they're two separate concerns that were tangled in one function. Splitting
// them means the state machine can be unit-tested without rendering JSX, and
// this file can focus purely on "given this state, show this UI".
import { useMealGenerator, Status } from "./hooks/useMealGenerator";

function App() {
  const {
    meal,
    error,
    status,
    imageLoaded,
    markImageLoaded,
    generateMeal,
    goHome,
  } = useMealGenerator();

  // Convenient derived flags to keep our JSX clean and highly readable.
  // Compared against Status.* constants (not raw strings) so a typo here
  // would be a ReferenceError, not a silently-blank screen.
  const isIdle = status === Status.IDLE;
  const isLoading = status === Status.LOADING;
  const isError = status === Status.ERROR;
  const isSuccess = status === Status.SUCCESS && meal;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <button className="brand" onClick={goHome} type="button">
            <span className="brand-icon">
              <Lucide.UtensilsCrossed size={22} />
            </span>
            <span className="brand-name">Bey Meal Generator</span>
          </button>
          <button className="btn btn-ghost" onClick={generateMeal} disabled={isLoading}>
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
            <button className="btn btn-primary btn-lg" onClick={generateMeal}>
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
            <button className="btn btn-primary" onClick={generateMeal}>
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
                  onLoad={markImageLoaded}
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
            <button className="btn-generate-another" onClick={generateMeal}>
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