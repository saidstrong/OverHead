'use client';

import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SceneFallback } from './scene-fallback';
import { HybridLayers } from './hybrid-layers';
import './bar-experience.css';

const BarCanvas = lazy(() => import('./bar-canvas'));
const DURATION = 16;
const chapters = [
  { at: 0, label: 'The ritual', note: 'Crafted steel. A quiet beginning.' },
  {
    at: 1.6,
    label: 'The shake',
    note: 'A measured rhythm. Perfectly chilled.',
  },
  { at: 5.2, label: 'The release', note: 'Two tins. One precise movement.' },
  { at: 7.2, label: 'The pour', note: 'Amber over ice.' },
  { at: 11, label: 'Your first sip', note: 'Made for the moment.' },
  {
    at: 13.2,
    label: 'Stay for the music',
    note: 'The night is just beginning.',
  },
];

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function BarExperience() {
  const container = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const composite = useRef<HTMLDivElement>(null);
  const seek = useRef<((time: number, still?: boolean) => void) | null>(null);
  const [near, setNear] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [artworkReady, setArtworkReady] = useState(false);
  const ready = canvasReady && artworkReady;
  const [failed, setFailed] = useState(false);
  const [chapter, setChapter] = useState(0);
  const current = chapters[reduced ? 5 : chapter];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          preload.disconnect();
        }
      },
      { rootMargin: '600px' },
    );
    if (container.current) preload.observe(container.current);
    return () => {
      preference.removeEventListener('change', update);
      preload.disconnect();
    };
  }, []);

  const onReady = useCallback(
    (render: (time: number, still?: boolean) => void) => {
      seek.current = render;
      setCanvasReady(true);
    },
    [],
  );
  const onArtworkReady = useCallback(() => setArtworkReady(true), []);
  const onError = useCallback(() => {
    setFailed(true);
    setCanvasReady(false);
  }, []);

  useEffect(() => {
    const element = container.current;
    if (!ready || !element) return;
    if (reduced) {
      seek.current?.(12.3, true);
      element.dataset.sceneTime = '12.30';
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const clock = { time: 0 };
    let lastChapter = -1;
    const render = () => {
      // No wall-clock playback: this value is driven exclusively by scroll.
      if (!document.hidden) seek.current?.(clock.time);
      element.dataset.sceneTime = clock.time.toFixed(2);
      if (progress.current)
        progress.current.style.transform = `scaleX(${clock.time / DURATION})`;
      const next = Math.max(
        0,
        chapters.findLastIndex((item) => clock.time >= item.at),
      );
      if (next !== lastChapter) {
        lastChapter = next;
        setChapter(next);
      }
    };
    const tween = gsap.to(clock, {
      time: DURATION,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top top+=24',
        end: () =>
          `+=${element.offsetHeight - (element.firstElementChild as HTMLElement).offsetHeight}`,
        scrub: 0.35,
        invalidateOnRefresh: true,
      },
      onUpdate: render,
    });
    const visibility = () => {
      if (!document.hidden) render();
    };
    document.addEventListener('visibilitychange', visibility);
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refresh);
      document.removeEventListener('visibilitychange', visibility);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ready, reduced]);

  return (
    <div
      className="bar-scroll"
      ref={container}
      data-bar-experience
      data-scene-ready={ready && !failed}
      data-reduced-motion={reduced}
      data-scene-failed={failed}
    >
      <div className="bar-experience">
        <div className="bar-experience__masthead">
          <span>OVERHEAD / THE BAR</span>
          <span>AN EVENING IN SIX MOMENTS</span>
        </div>
        <figure
          className="bar-experience__viewport"
          aria-label="A two-piece steel Boston shaker shakes, separates and pours an amber cocktail into a glass prepared with ice and citrus. Scroll to serve the drink and reveal the live music stage."
        >
          {(!ready || failed) && <SceneFallback />}
          {near && !failed && (
            <HybridLayers
              composite={composite}
              onReady={onArtworkReady}
              onError={onError}
            />
          )}
          {near && !failed && (
            <SceneBoundary onError={onError}>
              <Suspense fallback={null}>
                <BarCanvas
                  onReady={onReady}
                  onError={onError}
                  composite={composite}
                />
              </Suspense>
            </SceneBoundary>
          )}
          <div className="bar-experience__vignette" />
          <div
            className="bar-experience__caption"
            data-chapter={reduced ? 4 : chapter}
            aria-hidden="true"
          >
            <span>
              {String((reduced ? 5 : chapter) + 1).padStart(2, '0')} / 06
            </span>
            <h3>{failed ? 'The evening, distilled.' : current.label}</h3>
            <p>
              {failed
                ? 'A first sip. A live set. Your kind of night.'
                : current.note}
            </p>
          </div>
          <a
            className="bar-experience__next"
            href={chapter === 5 || reduced ? '#events' : '#menu'}
          >
            {chapter === 5 || reduced
              ? 'See who’s playing'
              : 'Explore the drinks'}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </figure>
        <div className="bar-experience__scroll-note">
          <span>
            {reduced || failed
              ? 'STEEL. ICE. AMBER. LIVE MUSIC.'
              : 'SCROLL TO FOLLOW THE RITUAL'}
          </span>
          <a href="#bar-after">
            {reduced || failed ? 'Continue' : 'Skip scene'}
            <ArrowDown size={13} aria-hidden="true" />
          </a>
          <div className="bar-experience__progress" ref={progress} />
        </div>
      </div>
    </div>
  );
}
