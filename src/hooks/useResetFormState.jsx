import { useEffect } from 'react';
import { toggleFloatingForm } from '../utils/utils.js';

export function useResetFormState(dispatch, fetcher) {
  useEffect(() => {
    dispatch({ type: 'textEdited', value: '' });
    dispatch({ type: 'fileListChange', value: [] });

    toggleFloatingForm({ force: true });

    delete fetcher.data?.created;

  }, [dispatch, fetcher.data?.created]);
}

/** @property {number: 1|0} fetcher.data.created */
