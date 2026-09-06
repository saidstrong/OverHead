export function MusicTransition() {
  return (
    <section
      className="music-transition"
      data-music-transition
      aria-label="From the bar to the stage"
    >
      <p>FROM THE BAR</p>
      <div className="music-strings" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <span data-string key={string} />
        ))}
      </div>
      <h2>
        TO THE
        <br />
        <em>STAGE.</em>
      </h2>
      <p>LIGHTS DOWN / AMPS UP</p>
    </section>
  );
}
