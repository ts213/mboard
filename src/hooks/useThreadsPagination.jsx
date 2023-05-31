import { useCallback, useRef } from 'react';

// should be outside in order to properly work when going back to thread list from thread page
// since react router loads out components when url changes; can't keep state inside
// gets reset on board list page to prevent bug: if page 2 loaded on board 1, then on board 2 page 3 gets loaded
export let page = {
  current: undefined,
  nextPageNum: undefined,
  increment() {
    this.current++;
  },
};

export function useThreadsPagination(fetcher, pageNum, nextPageNum) {
  const prevY = useRef(0); // last intersection y position

  page.current ??= pageNum;  // init
  page.nextPageNum ??= nextPageNum;

  return useCallback(function (intersectionRef) {
    if (!intersectionRef) {
      return;
    }
    const observer = new IntersectionObserver(observerHandler, { threshold: 1.0 });
    observer.observe(intersectionRef);

    function observerHandler(target) {
      const y = target[0].boundingClientRect.y;

      if (prevY.current > y && page.nextPageNum) {
        page.increment();
        fetcher.load(location.pathname + '?page=' + page.current);
      }

      prevY.current = y;
    }

    // eslint-disable-next-line
  }, []);
}
