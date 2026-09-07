'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { menuCategories } from '@/content/site-content';

export function MenuExplorer() {
  const [activeId, setActiveId] = useState(menuCategories[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeCategory =
    menuCategories.find((category) => category.id === activeId) ??
    menuCategories[0];

  const selectTab = (index: number) => {
    const category = menuCategories[index];
    setActiveId(category.id);
    tabRefs.current[index]?.focus();
  };

  return (
    <div className="menu-explorer">
      <div className="menu-tabs" role="tablist" aria-label="Menu categories">
        {menuCategories.map((category) => (
          <button
            className="menu-tab"
            key={category.id}
            id={`menu-tab-${category.id}`}
            ref={(element) => {
              tabRefs.current[menuCategories.indexOf(category)] = element;
            }}
            type="button"
            role="tab"
            aria-selected={activeId === category.id}
            aria-controls={`menu-panel-${category.id}`}
            tabIndex={activeId === category.id ? 0 : -1}
            data-active={activeId === category.id ? '' : undefined}
            onClick={() => setActiveId(category.id)}
            onKeyDown={(event) => {
              const currentIndex = menuCategories.indexOf(category);
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                selectTab((currentIndex + 1) % menuCategories.length);
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                selectTab(
                  (currentIndex - 1 + menuCategories.length) %
                    menuCategories.length,
                );
              } else if (event.key === 'Home') {
                event.preventDefault();
                selectTab(0);
              } else if (event.key === 'End') {
                event.preventDefault();
                selectTab(menuCategories.length - 1);
              }
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div
        className="menu-panel"
        id={`menu-panel-${activeCategory.id}`}
        role="tabpanel"
        aria-labelledby={`menu-tab-${activeCategory.id}`}
      >
        <div>
          <p className="menu-panel__label">{activeCategory.note}</p>
          <h3>{activeCategory.label}</h3>
          <p className="menu-panel__price">{activeCategory.priceRange}</p>
          <span className="verification-tag">
            Awaiting current menu confirmation
          </span>
        </div>
        <ol>
          {activeCategory.items.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
              <ArrowUpRight aria-hidden="true" size={17} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
