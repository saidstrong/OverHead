import { copy, signatureDrinks } from '@/content/site-content';
import { ActionLink } from '@/components/site/action-link';

export function SignatureDrinksSection() {
  return (
    <section
      className="drinks-section"
      id="drinks"
      aria-labelledby="drinks-title"
    >
      <div className="drinks-copy" data-reveal>
        <p className="eyebrow">{copy.drinks.eyebrow}</p>
        <h2 id="drinks-title">{copy.drinks.title}</h2>
        <p>{copy.drinks.body}</p>
        <ActionLink href="#menu" variant="dark" direction="down">
          Open the menu
        </ActionLink>
      </div>

      <div
        className="pour-stage"
        data-bar-light
        aria-label="Reserved visual stage for the signature cocktail sequence"
      >
        <p className="pour-stage__kicker">SIGNATURE SEQUENCE</p>
        <div className="pour-stage__steps" aria-hidden="true">
          <span>SHAKE</span>
          <span>TILT</span>
          <span>POUR</span>
          <span>REVEAL</span>
        </div>
        <div className="pour-stage__reflection" aria-hidden="true" />
        <p className="pour-stage__note">
          Artwork layer ready for a realistic shaker and glass study
        </p>
      </div>

      <ol className="drink-list">
        {signatureDrinks.map((drink) => (
          <li key={drink.name} data-reveal>
            <span>{drink.number}</span>
            <strong>{drink.name}</strong>
            <small>Signature recipe · details pending confirmation</small>
          </li>
        ))}
      </ol>
    </section>
  );
}
