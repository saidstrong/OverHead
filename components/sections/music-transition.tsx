export function MusicTransition() {
  return (
    <section
      className="music-transition"
      data-music-transition
      aria-label="From the bar to the stage"
    >
      <div
        className="transition-glint"
        data-transition-glint
        aria-hidden="true"
      />
      <p className="music-transition__origin">THE LAST BAR REFLECTION</p>
      <div className="music-transition__instrument" aria-hidden="true">
        <div className="amp-cone" data-amp-cone>
          <span />
          <span />
          <span />
        </div>
        <div className="music-strings">
          {[0, 1, 2, 3, 4, 5].map((string) => (
            <span data-string key={string} />
          ))}
        </div>
      </div>
      <h2>
        <span data-transition-line>FROM STEEL.</span>
        <em data-transition-line>TO STRINGS.</em>
      </h2>
      <p className="music-transition__destination">LIGHTS DOWN / AMPS UP</p>
    </section>
  );
}
