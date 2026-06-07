// PHASE 3: shown when mealApi.getRandomMeal() rejects. `message` comes
// straight from useMealGenerator's `error` value.
function ErrorState({ message, onRetry }) {
  return (
    <section className="state-card">
      <h2>Oops, something went wrong</h2>
      <p className="error-text">{message}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
}

export default ErrorState;
