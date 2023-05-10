import tippy from 'tippy.js';
import { Post } from '../components/parts/Post.jsx';
import { renderToStaticMarkup } from 'react-dom/server';
import { api_prefix } from '../App.jsx';

export async function showTooltip(ev, threadList, dateNow) {
  if (ev.target.classList.contains('quote-link') && !Object.hasOwn(ev.target, '_tippy')) {
    const regex = /#(\d+)/;
    const quotedPostId = ev.target.href.match(regex)[1];  // [1] first matched group

    let postObject = threadList.concat(
      threadList.flatMap(thread => thread.replies)
    ).find(post => post.id == quotedPostId);

    if (!postObject) {
      try {
        const request = new Request(`/post/${quotedPostId}/`);
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
  // onHidden: instance => instance.destroy(),
};


async function loader(request) {
  let url = api_prefix + new URL(request.url).pathname;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Response('loader error', { status: r.status });
  }
  return r.json();
}
