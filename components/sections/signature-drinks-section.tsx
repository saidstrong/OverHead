import { copy, signatureDrinks } from '@/content/site-content';
import { ActionLink } from '@/components/site/action-link';
import { BarExperience } from '@/components/scene/bar-experience';

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
          <p>STEEL / ICE / AMBER</p>
          <i />
          <small>THE ART OF THE EVENING</small>
        </div>
      </div>
      <BarExperience />
      <ol className="drink-list" id="bar-after">
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
