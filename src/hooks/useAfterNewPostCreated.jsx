import { useEffect } from 'react';

export function useAfterNewPostCreated(dispatch, fetcher) {
  useEffect(() => {
    if (fetcher.data?.created === 1) {
      dispatch({ type: 'textEdited', value: '' });
      dispatch({ type: 'fileListChange', value: [] });
      delete fetcher.data.created;
    }

  }, [dispatch, fetcher.data?.created]);
}

/** @property {number} fetcher.data.created */
