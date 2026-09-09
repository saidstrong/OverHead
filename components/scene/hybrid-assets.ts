export type PlateSource = { desktop: string; mobile?: string };

// Approved artwork. Both cocktail plates share one registration and transform.
export const cocktailRegistration = { rim: 0.215, base: 0.875, aspect: 0.8 };
export const hybridAssets: {
  prepared: PlateSource | null;
  served: PlateSource | null;
  stage: PlateSource | null;
} = {
  prepared: {
    desktop: '/media/overhead/overhead-cocktail-prepared-desktop.webp',
    mobile: '/media/overhead/overhead-cocktail-prepared-mobile.webp',
  },
  served: {
    desktop: '/media/overhead/overhead-cocktail-served-desktop.webp',
    mobile: '/media/overhead/overhead-cocktail-served-mobile.webp',
  },
  stage: {
    desktop: '/media/overhead/overhead-stage-desktop.webp',
    mobile: '/media/overhead/overhead-stage-mobile.webp',
  },
};
