export let isScrollToBottom = Boolean(localStorage.getItem('scrollDown'));
export const setScrollToBottom = () => isScrollToBottom = !isScrollToBottom;
