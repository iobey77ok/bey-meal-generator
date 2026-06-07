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
// Each UI phase now lives in its own file under components/. App's render
// becomes "pick the component that matches the current status" — adding a
// 5th phase later (e.g. "no meals match this filter") means adding one more
// file and one more line below; it can't break the markup of the other four.
import Hero from "./components/Hero";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import MealCard from "./components/MealCard";

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
        {isIdle && <Hero onGenerate={generateMeal} />}

        {isLoading && <LoadingState />}

        {isError && <ErrorState message={error} onRetry={generateMeal} />}

        {isSuccess && (
          <MealCard
            meal={meal}
            imageLoaded={imageLoaded}
            onImageLoad={markImageLoaded}
            onGenerateAnother={generateMeal}
          />
        )}
      </main>
    </main>
  );
}

export default App;