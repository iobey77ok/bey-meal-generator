// PHASE 1: idle / welcome screen — shown before the user has generated anything.
// Pulled out of App so that adding/removing a phase never risks touching the
// markup of the other phases (each one now lives in its own file).
function Hero({ onGenerate }) {
  return (
    <section className="hero">
      <div className="hero-badge">Random recipe finder</div>
      <h1>What&apos;s cooking today?</h1>
      <p>
        Click generate to discover a random meal with picture, ingredients,
        instructions, and video when available.
      </p>
      <button className="btn btn-primary btn-lg" onClick={onGenerate}>
        Generate a Meal
      </button>
    </section>
  );
}

export default Hero;
