import { useEffect } from 'react';

export let threadListCache = [];
export const resetThreadListCache = () => threadListCache = [];

export function useThreadListCache(fetcher, setThreadList, page) {
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
  }, [fetcher.data?.threads, fetcher.data?.nextPageNum, setThreadList, page]);
}
