export function dragHtmlElement(e) {
  e.preventDefault();
  const elementToDrag = e.currentTarget.parentElement;

  // The current mouse position
  let x = e.clientX, y = e.clientY;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  function onMouseMove(e) {
    // How far mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    const { top, left, right, bottom } = elementToDrag.getBoundingClientRect();

    if (top + dy > 0 && bottom + dy < window.innerHeight) {
      elementToDrag.style.top = top + dy + 'px';
    }
    if (left + dx > 0 && right + dx < window.innerWidth) {
      elementToDrag.style.left = left + dx + 'px';
    }

    // Reassign mouse position
    x = e.clientX;
    y = e.clientY;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

export function toggleFloatingForm(ev, post = undefined, force = undefined) {
  const formWrapper = document.querySelector('.floatingFormWrapper');
  formWrapper.classList.toggle('hidden', force);

  if (post) {
    const form = formWrapper.querySelector('.postForm');
    formWrapper.querySelector('output').innerText = post.id;

    form.action = (
      `/${post.board}/`
      + 'thread/'
      + `${post.thread ?? post.id}/`
    ).replace('//', '/');
  }
}

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
