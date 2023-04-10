import { useCallback, useEffect, useRef } from 'react';
import { threadListLoader } from '../components/routes/ThreadList.jsx';

export function useFetchPaginatedThreads(intersectionRef, setThreads) {
  const currentPage = useRef(1);
  const prevY = useRef(0); // last intersection y position

  const fetchPosts = useCallback(async (page = 1) => {
    const url = location.href + '?page=' + page;
    const response = await threadListLoader({ url: url });

    if (response?.threads) {
      setThreads(p => [...p, ...response.threads]);
      if (response.nextPage) return;
    }
    return currentPage.current = 0;  // no more pages to fetch
  }, [setThreads]);

  useEffect(() => {  // initial loading
    if (!fetchPosts.called) {  // prevent react strict mode messing it all up...
      void fetchPosts();
      fetchPosts.called = true;
    }
    return () => setThreads([]);
  }, [fetchPosts, setThreads]);

  useEffect(() => {  // when scrolled to page bottom
    const observer = new IntersectionObserver(observerHandler, { threshold: 1.0 });
    observer.observe(intersectionRef.current);

    function observerHandler(target) {
      const y = target[0].boundingClientRect.y;

      if (prevY.current > y && currentPage.current) {  // falls if currentPage == 0
        void fetchPosts(currentPage.current += 1);
      }

      prevY.current = y;
    }
  }, [fetchPosts, intersectionRef]);
}
