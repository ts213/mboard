export function setDocumentTitle(route) {
  if (!route) {
    return;
  }

  switch (route.id) {
    case 'boards':
      setTitle('boards');
      break;
    case 'board':
      setTitle(route.data?.board);
      break;
    case 'thread':
      setTitle(route.data?.thread?.text);
      break;
  }

  function setTitle(title) {
    if (!title) {
      return;
    }
    document.title = title.length > 50
      ? title.slice(0, 50)
      : title;
  }
}
