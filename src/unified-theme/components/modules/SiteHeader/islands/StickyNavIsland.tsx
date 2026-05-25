import { useEffect } from 'react';

const MOBILE_BREAKPOINT = 1100;

export default function StickyNavIsland() {
  useEffect(() => {
    const stickyHeaderRoot = document.querySelector('.hs-elevate-site-header--sticky-navigation-desktop');
    const header = stickyHeaderRoot?.closest('.hs-elevate-header') as HTMLElement | null;

    if (!header) {
      return;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    let heroHeight = 0;

    const clearStickyState = () => {
      header.classList.remove('hs-elevate-header--sticky-fixed');
    };

    const resolveHeroHeight = () => {
      // Prefer explicit hero class; fallback to theme slider wrapper; fallback to header height.
      const hero = document.querySelector('.hero, .hs-elevate-header-slider') as HTMLElement | null;
      heroHeight = Math.round(hero?.getBoundingClientRect().height ?? header.offsetHeight);
    };

    const onScroll = () => {
      if (mediaQuery.matches) {
        clearStickyState();
        return;
      }

      const scrollY = window.scrollY;
      const isFixed = scrollY > heroHeight;
      header.classList.toggle('hs-elevate-header--sticky-fixed', isFixed);
    };

    const onResize = () => {
      resolveHeroHeight();
      onScroll();
    };

    resolveHeroHeight();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    mediaQuery.addEventListener('change', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      mediaQuery.removeEventListener('change', onResize);
      clearStickyState();
    };
  }, []);

  return null;
}
