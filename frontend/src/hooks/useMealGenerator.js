// Owns the whole "generate a random meal" workflow: the meal data, the
// idle/loading/error/success state machine, and the image fade-in flag
// that should reset whenever a new meal arrives (or we go back home).
//
// Why this lives outside App: App's job is to decide *what to render* for
// a given state. Deciding *how that state changes* is a different concern —
// pulling it out here means App stays focused on rendering, and this hook
// can be unit-tested on its own (mock mealApi, assert status transitions)
// without rendering any JSX at all.

import { useState } from "react";
import { mealApi } from "../services/mealApi";

// Named constants instead of bare strings ("idle", "loading", ...).
// A typo like Status.LOADNIG throws immediately (undefined), instead of
// silently producing a status string that matches none of the UI phases.
export const Status = {
  IDLE: "idle",
  LOADING: "loading",
  ERROR: "error",
  SUCCESS: "success",
};

export function useMealGenerator() {
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(Status.IDLE);

  // Whether the current meal's image has finished loading (drives the
  // fade-in). It lives here, not in App, because it follows the exact same
  // lifecycle as `meal`: both reset together on a new meal or on goHome.
  const [imageLoaded, setImageLoaded] = useState(false);

  async function generateMeal() {
    setStatus(Status.LOADING);
    setError("");

    try {
      const nextMeal = await mealApi.getRandomMeal();
      setImageLoaded(false); // new meal -> new image -> fade-in starts over
      setMeal(nextMeal);
      setStatus(Status.SUCCESS);
    } catch (requestError) {
      setMeal(null);
      setError(requestError.message || "Something went wrong.");
      setStatus(Status.ERROR);
    }
  }

  function goHome() {
    setMeal(null);
    setError("");
    setImageLoaded(false);
    setStatus(Status.IDLE);
  }

  return {
    meal,
    error,
    status,
    imageLoaded,
    markImageLoaded: () => setImageLoaded(true),
    generateMeal,
    goHome,
  };
}
