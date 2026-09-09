import { copy } from '@/content/site-content';
import { signatureDrinks, formatPrice } from '@/content/overhead-menu';
import { ActionLink } from '@/components/site/action-link';

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
            Открыть меню
          </ActionLink>
        </div>
        <div className="drinks-material-note" data-reveal aria-hidden="true">
          <span>01</span>
          <p>СТАЛЬ / ЛЁД / ЯНТАРЬ</p>
          <i />
          <small>ИСКУССТВО ВЕЧЕРА</small>
        </div>
      </div>
      <ol className="drink-list">
        {signatureDrinks.map((drink, index) => (
          <li key={drink.name} data-reveal>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{drink.name}</strong>
            <small>
              {drink.description}
              <br />
              {drink.volume} · {formatPrice(drink.price)}
            </small>
          </li>
        ))}
      </ol>
    </section>
  );
}
