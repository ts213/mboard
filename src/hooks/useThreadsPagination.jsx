import { useCallback, useRef } from 'react';

// should be outside in order to properly work when going back to thread list from thread page
// since react router loads out components when url changes; can't keep state inside
export let page = {
  current: undefined,
  nextPageNum: undefined,
  board: undefined,
  increment() {
    this.current++;
  },
  reset() {
    this.current = undefined;
    this.nextPageNum = undefined;
    this.board = undefined;
  },
};

export function useThreadsPagination(fetcher, pageNum, nextPageNum, board) {
  const prevY = useRef(0);
  page.board ??= board;
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
