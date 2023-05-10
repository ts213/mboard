import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useAfterNewPostCreated(fetcher, dispatch) {
  const params = useParams();

  useEffect(() => {
    dispatch({ type: 'textEdited', value: '' });
    dispatch({ type: 'fileListChange', value: [] });

  }, [dispatch, params]);
}
