import tippy from 'tippy.js';

export function tooltipsOnHover(ev) {
  if (ev.target.classList.contains('quote-link') && !Object.hasOwn(ev.target, '_tippy')) {
    const regex = /#(\d+)/;
    const quotedPostId = ev.target.href.match(regex)[1];  // [1] is the first matched group
    let quotedPostElement;
    try {
      quotedPostElement = document.getElementById(quotedPostId).cloneNode(true);
    } catch {
      quotedPostElement = `
                      <span style="font-size: 20px; background-color: red; padding: 10px">
                        post not found
                      </span>`;
    }

    tippy(ev.target, {
      content: quotedPostElement,
      ...tippyProps,
    });
  }
}

const tippyProps = {
  role: 'tooltip',
  interactive: true,
  allowHTML: true,
  placement: 'top-end',
  appendTo: document.body,
  showOnCreate: true,
  arrow: false,
  delay: [200, 200],
  maxWidth: 'none',
  onHidden(instance) {
    instance.destroy();
  },
};
