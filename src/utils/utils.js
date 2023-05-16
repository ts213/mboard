export function dragHtmlElement(e) {
  e.preventDefault();
  const elementToDrag = e.currentTarget.parentElement;

  let x = e.clientX, y = e.clientY; // The current mouse position

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  function onMouseMove(e) {
    const dx = e.clientX - x;  // How far mouse has been moved
    const dy = e.clientY - y;

    const { top, left, right, bottom } = elementToDrag.getBoundingClientRect();

    if (top + dy > 0 && bottom + dy < window.innerHeight) {
      elementToDrag.style.top = top + dy + 'px';
    }
    if (left + dx > 0 && right + dx < window.innerWidth) {
      elementToDrag.style.left = left + dx + 'px';
    }

    x = e.clientX; // Reassign mouse position
    y = e.clientY;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

export function toggleFloatingForm({ force, post, dispatch } = {}) {
  const formWrapper = document.querySelector('.floatingFormWrapper');
  if (!formWrapper) {
    return;
  }
  formWrapper.classList.toggle('hidden', force);

  if (post && dispatch) {
    const form = formWrapper.querySelector('.postForm');
    formWrapper.querySelector('output').innerText = post.id;

    form.action = (
      `/${post.board}/`
      + 'thread/'
      + `${post.thread ?? post.id}/`
    ).replace('//', '/');

    const textArea = formWrapper.querySelector('textarea');
    const selStart = textArea.selectionStart;
    dispatch({ type: 'insertQuoteId', value: { selStart, postId: post.id, textArea } });
    setTimeout(() => textArea.focus(), 100);
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

export const onQuotedPostClick = (() => {  // react-router rerenders everything on hash change (??), workaround
  const displayTooltipsFor = ['quote-link', 'reply-link'];
  let previousHightlightedPost;

  function highlightQuotedPost(quotedPost) {
    if (previousHightlightedPost) {
      previousHightlightedPost.style.backgroundColor = '';
    }
    quotedPost.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
    previousHightlightedPost = quotedPost;
  }

  return function (ev) {
    if (displayTooltipsFor.some(klass => klass === ev.target.className)) {
      ev.preventDefault();
      const quotedPost = document.getElementById(`${ev.target.dataset.quoted}`);

      if (quotedPost && !quotedPost.closest('.tippy-content')) {
        highlightQuotedPost(quotedPost);
        quotedPost.scrollIntoView({ block: 'center' });
      }
    }
  }
})();

export function addRepliesToPosts() {
  const quotes = document.querySelectorAll('.quote-link');
  quotes.forEach(quoteElmnt => {
    try {
      const quotedPost = document.getElementById(quoteElmnt.dataset.quoted);
      const replyId = quoteElmnt.closest('article').id;

      if (quotedPost.querySelector(`#reply-${replyId}`)) {
        return;
      }

      const replyElement = createAnchorElmnt(replyId);
      quotedPost.querySelector('sub').appendChild(replyElement);
    } catch { /* empty */
    }
  });

  function createAnchorElmnt(replyId) {
    const a = document.createElement('a');
    a.id = `reply-${replyId}`;
    a.dataset.quoted = `${replyId}`;
    a.href = `#${replyId}`;
    a.text = `>>${replyId}`;
    a.className = 'reply-link';
    return a;
  }
}

export const toRelativeTime = (function () {
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto', style: 'short' });

  const timeUnits = new Set([
    { interval: 60, timeUnit: 'minutes' },
    { interval: 24, timeUnit: 'hours' },
    { interval: 7, timeUnit: 'days' },
    { interval: 4.34524, timeUnit: 'weeks' },
    { interval: 12, timeUnit: 'months' },
    { interval: Number.POSITIVE_INFINITY, timeUnit: 'years' }
  ]);

  return function (postDateSecs, dateNow) {
    const postDateMsec = new Date(postDateSecs * 1000);
    let timeDiff = (postDateMsec - dateNow) / 60_000;  // millsecs to minutes

    for (const unit of timeUnits) {
      if (Math.abs(timeDiff) < unit.interval) {
        return formatter.format(Math.round(timeDiff), unit.timeUnit);
      }
      timeDiff /= unit.interval;
    }
  }
})();
