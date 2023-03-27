import { useCallback, useEffect, useRef } from 'react';
import { routeLoader } from '../App.jsx';

export function useFetchPaginatedPosts(intersectionRef, setPostList) {
  const currentPage = useRef(1);
  const prevY = useRef(0); // last intersection y position

  const fetchPosts = useCallback(async (page = 1) => {
    const url = location.href + '?page=' + page;
    const response = await routeLoader({ url: url });

    if (response?.threads) {
      setPostList(p => [...p, ...response.threads]);
      if (response.next) return;
    }
    return currentPage.current = 0;  // no more pages to fetch
  }, [setPostList]);

  useEffect(() => {
    if (!fetchPosts.called) {  // prevent react strict mode messing it all up...
      void fetchPosts();
      fetchPosts.called = true;
    }
    return () => setPostList([]);
  }, [fetchPosts, setPostList]);

  useEffect(() => {
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
