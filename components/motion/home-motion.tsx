'use client';
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HomeMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const mobile = window.matchMedia('(max-width: 820px)').matches;
      gsap.from('[data-hero-line]', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.085,
        ease: 'power3.out',
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: mobile ? 20 : 32,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        });
      });
    });
    return () => media.revert();
  }, []);
  return null;
}
