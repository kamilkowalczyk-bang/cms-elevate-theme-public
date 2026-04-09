import { useEffect } from 'react';

const MOBILE_BREAKPOINT = 1100;
const SCROLL_UP_THRESHOLD = 40;

export default function StickyNavIsland() {
  useEffect(() => {
    const stickyHeaderRoot = document.querySelector('.hs-elevate-site-header--sticky-navigation-desktop');
    const header = stickyHeaderRoot?.closest('.hs-elevate-header') as HTMLElement | null;

    if (!header) {
      return;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    let lastScrollY = window.scrollY;
    let accumulatedScrollUp = 0;
    let heroHeight = 0;

    const clearStickyState = () => {
      header.classList.remove('hs-elevate-header--sticky-fixed', 'hs-elevate-header--scrolling-down', 'hs-elevate-header--scrolling-up');
    };

    const resolveHeroHeight = () => {
      // Prefer explicit hero class; fallback to theme slider wrapper; fallback to header height.
      const hero = document.querySelector('.hero, .hs-elevate-header-slider') as HTMLElement | null;
      heroHeight = Math.round(hero?.getBoundingClientRect().height ?? header.offsetHeight);
    };

    const onScroll = () => {
      if (mediaQuery.matches) {
        clearStickyState();
        lastScrollY = window.scrollY;
        accumulatedScrollUp = 0;
        return;
      }

      const scrollY = window.scrollY;
      const isFixed = scrollY > heroHeight;
      header.classList.toggle('hs-elevate-header--sticky-fixed', isFixed);

      if (!isFixed) {
        header.classList.remove('hs-elevate-header--scrolling-down', 'hs-elevate-header--scrolling-up');
        lastScrollY = scrollY;
        accumulatedScrollUp = 0;
        return;
      }

      if (scrollY > lastScrollY) {
        accumulatedScrollUp = 0;
        header.classList.add('hs-elevate-header--scrolling-down');
        header.classList.remove('hs-elevate-header--scrolling-up');
      } else if (scrollY < lastScrollY) {
        accumulatedScrollUp += lastScrollY - scrollY;
        if (accumulatedScrollUp > SCROLL_UP_THRESHOLD) {
          header.classList.add('hs-elevate-header--scrolling-up');
          header.classList.remove('hs-elevate-header--scrolling-down');
        }
      }

      lastScrollY = scrollY;
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
