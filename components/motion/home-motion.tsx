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
      const isMobile = window.matchMedia('(max-width: 820px)').matches;

      gsap.from('[data-hero-line]', {
        opacity: 0,
        y: 36,
        duration: 0.85,
        stagger: 0.085,
        ease: 'power3.out',
      });

      const heroShaker = document.querySelector('[data-hero-shaker]');
      const heroReflection = document.querySelector('[data-hero-reflection]');
      const heroIdle = gsap.timeline({ repeat: -1, yoyo: true });

      heroIdle.to(heroShaker, {
        y: 7,
        rotate: -1.15,
        transformOrigin: '50% 54%',
        duration: 3.6,
        ease: 'sine.inOut',
      });

      const reflectionIdle = gsap.to(heroReflection, {
        x: 24,
        opacity: 0.28,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top bottom',
        end: 'bottom top',
        onLeave: () => {
          heroIdle.pause();
          reflectionIdle.pause();
        },
        onEnterBack: () => {
          heroIdle.play();
          reflectionIdle.play();
        },
      });

      gsap.to('[data-hero-visual]', {
        rotate: isMobile ? 2 : 5,
        yPercent: isMobile ? 4 : 9,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.75,
        },
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: isMobile ? 28 : 42,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 89%',
            once: true,
          },
        });
      });

      const story = document.querySelector<HTMLElement>(
        '[data-cocktail-story]',
      );

      if (story) {
        const shaker = story.querySelector('[data-story-shaker]');
        const lowerTin = story.querySelector('[data-shaker-lower]');
        const upperTin = story.querySelector('[data-shaker-upper]');
        const seam = story.querySelector('.cocktail-visual__seam');
        const stream = story.querySelector('[data-pour-stream]');
        const streamPaths = stream?.querySelectorAll('path');
        const liquid = story.querySelector('[data-liquid-level]');
        const glass = story.querySelector('[data-cocktail-glass]');
        const ice = story.querySelector('[data-ice]');
        const ripple = story.querySelector('[data-impact-ripple]');
        const cocktailCopy = story.querySelector('[data-cocktail-copy]');
        const shakeWord = story.querySelector('[data-shake-word]');
        const pourWord = story.querySelector('[data-pour-word]');
        const progress = story.querySelectorAll(
          '.cocktail-story__progress span',
        );

        gsap.set(glass, { opacity: 0.28 });
        gsap.set(liquid, { scaleY: 0.03, transformOrigin: '50% 100%' });
        gsap.set(stream, { opacity: 0 });
        gsap.set(streamPaths ?? [], {
          strokeDasharray: 330,
          strokeDashoffset: 330,
        });
        gsap.set(cocktailCopy, {
          opacity: 0,
          x: isMobile ? 0 : 44,
          y: 20,
        });
        gsap.set([shakeWord, pourWord], { opacity: 0, y: 24 });
        gsap.set(progress, { opacity: 0.25 });
        gsap.set(progress[0], { opacity: 1, color: '#d6ff32' });

        const cocktailTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: story,
            start: 'top top',
            end: () => `+=${window.innerHeight * (isMobile ? 1.05 : 1.35)}`,
            scrub: 0.65,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        cocktailTimeline
          .to(shakeWord, { opacity: 1, y: 0, duration: 0.12 }, 0)
          .to(
            shaker,
            {
              keyframes: [
                { x: -16, rotate: -4, duration: 0.08 },
                { x: 18, rotate: 4.5, duration: 0.08 },
                { x: -12, rotate: -3, duration: 0.08 },
                { x: 10, rotate: 2.5, duration: 0.08 },
                { x: 0, rotate: 0, duration: 0.12 },
              ],
              transformOrigin: '50% 48%',
              ease: 'power1.inOut',
            },
            0.09,
          )
          .to(progress[0], {
            opacity: 0.25,
            color: '#f1eee5',
            duration: 0.06,
          })
          .to(
            progress[1],
            { opacity: 1, color: '#d6ff32', duration: 0.06 },
            '<',
          )
          .to(shakeWord, { opacity: 0.12, y: -18, duration: 0.12 })
          .to(
            upperTin,
            {
              x: isMobile ? -72 : -108,
              y: isMobile ? -72 : -92,
              rotate: -13,
              opacity: 0.34,
              transformOrigin: '50% 80%',
              duration: 0.18,
              ease: 'power2.inOut',
            },
            '<',
          )
          .to(seam, { opacity: 0, duration: 0.08 }, '<')
          .to(
            lowerTin,
            {
              x: isMobile ? -252 : -265,
              y: isMobile ? -44 : -24,
              rotate: 56,
              transformOrigin: '50% 36%',
              duration: 0.24,
              ease: 'power2.inOut',
            },
            '>',
          )
          .to(glass, { opacity: 1, duration: 0.08 }, '<')
          .to(pourWord, { opacity: 1, y: 0, duration: 0.1 }, '<')
          .to(progress[1], {
            opacity: 0.25,
            color: '#f1eee5',
            duration: 0.05,
          })
          .to(
            progress[2],
            { opacity: 1, color: '#d6ff32', duration: 0.05 },
            '<',
          )
          .to(stream, { opacity: 1, duration: 0.05 })
          .to(
            streamPaths ?? [],
            { strokeDashoffset: 0, duration: 0.28, ease: 'none' },
            '<',
          )
          .to(
            liquid,
            { scaleY: 1, duration: 0.28, ease: 'power1.in' },
            '<+0.03',
          )
          .to(
            ice,
            { y: -8, rotate: 2, duration: 0.14, ease: 'power1.out' },
            '<+0.12',
          )
          .fromTo(
            ripple,
            { scale: 0.7, opacity: 0.75, transformOrigin: '50% 50%' },
            { scale: 1.45, opacity: 0, duration: 0.16, ease: 'power1.out' },
            '<+0.07',
          )
          .to(stream, { opacity: 0, duration: 0.1 })
          .to(pourWord, { opacity: 0.1, y: -14, duration: 0.08 }, '<')
          .to(progress[2], {
            opacity: 0.25,
            color: '#f1eee5',
            duration: 0.05,
          })
          .to(
            progress[3],
            { opacity: 1, color: '#d6ff32', duration: 0.05 },
            '<',
          )
          .to(cocktailCopy, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
          })
          .to(glass, { y: -5, duration: 0.15, ease: 'sine.inOut' }, '<');
      }

      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-music-transition]',
          start: 'top 84%',
          end: 'bottom 28%',
          scrub: 0.8,
        },
      });

      transition
        .fromTo(
          '[data-transition-glint]',
          { scaleY: 0.05, opacity: 0.85 },
          {
            scaleY: 1,
            opacity: 0.18,
            transformOrigin: 'top',
            duration: 0.28,
          },
          0,
        )
        .fromTo(
          '[data-music-transition]',
          { backgroundColor: '#4c2818', color: '#f1eee5' },
          {
            backgroundColor: '#0f0e0d',
            color: '#d6ff32',
            ease: 'none',
            duration: 0.45,
          },
          0,
        )
        .fromTo(
          '[data-string]',
          { scaleX: 0.04, opacity: 0.18 },
          {
            scaleX: 1,
            opacity: 1,
            stagger: 0.025,
            ease: 'power2.inOut',
            duration: 0.32,
          },
          0.22,
        )
        .fromTo(
          '[data-amp-cone]',
          { scale: 0.76, opacity: 0 },
          { scale: 1, opacity: 0.72, ease: 'power2.out', duration: 0.25 },
          0.28,
        )
        .fromTo(
          '[data-transition-line]',
          { yPercent: 105 },
          {
            yPercent: 0,
            stagger: 0.08,
            ease: 'power3.out',
            duration: 0.22,
          },
          0.18,
        )
        .to(
          '[data-bar-light]',
          {
            filter: 'saturate(0.7) brightness(0.56)',
            ease: 'none',
            duration: 0.28,
          },
          0,
        );
    });

    return () => context.revert();
  }, []);

  return null;
}
