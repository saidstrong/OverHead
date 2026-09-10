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
import { HybridLayers } from './hybrid-layers';
import './bar-experience.css';

const BarCanvas = lazy(() => import('./bar-canvas'));
const DURATION = 16;

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
  const composite = useRef<HTMLDivElement>(null);
  const seek = useRef<((time: number, still?: boolean) => void) | null>(null);
  const [near, setNear] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [artworkReady, setArtworkReady] = useState(false);
  const ready = canvasReady && artworkReady;
  const [failed, setFailed] = useState(false);

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
    let ritualActive: boolean | null = null;
    let refreshId = 0;
    const setRitualPresentation = (active: boolean, refresh = true) => {
      const mobile = window.matchMedia('(max-width: 820px)').matches;
      const nextActive = active && mobile;
      if (ritualActive === nextActive) return;
      ritualActive = nextActive;
      element.dataset.ritualActive = String(nextActive);
      document
        .getElementById('quick-actions')
        ?.setAttribute('data-ritual-active', String(nextActive));
      // The active mobile scene gains the navigation's former viewport space.
      // Refresh after the CSS transition state is applied so the trigger's end
      // remains derived from the actual sticky panel height.
      if (refresh) {
        refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    };
    if (reduced) {
      setRitualPresentation(false);
      seek.current?.(12.3, true);
      element.dataset.sceneTime = '12.30';
      return () => {
        cancelAnimationFrame(refreshId);
        setRitualPresentation(false, false);
      };
    }
    gsap.registerPlugin(ScrollTrigger);
    // Ignore iOS Safari toolbar height changes while the user is scrolling.
    // Orientation changes and explicit refreshes still recalculate normally.
    ScrollTrigger.config({ ignoreMobileResize: true });
    const clock = { time: 0 };
    const render = () => {
      // No wall-clock playback: this value is driven exclusively by scroll.
      if (!document.hidden) seek.current?.(clock.time);
      element.dataset.sceneTime = clock.time.toFixed(2);
    };
    const tween = gsap.to(clock, {
      time: DURATION,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top top',
        end: () =>
          `+=${element.offsetHeight - (element.firstElementChild as HTMLElement).offsetHeight}`,
        scrub: 0.35,
        invalidateOnRefresh: true,
        onEnterBack: () => {
          // Re-entering from below starts on the terminal stage frame, then
          // scrubs backward naturally instead of flashing the shaker.
          clock.time = DURATION;
          render();
        },
        onLeave: () => {
          // Keep the stage rendered while the sticky scene unpins.
          clock.time = DURATION;
          render();
        },
        onLeaveBack: () => {
          // It is safe to reset only after the scene has fully left above.
          clock.time = 0;
          render();
        },
        onToggle: (trigger) => setRitualPresentation(trigger.isActive),
        onRefresh: (trigger) => {
          setRitualPresentation(trigger.isActive);
          if (trigger.progress >= 0.999) {
            clock.time = DURATION;
            render();
          }
        },
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
      cancelAnimationFrame(refreshId);
      document.removeEventListener('visibilitychange', visibility);
      tween.scrollTrigger?.kill();
      tween.kill();
      setRitualPresentation(false, false);
    };
  }, [ready, reduced]);

  return (
    <div
      className="bar-scroll"
      id="ritual"
      ref={container}
      data-bar-experience
      data-scene-ready={ready && !failed}
      data-reduced-motion={reduced}
      data-scene-failed={failed}
    >
      <div className="bar-experience">
        <figure
          className="bar-experience__viewport"
          aria-label="При прокрутке стальной шейкер встряхивается, разделяется и наливает янтарный коктейль. Готовый напиток сменяется видом живой сцены."
        >
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
        </figure>
      </div>
    </div>
  );
}
