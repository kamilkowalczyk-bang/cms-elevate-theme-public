import { useEffect } from 'react';

const MOBILE_BREAKPOINT = 1100;
const EXIT_ANIMATION_NAME = 'hs-elevate-header__fade-out';
// Safety net in case `animationend` doesn't fire (e.g. background tab, interrupted animation).
// Must be greater than the CSS animation duration.
const EXIT_FALLBACK_MS = 400;
// CSS variable used by the stylesheet to reserve the outer `<header>`'s natural in-flow space
// while its inner `.hs-elevate-site-header` is `position: fixed`. Keeping this space reserved
// prevents the rest of the page from shifting when the sticky state toggles.
const RESERVED_HEIGHT_VAR = '--hs-elevate-header-sticky-height';

export default function StickyNavIsland() {
  useEffect(() => {
    const stickyHeaderRoot = document.querySelector('.hs-elevate-site-header--sticky-navigation-desktop') as HTMLElement | null;
    const header = stickyHeaderRoot?.closest('.hs-elevate-header') as HTMLElement | null;

    if (!header || !stickyHeaderRoot) {
      return;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let heroHeight = 0;
    let wasFixed = false;
    let exitAnimationListener: ((event: AnimationEvent) => void) | null = null;
    let exitFallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const clearExitState = () => {
      if (exitAnimationListener) {
        header.removeEventListener('animationend', exitAnimationListener);
        exitAnimationListener = null;
      }
      if (exitFallbackTimer != null) {
        clearTimeout(exitFallbackTimer);
        exitFallbackTimer = null;
      }
    };

    // Records the inner sticky bar's current rendered height into a CSS variable on the outer
    // `<header>`. Stylesheet reads it as `min-height` so the outer keeps reserving that space
    // while its inner is fixed. Using the inner's `offsetHeight` works in both states (its
    // rendered height is the same whether it's `position: relative` or `position: fixed`).
    const updateReservedHeight = () => {
      header.style.setProperty(RESERVED_HEIGHT_VAR, `${stickyHeaderRoot.offsetHeight}px`);
    };

    const clearReservedHeight = () => {
      header.style.removeProperty(RESERVED_HEIGHT_VAR);
    };

    const clearStickyState = () => {
      clearExitState();
      header.classList.remove('hs-elevate-header--sticky-fixed', 'hs-elevate-header--sticky-exiting');
      clearReservedHeight();
    };

    const resolveHeroHeight = () => {
      // Prefer explicit hero class; fallback to theme slider wrapper; fallback to header height.
      const hero = document.querySelector('.hero, .hs-elevate-header-slider') as HTMLElement | null;
      heroHeight = Math.round(hero?.getBoundingClientRect().height ?? header.offsetHeight);
    };

    const enterSticky = () => {
      // Cancels any in-flight exit so the header stays put instead of finishing its fade-out.
      clearExitState();
      header.classList.remove('hs-elevate-header--sticky-exiting');

      // Lock in the reserved height *before* the inner becomes `position: fixed`, so the outer's
      // natural footprint is captured while the inner is still in normal flow contributing to it.
      if (!header.classList.contains('hs-elevate-header--sticky-fixed')) {
        updateReservedHeight();
      }
      header.classList.add('hs-elevate-header--sticky-fixed');
    };

    const exitSticky = () => {
      clearExitState();

      if (reducedMotionQuery.matches) {
        header.classList.remove('hs-elevate-header--sticky-fixed', 'hs-elevate-header--sticky-exiting');
        clearReservedHeight();
        return;
      }

      const finishExit = () => {
        clearExitState();
        header.classList.remove('hs-elevate-header--sticky-fixed', 'hs-elevate-header--sticky-exiting');
        clearReservedHeight();
      };

      exitAnimationListener = (event: AnimationEvent) => {
        if (event.animationName !== EXIT_ANIMATION_NAME) return;
        finishExit();
      };
      header.addEventListener('animationend', exitAnimationListener);
      exitFallbackTimer = setTimeout(finishExit, EXIT_FALLBACK_MS);

      header.classList.add('hs-elevate-header--sticky-exiting');
    };

    const onScroll = () => {
      if (mediaQuery.matches) {
        clearStickyState();
        wasFixed = false;
        return;
      }

      const scrollY = window.scrollY;
      const isFixed = scrollY > heroHeight;

      if (isFixed && !wasFixed) {
        enterSticky();
      } else if (!isFixed && wasFixed) {
        exitSticky();
      }

      wasFixed = isFixed;
    };

    const onResize = () => {
      resolveHeroHeight();
      // While sticky, the header height can change at internal desktop breakpoints. Refresh the
      // reserved-height var so the outer keeps matching the visible fixed bar.
      if (header.classList.contains('hs-elevate-header--sticky-fixed')) {
        updateReservedHeight();
      }
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
