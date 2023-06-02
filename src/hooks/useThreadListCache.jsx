import { useEffect } from 'react';
import { page } from './useThreadsPagination.jsx';

export let threadListCache = [];

export function useThreadListCache(fetcher, setThreadList) {
  useEffect(() => {
    if (fetcher.data?.threads) {
      setThreadList(threads => {
        const withNewThreads = [...threads, ...fetcher.data.threads];
        threadListCache = withNewThreads;
        return withNewThreads;
      });
    }

    if (fetcher.data?.nextPageNum === null) {
      page.nextPageNum = false;
    }
  }, [fetcher.data?.threads, fetcher.data?.nextPageNum, setThreadList]);
}
