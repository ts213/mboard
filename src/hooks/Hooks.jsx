import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';

export function useOutsideClick(ref, onClickOut, onClickIn) {
  useEffect(() => {
    const onClick = ({ target }) => {
      if (!ref.current?.contains(target)) {
        onClickOut();
        return;
      }
      onClickIn(target);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [onClickIn, onClickOut, ref]);
}

export function useCurrentRoute() {
  const ROUTES_LIST = ['indexPage', 'board', 'thread', 'boards'];
  const routes_matched = useMatches();

  return routes_matched.find(match => ROUTES_LIST.includes(match.id));
}
