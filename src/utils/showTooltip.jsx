import tippy from 'tippy.js';
import { Post } from '../components/parts/Post.jsx';
import { renderToStaticMarkup } from 'react-dom/server';
import { VITE_API_PREFIX } from '../App.jsx';

const displayTooltipsFor = ['quote-link', 'reply-link'];

export async function showTooltip(ev, threadList, dateNow, board) {
  if (
    displayTooltipsFor.some(klass => ev.target.classList.contains(klass))
    && !Object.hasOwn(ev.target, '_tippy')
  ) {
    const regex = /#(\d+)/;
    const quotedPostId = ev.target.href.match(regex)[1];  // [1] first matched group

    // noinspection EqualityComparisonWithCoercionJS
    let postObject = threadList.concat(
      threadList.flatMap(thread => thread.replies)
    ).find(post => post.id == quotedPostId);

    if (!postObject) {
      try {
        const request = new Request(`/${board}/thread/${quotedPostId}/`);
        postObject = await loader(request);
      } catch {
        tooltipProps.content = '';
        tippy(ev.nativeEvent.target, tooltipProps);
        return;
      }
    }
    tooltipProps.content = renderToStaticMarkup(<Post post={postObject} dateNow={dateNow} />);
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
  delay: [150, 150],
  maxWidth: 'none',
  // appendTo: document.body,
  // onHidden: instance => instance.destroy(),
};


async function loader(request) {
  let url = VITE_API_PREFIX + new URL(request.url).pathname;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  const { thread: post } = await r.json();
  return post;
}
