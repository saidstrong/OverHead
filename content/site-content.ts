export type EventStatus = 'tonight' | 'upcoming';
export type VerificationStatus = 'verified-public' | 'provisional';

export interface VenueEvent {
  id: string;
  isoDate: string;
  date: string;
  title: string;
  subtitle: string;
  time: string;
  age: string;
  price: string;
  ticketUrl: string;
  status: EventStatus;
  verification: VerificationStatus;
  artworkTone: 'rust' | 'violet';
}

export interface MenuCategory {
  id: string;
  label: string;
  note: string;
  priceRange?: string;
  items: string[];
  verification: VerificationStatus;
}

export const links = {
  instagram: 'https://www.instagram.com/overhead.club',
  directions:
    'https://2gis.kz/astana/search/bar/rubricId/159/filters/sort%3Drating/firm/70000001110517907/71.387959%2C51.147941/tab/info?m=71.392064%2C51.145876%2F14.09',
};

export const copy = {
  nav: {
    tonight: 'Tonight',
    events: 'Events',
    menu: 'Menu',
    visit: 'Visit',
    reserve: 'Reserve',
  },
  hero: {
    eyebrow: 'ASTANA · LIVE MUSIC · BAR',
    title: ['OVERHEAD', 'TURN IT UP.'],
    description:
      'Live sets, cold drinks and the people who stay until the last song.',
    primaryAction: 'What is on tonight?',
    menuAction: 'Explore the bar',
  },
  tonight: {
    eyebrow: 'NEXT AT OVERHEAD',
    title: 'THE NEXT REASON TO GO OUT.',
  },
  drinks: {
    eyebrow: 'SIGNATURE DRINKS',
    title: 'THE BAR HAS A SOUND OF ITS OWN.',
    body: 'Band-named cocktails connect the drinks menu to the stage. The final recipes and prices remain replaceable content, while the experience is built to last.',
  },
  events: {
    eyebrow: 'ON STAGE',
    title: 'UPCOMING NOISE.',
    intro: 'Dates, essential details and the shortest path to a ticket.',
  },
  menu: {
    eyebrow: 'AT THE BAR',
    title: 'DRINK. EAT. STAY.',
    intro:
      'A mobile-readable menu structure ready for confirmed products and prices.',
  },
  atmosphere: {
    eyebrow: 'THE ROOM',
    title: 'CLOSE TO THE STAGE. PART OF THE NIGHT.',
  },
  visit: {
    eyebrow: 'VISIT OVERHEAD',
    title: 'FIND THE NOISE.',
  },
} as const;

export const events: VenueEvent[] = [
  {
    id: 'avtosport-2026',
    isoDate: '2026-09-18T18:00:00+06:00',
    date: '18 SEP',
    title: 'Автоспорт',
    subtitle: 'with special guests Shié + jüzw',
    time: '18:00',
    age: '16+',
    price: 'from 9,000 ₸',
    ticketUrl: 'https://ticketon.kz/kz/concerts/event/tckt2-avtosport-astana',
    status: 'upcoming',
    verification: 'verified-public',
    artworkTone: 'rust',
  },
  {
    id: 'durnoy-vkus-2026',
    isoDate: '2026-10-03T19:00:00+06:00',
    date: '03 OCT',
    title: 'ДУРНОЙ ВКУС',
    subtitle: 'first time in Astana',
    time: '19:00',
    age: '16+',
    price: 'from 15,000 ₸',
    ticketUrl: 'https://ticketon.kz/kz/concerts/event/tckt2-durnoy-vkus-astana',
    status: 'upcoming',
    verification: 'verified-public',
    artworkTone: 'violet',
  },
];

export const signatureDrinks = [
  { name: 'Motörhead', number: '01' },
  { name: 'Nirvana', number: '02' },
  { name: 'Oasis', number: '03' },
] as const;

export const menuCategories: MenuCategory[] = [
  {
    id: 'signature',
    label: 'Signature cocktails',
    note: 'Band-named house drinks',
    priceRange: '2,500–3,200 ₸ shown previously',
    items: ['Motörhead', 'Nirvana', 'Oasis', 'The Beatles'],
    verification: 'provisional',
  },
  {
    id: 'cocktails',
    label: 'Cocktails',
    note: 'Classic and house selection',
    priceRange: 'Current prices awaiting confirmation',
    items: ['Full cocktail list', 'Alcohol-free options'],
    verification: 'provisional',
  },
  {
    id: 'beer',
    label: 'Beer',
    note: 'Draft and bottled',
    priceRange: '1,500–2,100 ₸ shown previously',
    items: ['Draft beer · 500 ml', 'Bottled selection', 'Alcohol-free beer'],
    verification: 'provisional',
  },
  {
    id: 'spirits',
    label: 'Spirits',
    note: 'Infusions and spirits',
    priceRange: 'House infusions previously shown at 1,100 ₸',
    items: ['House infusions · 50 ml', 'Full spirits list pending'],
    verification: 'provisional',
  },
  {
    id: 'food',
    label: 'Food / snacks',
    note: 'Built for a full evening',
    priceRange: '1,000–2,000 ₸ shown previously',
    items: ['Hot dogs', 'Ramen', 'Fries', 'Sharing snacks'],
    verification: 'provisional',
  },
];

export const visit = {
  address: 'Korgalzhyn Highway 13/1, Astana, Kazakhstan',
  hours: null,
  phone: null,
  reservationUrl: links.instagram,
  verificationNote:
    'Opening hours, phone and reservation method are awaiting owner confirmation.',
};
