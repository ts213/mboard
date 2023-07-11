import { useCallback, useEffect, useRef } from 'react';

export let page = {
  current: 1,
  nextPageNum: undefined,
  reset() {
    this.current = 1;
    this.nextPageNum = undefined;
  },
};

export let threadListCache = [];
export const resetThreadListCache = () => void (threadListCache = []);

export function useThreadsPagination(fetcher, nextPageNum, setThreadList) {
  const prevY = useRef(0);  // last intersection y position

  useEffect(() => {
    page.nextPageNum ??= nextPageNum;  // init

    if (fetcher.data) {  // after paginated
      page.nextPageNum = fetcher.data?.nextPageNum;
    }

    if (fetcher.data?.threads) {  // after paginated
      setThreadList(threads => {
        threadListCache = [...threads, ...fetcher.data.threads];
        return threadListCache;
      });
    }

  }, [fetcher.data, nextPageNum, setThreadList]);

  return useCallback(function (intersectionRef) {
    if (!intersectionRef) {
      return;
    }
    const observer = new IntersectionObserver(observerHandler, { threshold: 1.0 });
    observer.observe(intersectionRef);

    function observerHandler(target) {
      const y = target[0].boundingClientRect.y;

      if (prevY.current > y && page.nextPageNum) {
        fetcher.load(location.pathname + '?page=' + (page.current += 1));
      }

      prevY.current = y;
    }

    // eslint-disable-next-line
  }, []);
}
