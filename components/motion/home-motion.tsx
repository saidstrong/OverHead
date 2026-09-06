'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HomeMotion() {
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.from('[data-hero-line]', {
        opacity: 0,
        y: 32,
        duration: 0.8,
        stagger: 0.09,
        ease: 'power3.out',
      });

      gsap.to('[data-hero-visual]', {
        rotate: 8,
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 42,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        });
      });

      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-music-transition]',
          start: 'top 82%',
          end: 'bottom 35%',
          scrub: 0.9,
        },
      });

      transition
        .fromTo(
          '[data-music-transition]',
          { backgroundColor: '#6e381f', color: '#f1eee5' },
          { backgroundColor: '#25173d', color: '#d6ff32', ease: 'none' },
          0,
        )
        .fromTo(
          '[data-string]',
          { scaleX: 0.08, opacity: 0.22 },
          { scaleX: 1, opacity: 1, stagger: 0.04, ease: 'power2.inOut' },
          0,
        )
        .to(
          '[data-bar-light]',
          { filter: 'saturate(0.82) brightness(0.78)', ease: 'none' },
          0,
        );
    });

    return () => context.revert();
  }, []);

  return null;
}
