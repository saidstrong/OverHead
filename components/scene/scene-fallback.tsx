export function SceneFallback() {
  return (
    <svg
      className="bar-experience__fallback"
      viewBox="0 0 900 650"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bar-steel">
          <stop stopColor="#131616" />
          <stop offset=".27" stopColor="#9fa4a4" />
          <stop offset=".42" stopColor="#e2dfd4" />
          <stop offset=".6" stopColor="#4b4e4c" />
          <stop offset=".86" stopColor="#a0a4a0" />
          <stop offset="1" stopColor="#222625" />
        </linearGradient>
        <linearGradient id="bar-amber" x2="0" y2="1">
          <stop stopColor="#b98036" stopOpacity=".8" />
          <stop offset="1" stopColor="#713413" />
        </linearGradient>
        <radialGradient id="bar-room">
          <stop stopColor="#55402f" />
          <stop offset="1" stopColor="#101414" />
        </radialGradient>
      </defs>
      <rect width="900" height="650" fill="url(#bar-room)" />
      <g opacity=".35" fill="none" stroke="#ceac78">
        <path d="M580 210V420m-30 8 30-8 30 8M560 210h40" strokeWidth="3" />
        <circle cx="700" cy="373" r="47" strokeWidth="6" />
        <path d="M650 287h50m-25 0v65" />
      </g>
      <path d="M0 490 900 445V650H0Z" fill="#201b16" />
      <ellipse cx="330" cy="510" rx="75" ry="9" fill="#080b0b" />
      <path d="m275 313 109 0-16 192q-38 11-76 0Z" fill="url(#bar-steel)" />
      <path d="m296 180 65 0 22 128q-55 9-109 0Z" fill="url(#bar-steel)" />
      <path
        d="M277 315q53 12 105 0M294 484q37 9 75 0"
        fill="none"
        stroke="#d2ccba"
      />
      <path
        d="m496 361 129 0-12 144q-51 15-104 0Z"
        fill="#ccdfdf"
        fillOpacity=".12"
        stroke="#b5c8c5"
        strokeWidth="3"
      />
      <path d="m501 408 119 0-9 90q-49 11-100 0Z" fill="url(#bar-amber)" />
      <g fill="#dae4dd" fillOpacity=".4" stroke="#e9ede3" strokeOpacity=".5">
        <rect
          x="516"
          y="397"
          width="47"
          height="44"
          rx="6"
          transform="rotate(-12 539 419)"
        />
        <rect
          x="563"
          y="431"
          width="43"
          height="43"
          rx="5"
          transform="rotate(18 584 453)"
        />
      </g>
      <path
        d="M589 386q55-46 25-67t-4 41"
        fill="none"
        stroke="#dbaf4d"
        strokeWidth="11"
      />
    </svg>
  );
}
