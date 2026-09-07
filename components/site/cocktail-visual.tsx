/* oxlint-disable jsx-a11y/prefer-tag-over-role -- This is a semantic, titled SVG illustration and cannot be replaced by a raster img element. */
interface CocktailVisualProps {
  variant?: 'hero' | 'story';
}

export function CocktailVisual({ variant = 'story' }: CocktailVisualProps) {
  const prefix = variant === 'hero' ? 'hero' : 'story';
  const isStory = variant === 'story';

  return (
    <svg
      className={`cocktail-visual cocktail-visual--${variant}`}
      viewBox="0 0 680 720"
      role="img"
      aria-labelledby={`${prefix}-shaker-title ${prefix}-shaker-description`}
    >
      <title id={`${prefix}-shaker-title`}>Two-piece Boston shaker</title>
      <desc id={`${prefix}-shaker-description`}>
        {isStory
          ? 'A steel Boston shaker pours an amber cocktail over ice.'
          : 'A polished steel Boston shaker introduces the Overhead bar.'}
      </desc>

      <defs>
        <linearGradient id={`${prefix}-steel`} x1="0" x2="1">
          <stop offset="0" stopColor="#171717" />
          <stop offset="0.13" stopColor="#5b5b58" />
          <stop offset="0.29" stopColor="#d8d7cf" />
          <stop offset="0.39" stopColor="#777773" />
          <stop offset="0.6" stopColor="#f5f2e9" />
          <stop offset="0.72" stopColor="#8a8984" />
          <stop offset="1" stopColor="#242321" />
        </linearGradient>
        <linearGradient id={`${prefix}-steel-dark`} x1="0" x2="1">
          <stop offset="0" stopColor="#090909" />
          <stop offset="0.32" stopColor="#64635f" />
          <stop offset="0.56" stopColor="#c7c5bd" />
          <stop offset="0.7" stopColor="#4a4946" />
          <stop offset="1" stopColor="#11100f" />
        </linearGradient>
        <linearGradient id={`${prefix}-amber`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4b357" />
          <stop offset="0.45" stopColor="#c66a25" />
          <stop offset="1" stopColor="#6f2d12" />
        </linearGradient>
        <radialGradient id={`${prefix}-glass-glow`} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#f6c989" stopOpacity="0.28" />
          <stop offset="1" stopColor="#e24f27" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${prefix}-glass-clip`}>
          <path d="M278 484 L300 654 Q340 674 380 654 L402 484 Z" />
        </clipPath>
        <filter
          id={`${prefix}-soft-shadow`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <ellipse
        className="cocktail-visual__shaker-shadow"
        cx="350"
        cy="546"
        rx="145"
        ry="22"
        fill="#000"
        opacity="0.42"
        filter={`url(#${prefix}-soft-shadow)`}
      />

      <g
        className="cocktail-visual__shaker"
        data-hero-shaker={variant === 'hero' ? '' : undefined}
        data-story-shaker={isStory ? '' : undefined}
      >
        <g
          className="cocktail-visual__lower"
          data-shaker-lower={isStory ? '' : undefined}
        >
          <path
            d="M229 244 Q340 225 451 244 L413 526 Q340 552 267 526 Z"
            fill={`url(#${prefix}-steel)`}
          />
          <path
            d="M250 258 L283 513 Q301 522 320 525 L294 257 Z"
            fill="#050505"
            opacity="0.38"
          />
          <path
            d="M359 251 L386 520"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.76"
            strokeWidth="9"
            strokeLinecap="round"
            data-hero-reflection={variant === 'hero' ? '' : undefined}
          />
          <path
            d="M431 259 L401 511"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.18"
            strokeWidth="3"
          />
          <ellipse cx="340" cy="245" rx="112" ry="19" fill="#11100f" />
          <ellipse
            cx="340"
            cy="242"
            rx="105"
            ry="13"
            fill={`url(#${prefix}-steel-dark)`}
          />
          <ellipse
            cx="340"
            cy="526"
            rx="73"
            ry="15"
            fill="#11100f"
            opacity="0.88"
          />
          <path
            d="M278 520 Q340 538 402 520"
            fill="none"
            stroke="#f1eee5"
            strokeOpacity="0.58"
            strokeWidth="3"
          />
        </g>

        <g
          className="cocktail-visual__upper"
          data-shaker-upper={isStory ? '' : undefined}
        >
          <path
            d="M278 76 Q340 58 402 76 L449 251 Q340 274 231 251 Z"
            fill={`url(#${prefix}-steel-dark)`}
          />
          <path
            d="M297 84 L259 242 Q279 248 304 250 L329 76 Z"
            fill="#050505"
            opacity="0.48"
          />
          <path
            d="M359 72 L402 246"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.7"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <ellipse cx="340" cy="75" rx="64" ry="13" fill="#181716" />
          <ellipse
            cx="340"
            cy="72"
            rx="59"
            ry="9"
            fill={`url(#${prefix}-steel)`}
          />
          <ellipse
            cx="340"
            cy="251"
            rx="110"
            ry="17"
            fill="#0c0c0b"
            opacity="0.82"
          />
          <path
            d="M235 247 Q340 265 445 247"
            fill="none"
            stroke="#f1eee5"
            strokeOpacity="0.74"
            strokeWidth="4"
          />
        </g>

        <g className="cocktail-visual__seam">
          <path
            d="M236 251 Q340 269 444 251"
            fill="none"
            stroke="#060606"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M245 248 Q340 261 435 248"
            fill="none"
            stroke="#ece9df"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
        </g>
      </g>

      {isStory ? (
        <>
          <g className="cocktail-visual__pour" data-pour-stream>
            <path
              d="M499 264 C488 333 412 409 357 489"
              fill="none"
              stroke="#8a3f16"
              strokeOpacity="0.46"
              strokeWidth="19"
              strokeLinecap="round"
            />
            <path
              d="M499 264 C488 333 412 409 357 489"
              fill="none"
              stroke={`url(#${prefix}-amber)`}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M496 267 C483 335 408 408 354 487"
              fill="none"
              stroke="#ffd08d"
              strokeOpacity="0.72"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="350" cy="497" r="5" fill="#f4a24c" data-pour-drop />
          </g>

          <g className="cocktail-visual__glass" data-cocktail-glass>
            <ellipse
              cx="340"
              cy="669"
              rx="96"
              ry="17"
              fill="#000"
              opacity="0.44"
              filter={`url(#${prefix}-soft-shadow)`}
            />
            <ellipse
              cx="340"
              cy="545"
              rx="134"
              ry="142"
              fill={`url(#${prefix}-glass-glow)`}
            />
            <g clipPath={`url(#${prefix}-glass-clip)`}>
              <g data-liquid-level>
                <rect
                  x="270"
                  y="516"
                  width="145"
                  height="160"
                  fill={`url(#${prefix}-amber)`}
                />
                <ellipse cx="340" cy="517" rx="68" ry="10" fill="#f5b65e" />
                <ellipse
                  cx="340"
                  cy="520"
                  rx="51"
                  ry="6"
                  fill="#fff1cf"
                  opacity="0.35"
                  data-impact-ripple
                />
              </g>
              <g className="cocktail-visual__ice" data-ice>
                <path d="M296 527 L326 510 L342 542 L309 559 Z" />
                <path d="M344 548 L376 527 L390 564 L356 579 Z" />
                <path d="M310 582 L347 565 L360 605 L324 617 Z" />
              </g>
            </g>
            <path
              d="M278 484 L300 654 Q340 674 380 654 L402 484"
              fill="rgba(255,255,255,0.025)"
              stroke="#f1eee5"
              strokeOpacity="0.58"
              strokeWidth="4"
            />
            <ellipse
              cx="340"
              cy="484"
              rx="63"
              ry="12"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.82"
              strokeWidth="5"
            />
            <ellipse
              cx="340"
              cy="487"
              rx="54"
              ry="7"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.22"
              strokeWidth="2"
            />
            <path
              d="M293 496 L313 642"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.42"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M390 499 L373 637"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.18"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </>
      ) : null}
    </svg>
  );
}
