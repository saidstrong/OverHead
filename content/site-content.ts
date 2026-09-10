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

export const links = {
  instagram: 'https://www.instagram.com/overhead.club',
  directions:
    'https://2gis.kz/astana/search/bar/rubricId/159/filters/sort%3Drating/firm/70000001110517907/71.387959%2C51.147941/tab/info?m=71.392064%2C51.145876%2F14.09',
};

export const copy = {
  nav: {
    tonight: 'Сегодня',
    events: 'События',
    menu: 'Меню',
    visit: 'Как нас найти',
    reserve: 'Бронь',
  },
  hero: {
    eyebrow: 'АСТАНА · ЖИВАЯ МУЗЫКА · БАР',
    title: ['OVERHEAD', 'ГРОМЧЕ.'],
    description:
      'Живые сеты, холодные напитки и люди, которые остаются до последней песни.',
    primaryAction: 'Что сегодня?',
    menuAction: 'Посмотреть бар',
  },
  tonight: {
    eyebrow: 'БЛИЖАЙШЕЕ В OVERHEAD',
    title: 'СЛЕДУЮЩИЙ ПОВОД ВЫЙТИ ИЗ ДОМА.',
  },
  drinks: {
    eyebrow: 'ФИРМЕННЫЕ КОКТЕЙЛИ',
    title: 'У БАРА СВОЙ ЗВУК.',
    body: 'Motörhead, Nirvana, Oasis, The Beatles. Любимые имена — по другую сторону барной стойки.',
  },
  events: {
    eyebrow: 'НА СЦЕНЕ',
    title: 'СКОРО БУДЕТ ГРОМКО.',
    intro: 'Выбирай концерт. Увидимся у сцены.',
  },
  menu: {
    eyebrow: 'В БАРЕ',
    title: 'ПЕЙ. ЕШЬ. ОСТАВАЙСЯ.',
    intro: 'От первого коктейля до последнего сета.',
  },
  atmosphere: {
    eyebrow: 'ЗАЛ',
    title: 'БЛИЖЕ К СЦЕНЕ. ЧАСТЬ НОЧИ.',
  },
  visit: {
    eyebrow: 'OVERHEAD',
    title: 'ИДИ НА ЗВУК.',
  },
} as const;

export const events: VenueEvent[] = [
  {
    id: 'avtosport-2026',
    isoDate: '2026-09-18T18:00:00+06:00',
    date: '18 СЕН',
    title: 'Автоспорт',
    subtitle: 'Специальные гости: Shié + jüzw',
    time: '18:00',
    age: '16+',
    price: 'от 9 000 ₸',
    ticketUrl: 'https://ticketon.kz/kz/concerts/event/tckt2-avtosport-astana',
    status: 'upcoming',
    verification: 'verified-public',
    artworkTone: 'rust',
  },
  {
    id: 'durnoy-vkus-2026',
    isoDate: '2026-10-03T19:00:00+06:00',
    date: '03 ОКТ',
    title: 'ДУРНОЙ ВКУС',
    subtitle: 'Впервые в Астане',
    time: '19:00',
    age: '16+',
    price: 'от 15 000 ₸',
    ticketUrl: 'https://ticketon.kz/kz/concerts/event/tckt2-durnoy-vkus-astana',
    status: 'upcoming',
    verification: 'verified-public',
    artworkTone: 'violet',
  },
];

export const visit = {
  address: ['Коргалжынское шоссе, 13/1', '3 этаж', 'Астана'],
  hours: [
    { day: 'Понедельник', opens: '18:00', closes: '00:00' },
    { day: 'Вторник', opens: '18:00', closes: '00:00' },
    { day: 'Среда', opens: '18:00', closes: '00:00' },
    { day: 'Четверг', opens: '18:00', closes: '02:00' },
    { day: 'Пятница', opens: '18:00', closes: '05:00' },
    { day: 'Суббота', opens: '18:00', closes: '05:00' },
    { day: 'Воскресенье', opens: '18:00', closes: '02:00' },
  ],
  reservationUrl: links.instagram,
};
