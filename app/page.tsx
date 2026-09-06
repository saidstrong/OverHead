import { ArrowDownRight, ArrowUpRight, MapPin, Music2, Ticket } from 'lucide-react';

const events = [
  {
    date: '18 SEP',
    name: 'Автоспорт',
    detail: 'with special guests Shié + jüzw',
    time: '18:00',
    age: '16+',
    price: 'from 9,000 ₸',
    href: 'https://ticketon.kz/kz/concerts/event/tckt2-avtosport-astana',
  },
  {
    date: '03 OCT',
    name: 'ДУРНОЙ ВКУС',
    detail: 'first time in Astana',
    time: '19:00',
    age: '16+',
    price: 'from 15,000 ₸',
    href: 'https://ticketon.kz/kz/concerts/event/tckt2-durnoy-vkus-astana',
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-noise" aria-hidden="true" />
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Overhead home">
            <img src="/overhead-mark.png" alt="" className="brand-mark" />
            <span>OVERHEAD</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#events">Events</a>
            <a href="#visit">Visit</a>
            <a className="nav-ticket" href="#events">
              Tickets <ArrowUpRight size={15} strokeWidth={2.4} />
            </a>
          </nav>
        </header>

        <div className="hero-copy">
          <p className="eyebrow">ASTANA · LIVE MUSIC · BAR</p>
          <h1>
            TURN IT
            <span>UP.</span>
          </h1>
          <p className="hero-description">
            The loudest room in town for live sets, cold drinks and the people
            who stay until the last song.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#events">
              See upcoming shows <ArrowDownRight size={18} strokeWidth={2.4} />
            </a>
            <a
              className="button button-quiet"
              href="https://www.instagram.com/overhead.club"
              target="_blank"
              rel="noreferrer"
            >
              Instagram <ArrowUpRight size={17} strokeWidth={2.4} />
            </a>
          </div>
        </div>

        <div className="hero-stamp" aria-label="Overhead Astana live music bar">
          <img src="/overhead-mark.png" alt="" />
          <span>LIVE / LOUD / LATE</span>
        </div>

        <a className="scroll-cue" href="#events">
          <span>SCROLL FOR THE LINE-UP</span>
          <ArrowDownRight size={18} strokeWidth={2.4} />
        </a>
      </section>

      <section className="events-section" id="events" aria-labelledby="events-title">
        <div className="section-heading">
          <p className="eyebrow">ON STAGE</p>
          <h2 id="events-title">UPCOMING<br />NOISE.</h2>
          <p className="section-intro">
            No filler. Just the next reason to get out.
          </p>
        </div>

        <div className="event-list">
          {events.map((event) => (
            <article className="event-card" key={event.name}>
              <div className="event-date">{event.date}</div>
              <div className="event-name">
                <h3>{event.name}</h3>
                <p>{event.detail}</p>
              </div>
              <dl className="event-meta">
                <div><dt>Doors</dt><dd>{event.time}</dd></div>
                <div><dt>Age</dt><dd>{event.age}</dd></div>
                <div><dt>Tickets</dt><dd>{event.price}</dd></div>
              </dl>
              <a
                className="ticket-link"
                href={event.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Buy tickets for ${event.name}`}
              >
                <Ticket size={19} strokeWidth={2.2} />
                <span>GET TICKETS</span>
                <ArrowUpRight size={19} strokeWidth={2.2} />
              </a>
            </article>
          ))}
        </div>
        <p className="schedule-note">Event information and prices are linked directly to Ticketon and must be confirmed before publishing.</p>
      </section>

      <section className="about-section" id="visit">
        <div className="about-accent" aria-hidden="true"><Music2 size={44} strokeWidth={1.4} /></div>
        <p className="eyebrow">THE ROOM</p>
        <div className="about-grid">
          <h2>COME FOR THE<br /><em>SET.</em> STAY FOR<br />THE NIGHT.</h2>
          <div className="about-copy">
            <p>
              Overhead brings the concert close: a live-music club built for
              artists, regulars and anyone looking for a better night out.
            </p>
            <p>
              Drinks take their names from the bands. The terrace gives the
              night room to breathe. Inside, the next act is already warming up.
            </p>
          </div>
        </div>
      </section>

      <section className="visit-section" aria-labelledby="visit-title">
        <div className="visit-card">
          <p className="eyebrow">FIND THE NOISE</p>
          <h2 id="visit-title">OVERHEAD<br />CLUB</h2>
          <p className="visit-address">
            <MapPin size={19} strokeWidth={2.2} />
            Korgalzhyn Highway 13/1<br />Astana, Kazakhstan
          </p>
          <a
            className="button button-primary"
            href="https://2gis.kz/astana/search/bar/rubricId/159/filters/sort%3Drating/firm/70000001110517907/71.387959%2C51.147941/tab/info?m=71.392064%2C51.145876%2F14.09"
            target="_blank"
            rel="noreferrer"
          >
            Get directions <ArrowUpRight size={18} strokeWidth={2.4} />
          </a>
        </div>
        <p className="visit-side-note">KEEP YOUR EARS OPEN.<br />THE NIGHT IS YOUNG.</p>
      </section>

      <footer>
        <a className="brand" href="#top" aria-label="Back to top">
          <img src="/overhead-mark.png" alt="" className="brand-mark" />
          <span>OVERHEAD</span>
        </a>
        <span>ASTANA · KZ</span>
        <a href="https://www.instagram.com/overhead.club" target="_blank" rel="noreferrer">@OVERHEAD.CLUB</a>
      </footer>
    </main>
  );
}
