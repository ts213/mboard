import { useMatches } from 'react-router-dom';

const ROUTES_LIST = ['indexPage', 'board', 'thread', 'boards'];

export function useCurrentRoute() {
  const routes_matched = useMatches();

  return routes_matched.find(match => ROUTES_LIST.includes(match.id));
}
