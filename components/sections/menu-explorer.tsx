'use client';
import { useRef, useState } from 'react';
import { menuCategories, formatPrice } from '@/content/overhead-menu';
export function MenuExplorer() {
  const [activeId, setActiveId] = useState(menuCategories[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeCategory =
    menuCategories.find((category) => category.id === activeId) ??
    menuCategories[0];
  const selectTab = (index: number) => {
    setActiveId(menuCategories[index].id);
    const tab = tabRefs.current[index];
    tab?.focus({ preventScroll: true });
    if (tab?.parentElement) {
      const rail = tab.parentElement;
      rail.scrollTo({
        left:
          rail.scrollLeft +
          tab.getBoundingClientRect().left -
          rail.getBoundingClientRect().left -
          (rail.clientWidth - tab.clientWidth) / 2,
        behavior: 'instant',
      });
    }
  };
  return (
    <div className="menu-explorer">
      <p className="menu-swipe-hint" aria-hidden="true">
        Категории <span>Листайте →</span>
      </p>
      <div className="menu-tabs" role="tablist" aria-label="Категории меню">
        {menuCategories.map((category, index) => (
          <button
            className="menu-tab"
            key={category.id}
            id={`menu-tab-${category.id}`}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={activeId === category.id}
            aria-controls={`menu-panel-${category.id}`}
            tabIndex={activeId === category.id ? 0 : -1}
            data-active={activeId === category.id ? '' : undefined}
            onClick={() => selectTab(index)}
            onKeyDown={(event) => {
              const next =
                event.key === 'ArrowRight'
                  ? (index + 1) % menuCategories.length
                  : event.key === 'ArrowLeft'
                    ? (index - 1 + menuCategories.length) %
                      menuCategories.length
                    : event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? menuCategories.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                selectTab(next);
              }
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
      {menuCategories.map((category) => (
        <div
          key={category.id}
          className="menu-panel"
          id={`menu-panel-${category.id}`}
          role="tabpanel"
          hidden={category.id !== activeCategory.id}
          aria-labelledby={`menu-tab-${category.id}`}
          tabIndex={0}
        >
          {category.id === activeCategory.id &&
            category.groups.map((group) => (
              <div className="menu-group" key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <div className="menu-item-copy">
                        <strong>{item.name}</strong>
                        {item.description && <p>{item.description}</p>}
                        {item.volume && <small>{item.volume}</small>}
                      </div>
                      <span className="menu-item-price">
                        {formatPrice(item.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
