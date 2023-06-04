import tippy from 'tippy.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { Post } from '../components/parts/Post.jsx';

const displayTooltipsFor = ['quote-link', 'reply-link'];

export async function showTooltip(ev, threadList, dateNow, board, onImageClick) {
  if (
    displayTooltipsFor.some(klass => ev.target.classList.contains(klass))
    && !Object.hasOwn(ev.target, '_tippy')
  ) {
    const regex = /#(\d+)/;
    const quotedPostId = ev.target.href.match(regex)[1];  // [1] first matched group

    let tooltipContent;
    let quotedElement = document.getElementById(quotedPostId);

    if (quotedElement) {
      let quotedElementClone = quotedElement.cloneNode(true);
      quotedElementClone.onclick = onImageClick;
      tooltipContent = quotedElementClone;
    } else {
      const postJson = await fetchPostFromServer(quotedPostId, board);
      if (postJson) {
        let postContainer = document.createElement('article');
        postContainer.innerHTML = renderToStaticMarkup(<Post post={postJson} dateNow={dateNow} />);
        postContainer.onclick = onImageClick;
        tooltipContent = postContainer;
      } else {
        tooltipContent = '<p>Not found</p>';
      }
    }

    tooltipProps.content = tooltipContent;
    tooltipProps.appendTo = ev.nativeEvent.target.closest('.thread');
    tippy(ev.nativeEvent.target, tooltipProps);
  }
}

const tooltipProps = {
  role: 'tooltip',
  interactive: true,
  allowHTML: true,
  placement: 'top-end',
  showOnCreate: true,
  arrow: false,
  delay: [100, 100],
  maxWidth: 'none',
  // appendTo: document.body,
};


async function fetchPostFromServer(quotedPostId, board) {
  let url = '/api' + `/${board}/thread/${quotedPostId}/`;
  const r = await fetch(url);
  if (!r.ok) {
    return;
  }
  const { thread: post } = await r.json();
  return post;
}
