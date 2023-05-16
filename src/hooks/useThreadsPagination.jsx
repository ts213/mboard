import { useCallback, useRef } from 'react';

export let page = {
  current: undefined,
  nextPageNum: undefined,
  increment() {
    this.current++;
  }
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
