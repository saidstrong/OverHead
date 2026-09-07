import { copy, signatureDrinks } from '@/content/site-content';
import { ActionLink } from '@/components/site/action-link';
import { CocktailVisual } from '@/components/site/cocktail-visual';

export function SignatureDrinksSection() {
  return (
    <section
      className="drinks-section"
      id="drinks"
      aria-labelledby="drinks-title"
    >
      <div className="drinks-intro">
        <div className="drinks-copy" data-reveal>
          <p className="eyebrow">{copy.drinks.eyebrow}</p>
          <h2 id="drinks-title">{copy.drinks.title}</h2>
          <p>{copy.drinks.body}</p>
          <ActionLink href="#menu" variant="dark" direction="down">
            Open the menu
          </ActionLink>
        </div>
        <div className="drinks-material-note" data-reveal aria-hidden="true">
          <span>01</span>
          <p>STEEL / ICE / LIQUOR</p>
          <i />
          <small>ONE PHYSICAL SEQUENCE</small>
        </div>
      </div>

      <div
        className="cocktail-story"
        data-cocktail-story
        aria-label="A Boston shaker becomes the Motörhead signature cocktail"
      >
        <div className="cocktail-story__sticky" data-bar-light>
          <div className="cocktail-story__topline" aria-hidden="true">
            <span>OVERHEAD BAR / 01</span>
            <span>SHAKE → POUR → SETTLE</span>
          </div>

          <div className="cocktail-story__words" aria-hidden="true">
            <span data-shake-word>SHAKE.</span>
            <span data-pour-word>POUR.</span>
          </div>

          <div className="cocktail-story__object">
            <CocktailVisual />
          </div>

          <div className="cocktail-editorial" data-cocktail-copy>
            <p>01 / HOUSE SIGNATURE</p>
            <h3>{signatureDrinks[0].name}</h3>
            <div>
              <span>RECIPE + PRICE</span>
              <strong>Awaiting final menu</strong>
            </div>
            <a href="#menu">EXPLORE ALL DRINKS ↘</a>
          </div>

          <div className="cocktail-story__progress" aria-hidden="true">
            <span data-story-step="active">01</span>
            <span>02</span>
            <span>03</span>
            <span>04</span>
          </div>
        </div>
      </div>

      <ol className="drink-list">
        {signatureDrinks.map((drink) => (
          <li key={drink.name} data-reveal>
            <span>{drink.number}</span>
            <strong>{drink.name}</strong>
            <small>House signature · final recipe and price pending</small>
          </li>
        ))}
      </ol>
    </section>
  );
}
