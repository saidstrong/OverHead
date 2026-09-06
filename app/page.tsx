import { AtmosphereSection } from '@/components/sections/atmosphere-section';
import { EventsSection } from '@/components/sections/events-section';
import { HeroSection } from '@/components/sections/hero-section';
import { MenuSection } from '@/components/sections/menu-section';
import { MusicTransition } from '@/components/sections/music-transition';
import { SignatureDrinksSection } from '@/components/sections/signature-drinks-section';
import { SiteFooter } from '@/components/sections/site-footer';
import { TonightSection } from '@/components/sections/tonight-section';
import { VisitSection } from '@/components/sections/visit-section';
import { HomeMotion } from '@/components/motion/home-motion';

export default function Home() {
  return (
    <main>
      <HomeMotion />
      <HeroSection />
      <TonightSection />
      <SignatureDrinksSection />
      <MusicTransition />
      <EventsSection />
      <MenuSection />
      <AtmosphereSection />
      <VisitSection />
      <SiteFooter />
    </main>
  );
}
