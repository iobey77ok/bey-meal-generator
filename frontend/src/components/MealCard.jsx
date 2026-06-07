import * as Lucide from "lucide-react";

// PHASE 4: the meal display + "generate another" action.
// `meal` is always the canonical shape produced by normalizeMeal — this
// component never has to guard against MealDB vs. local-JSON differences.
function MealCard({ meal, imageLoaded, onImageLoad, onGenerateAnother }) {
  return (
    <>
      <article className="meal-card">
        <div className="meal-image-wrap">
          {meal.image ? (
            <img
              src={meal.image}
              alt={meal.name}
              className={imageLoaded ? "meal-image loaded" : "meal-image"}
              onLoad={onImageLoad}
            />
          ) : (
            <div className="meal-image-placeholder">No image</div>
          )}
          <div className="meal-tags">
            {meal.category && (
              <span className="tag-category">
                <Lucide.ChefHat size={12} />
                {meal.category}
              </span>
            )}

            {meal.area && (
              <span className="tag-area">
                <Lucide.Globe size={12} />
                {meal.area}
              </span>
            )}
          </div>
        </div>

        <div className="meal-body">
          <h2>{meal.name}</h2>

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

      <div className="generate-another-wrap">
        <button className="btn-generate-another" onClick={onGenerateAnother}>
          <Lucide.Shuffle size={16} />
          <span>Generate another meal</span>
        </button>
      </div>
    </>
  );
}

export default MealCard;
