// PHASE 2: shown while a meal request is in flight.
function LoadingState() {
  return (
    <section className="state-card">
      <div className="spinner" />
      <p>Finding your next meal...</p>
    </section>
  );
}

export default LoadingState;
