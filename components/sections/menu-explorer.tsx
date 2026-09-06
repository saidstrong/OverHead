'use client';

import { ArrowUpRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { menuCategories } from '@/content/site-content';

export function MenuExplorer() {
  return (
    <Tabs className="menu-explorer" defaultValue={menuCategories[0].id}>
      <TabsList
        className="menu-tabs"
        variant="line"
        aria-label="Menu categories"
      >
        {menuCategories.map((category) => (
          <TabsTrigger
            className="menu-tab"
            key={category.id}
            value={category.id}
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {menuCategories.map((category) => (
        <TabsContent
          className="menu-panel"
          key={category.id}
          value={category.id}
        >
          <div>
            <p className="menu-panel__label">{category.note}</p>
            <h3>{category.label}</h3>
            <p className="menu-panel__price">{category.priceRange}</p>
            <span className="verification-tag">
              Awaiting current menu confirmation
            </span>
          </div>
          <ol>
            {category.items.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
                <ArrowUpRight aria-hidden="true" size={17} />
              </li>
            ))}
          </ol>
        </TabsContent>
      ))}
    </Tabs>
  );
}
