import { useEffect } from 'react';
import { toggleFloatingForm } from '../utils/utils.js';

export function useResetFormState(dispatch) {
  useEffect(() => {
    dispatch({ type: 'textEdited', value: '' });
    dispatch({ type: 'fileListChange', value: [] });

    toggleFloatingForm({ force: true });

  }, [dispatch]);
}
