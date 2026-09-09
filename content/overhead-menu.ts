// Owner-supplied menu, 2026-09-09. No inferred ingredients, volumes or prices.
export interface MenuItem {
  name: string;
  description?: string;
  volume?: string;
  price: number;
  category: string;
}
type Entry = [
  name: string,
  volume: string | undefined,
  price: number,
  description?: string,
];
const group = (label: string, entries: Entry[]) => ({
  label,
  items: entries.map(
    ([name, volume, price, description]): MenuItem => ({
      name,
      volume,
      price,
      description,
      category: label,
    }),
  ),
});
export const menuCategories = [
  {
    id: 'signature',
    label: 'Фирменные',
    groups: [
      group('Фирменные коктейли', [
        ['Motörhead', '200 мл', 3200, 'Бурбон & вишня'],
        ['Nirvana', '300 мл', 3200, 'Водка & Red Bull'],
        ['Oasis', '200 мл', 2500, 'Джин & тоник'],
        ['The Beatles', '200 мл', 2500, 'Виски & кола'],
      ]),
    ],
  },
  {
    id: 'beer',
    label: 'Пиво',
    groups: [
      group('Пиво на кране', [
        ['Жигули Барное', '500 мл', 1500],
        ['IPA', '500 мл', 2100],
        ['Sigma Lager', '500 мл', 1800],
        ['Sigma Н/Ф', '500 мл', 1800],
      ]),
      group('Пиво', [
        ['Krušovice Тёмное', '450 мл', 1800],
        ['Kronenbourg 1664 Blanc', '430 мл', 2000],
        ['Неправильный мёд', '450 мл', 2300],
        ['Волковская IPA', '450 мл', 2300],
        ['Сидр Wild Kazakh', '450 мл', 2300],
        ['Guinness Draught', '440 мл', 3600],
        // RELOCVNT Б/А intentionally withheld: source spelling has not been verified.
      ]),
    ],
  },
  {
    id: 'wine',
    label: 'Вино',
    groups: [
      group('Вино', [
        ['Fuori Porta', '125 мл', 3200, 'Красное полусухое'],
        ['Campo Viejo Tempranillo', '125 мл', 2500, 'Красное сухое'],
        ['Campo Viejo Blanco', '125 мл', 2500, 'Белое сухое'],
        ['J.P. Chenet Colombard Sauvignon', '125 мл', 1800, 'Белое сухое'],
      ]),
    ],
  },
  {
    id: 'spirits',
    label: 'Крепкий алкоголь',
    groups: [
      group('Ледяной шот', [
        ['Jägermeister', '50 мл', 2000],
        ['Jägermeister ×3', '50 мл каждый', 5500],
        ['Jägermeister ×6', '50 мл каждый', 11000],
      ]),
      group('Настойки', [
        ['Вишня', '50 мл', 1100],
        ['Малина и зефир', '50 мл', 1100],
        ['Облепиха', '50 мл', 1100],
        ['Смородина', '50 мл', 1100],
        ['Сет настоек 5+1', undefined, 5500],
      ]),
      group('Виски', [
        ['Jameson Original', '50 мл', 2800],
        ['Jameson Crested', '50 мл', 2700],
        ['Jameson Black Barrel', '50 мл', 2900],
        ["Ballantine's", '50 мл', 2000],
        ['Chivas Regal 12YO', '50 мл', 3900],
        ['4 Roses Original', '50 мл', 2500],
      ]),
      group('Ром', [
        ['Havana Club 3YO', '50 мл', 2000],
        ['Havana Club 7YO', '50 мл', 2500],
        ['Havana Club Cuban Spiced', '50 мл', 1800],
        ["Lamb's Spiced", '50 мл', 1500],
      ]),
      group('Текила', [
        ['Olmeca Silver', '50 мл', 2000],
        ['Olmeca Gold', '50 мл', 2300],
      ]),
      group('Водка', [
        ['Elyx', '50 мл', 3200],
        ['Absolut Original', '50 мл', 2200],
      ]),
      group('Джин', [
        ['Beefeater London Dry', '50 мл', 2100],
        ['Beefeater Pink Strawberry', '50 мл', 1800],
      ]),
    ],
  },
  {
    id: 'soft',
    label: 'Безалкогольные',
    groups: [
      group('Безалкогольные напитки', [
        ['Red Bull', '250 мл', 1500],
        ['Schweppes', '500 мл', 1500],
        ['Borjomi Лимонад', '330 мл', 1400],
        ['Coca-Cola', '500 мл', 900],
        ['Вода', '500 мл', 500],
      ]),
    ],
  },
  {
    id: 'coffee',
    label: 'Чай и кофе',
    groups: [
      group('Чай и кофе', [
        ['Чай чёрный / зелёный', '700 мл', 1000],
        ['Американо', '210 мл', 1100],
        ['Латте', '210 мл', 1200],
        ['Капучино', '210 мл', 1200],
        ['Flat White', '210 мл', 1300],
        ['Эспрессо', '60 мл', 900],
      ]),
    ],
  },
  {
    id: 'food',
    label: 'Еда',
    groups: [
      group('Еда и закуски', [
        ['Клаб-сэндвич', undefined, 1500],
        ['Хот-дог Крафт', undefined, 2000],
        ['Рамен', undefined, 2000],
        ['Чечил', undefined, 1500],
        ['Джерки', undefined, 1800],
        ['Сухарики', undefined, 1000],
        ['Чипсы / начос с соусом', undefined, 1800],
        ['Картофель фри с соусом', undefined, 1500],
        ['Наггетсы с соусом', undefined, 2000],
      ]),
    ],
  },
];
export const signatureDrinks = menuCategories[0].groups[0].items;
export const formatPrice = (price: number) =>
  `${price.toLocaleString('ru-RU')} ₸`;
