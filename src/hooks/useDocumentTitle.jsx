import { useMatches } from 'react-router-dom';

const ROUTES_LIST = ['boards', 'board', 'thread',];

export function useDocumentTitle() {
  const routes_matched = useMatches();

  const route = routes_matched.find(match => ROUTES_LIST.includes(match.id));

  if (!route) return;

  switch (route.id) {
    case 'boards':
      document.title = 'boards';
      return;
    case 'board':
      route.data?.board && (document.title = route.data.board);
      return;
    case 'thread':
      route.data?.thread?.text && (document.title = route.data.thread.text.slice(0, 50));
      return;
  }
}
